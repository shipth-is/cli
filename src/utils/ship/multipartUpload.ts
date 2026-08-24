import fs from 'node:fs'

import pLimit from 'p-limit'

import {
  abortMultipartUpload,
  completeMultipartUpload,
  getMultipartPartUrls,
  getNewMultipartUpload,
} from '@cli/api/index.js'
import type {MultipartPartUrl, MultipartUploadTicket, UploadedPart} from '@cli/types'

import type {LogFunction} from './types.d.js'
import type {ProgressData} from './upload.js'

// Below this size a single PUT is simpler. 16 MiB is two parts at the smallest
// part size the backend uses.
export const MULTIPART_MIN_SIZE = 16 * 1024 * 1024

// One part at a time is slower than a single PUT, so keep this above 1.
export const DEFAULT_CONCURRENCY = 8

export const MAX_PART_ATTEMPTS = 4
export const RETRY_BASE_DELAY_MS = 500

// The backend signs at most this many parts in one request
const SIGN_BATCH_SIZE = 1000

interface Part {
  partNumber: number
  size: number
  start: number
}

// fetch rejects a view backed by a SharedArrayBuffer, so the part body is
// pinned to a plain ArrayBuffer. A bare Uint8Array is too wide for it.
type PartBody = Uint8Array<ArrayBuffer>

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Splits the file into the parts to upload. Every part is partSize bytes,
// except the last one.
export function calculateParts(zipSize: number, partSize: number): Part[] {
  const parts: Part[] = []
  for (let start = 0; start < zipSize; start += partSize) {
    parts.push({
      partNumber: parts.length + 1,
      size: Math.min(partSize, zipSize - start),
      start,
    })
  }

  return parts
}

// Reads one part of the file into memory. The bytes stay in memory until the
// part uploads, so a retry does not read the file again.
async function readPart(filePath: string, part: Part): Promise<PartBody> {
  const handle = await fs.promises.open(filePath, 'r')
  try {
    const body = new Uint8Array(part.size)
    const {bytesRead} = await handle.read(body, 0, part.size, part.start)
    // A network mount can return less than it was asked for. Uploading the
    // short buffer would pad the part with zeros and corrupt the zip.
    if (bytesRead !== part.size) {
      throw new Error(`Part ${part.partNumber} read ${bytesRead} bytes, expected ${part.size}`)
    }

    return body
  } finally {
    await handle.close()
  }
}

// Signs every part number. The backend limits how many it signs in one request,
// so the part numbers go up in batches.
async function getPartUrls(uploadTicketId: string, partNumbers: number[]): Promise<MultipartPartUrl[]> {
  const batches: number[][] = []
  for (let i = 0; i < partNumbers.length; i += SIGN_BATCH_SIZE) {
    batches.push(partNumbers.slice(i, i + SIGN_BATCH_SIZE))
  }

  const signedBatches = await Promise.all(batches.map((batch) => getMultipartPartUrls(uploadTicketId, batch)))

  return signedBatches.flat()
}

// A retry runs after the attempt before it, so these awaits belong in the loop.
/* eslint-disable no-await-in-loop */
// Uploads one part and returns its ETag. Retries with an increasing delay.
async function uploadPart(
  uploadTicketId: string,
  part: Part,
  signedUrl: string,
  body: PartBody,
): Promise<string> {
  let url = signedUrl
  let lastError: Error = new Error(`Part ${part.partNumber} did not upload`)

  for (let attempt = 1; attempt <= MAX_PART_ATTEMPTS; attempt += 1) {
    if (attempt > 1) {
      await delay(RETRY_BASE_DELAY_MS * 2 ** (attempt - 2))
    }

    try {
      const response = await fetch(url, {
        body,
        headers: {'Content-Length': String(body.length)},
        method: 'PUT',
      })

      if (response.ok) {
        const etag = response.headers.get('etag')
        if (etag) return etag
        lastError = new Error(`Part ${part.partNumber} uploaded but returned no ETag`)
      } else {
        lastError = new Error(`Part ${part.partNumber} failed: ${response.status} ${response.statusText}`)
        // A signed URL lasts one hour. A slow upload can outlive it.
        if (response.status === 403) {
          const [fresh] = await getMultipartPartUrls(uploadTicketId, [part.partNumber])
          url = fresh.url
        }
      }
    } catch (error) {
      lastError = error as Error
    }
  }

  throw lastError
}
/* eslint-enable no-await-in-loop */

interface UploadPartsProps {
  concurrency?: number
  filePath: string
  onProgress: (data: ProgressData) => void
  ticket: MultipartUploadTicket
  zipSize: number
}

// Uploads the file in parts, several at a time. Progress is reported as each
// part finishes, which at the default part size is often enough for the log.
export async function uploadParts({
  concurrency = DEFAULT_CONCURRENCY,
  filePath,
  onProgress,
  ticket,
  zipSize,
}: UploadPartsProps): Promise<void> {
  const parts = calculateParts(zipSize, ticket.partSize)
  if (parts.length > ticket.maxParts) {
    throw new Error(`The zip file needs ${parts.length} parts but the server allows ${ticket.maxParts}`)
  }

  const urls = await getPartUrls(
    ticket.id,
    parts.map((part) => part.partNumber),
  )
  const urlByPartNumber = new Map(urls.map((url) => [url.partNumber, url.url]))

  const startTime = Date.now()
  let uploadedBytes = 0

  const limit = pLimit(concurrency)

  try {
    const uploaded = await Promise.all(
      parts.map((part) =>
        limit(async (): Promise<UploadedPart> => {
          const signedUrl = urlByPartNumber.get(part.partNumber)
          if (!signedUrl) throw new Error(`The server did not sign part ${part.partNumber}`)

          const body = await readPart(filePath, part)
          const etag = await uploadPart(ticket.id, part, signedUrl, body)

          uploadedBytes += part.size
          const elapsedSeconds = (Date.now() - startTime) / 1000
          onProgress({
            elapsedSeconds,
            loadedBytes: uploadedBytes,
            progress: uploadedBytes / zipSize,
            speedMBps: elapsedSeconds < 0.001 ? 0 : uploadedBytes / elapsedSeconds / 1024 / 1024,
            totalBytes: zipSize,
          })

          return {etag, partNumber: part.partNumber}
        }),
      ),
    )

    await completeMultipartUpload(ticket.id, uploaded)
  } catch (error) {
    // The parts already uploaded cost storage until something removes them
    await abortMultipartUpload(ticket.id).catch(() => {})
    throw error
  }
}

interface MultipartUploadProps {
  concurrency?: number
  filePath: string
  onProgress: (data: ProgressData) => void
  projectId: string
  vlog: LogFunction
  zipSize: number
}

// Uploads the zip in parts and returns the ID of the upload ticket
export async function multipartUpload({
  concurrency,
  filePath,
  onProgress,
  projectId,
  vlog,
  zipSize,
}: MultipartUploadProps): Promise<string> {
  vlog('Requesting multipart upload ticket...')
  const ticket = await getNewMultipartUpload(projectId, zipSize)

  vlog(`Uploading in parts of ${Math.round(ticket.partSize / 1024 / 1024)}MB...`)
  await uploadParts({concurrency, filePath, onProgress, ticket, zipSize})

  return ticket.id
}
