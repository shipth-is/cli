import fs from 'node:fs'

import pLimit from 'p-limit'

import {
  abortMultipartUpload,
  completeMultipartUpload,
  getMultipartPartUrls,
  getNewMultipartUpload,
} from '@cli/api/index.js'
import type {MultipartPartUrl, MultipartUploadTicket, UploadedPart} from '@cli/types'
import {getResponseError, isRetryable} from '@cli/utils/errors.js'

import type {LogFunction} from './types.d.js'
import type {ProgressData} from './upload.js'

// Below this size a single PUT is simpler. 16 MiB is two parts at the smallest
// part size the backend uses.
export const MULTIPART_MIN_SIZE = 16 * 1024 * 1024

// One part at a time is slower than a single PUT, so keep this above 1.
export const DEFAULT_CONCURRENCY = 8

// Eight attempts wait at most 61.5 seconds in total. That covers a router
// restart, or a handover between two wifi points.
export const MAX_ATTEMPTS = 8
const BASE_DELAY_MS = 500
const MAX_DELAY_MS = 30_000

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

type OnRetry = (error: unknown, attempt: number, delayMs: number) => void

// Calls run until it returns, or until the attempts run out.
// Each attempt waits after the one before it, so these awaits belong in a loop.
/* eslint-disable no-await-in-loop */
export async function withRetry<T>(run: () => Promise<T>, onRetry: OnRetry): Promise<T> {
  let lastError: unknown = new Error('The operation did not run')

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return await run()
    } catch (error) {
      lastError = error
      if (attempt === MAX_ATTEMPTS || !isRetryable(error)) break

      // Wait longer after each failure, up to the cap. Half of the wait is
      // random, so that parts which failed together do not retry together.
      const backoff = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** (attempt - 1))
      const waitMs = backoff / 2 + Math.random() * (backoff / 2)
      onRetry(error, attempt, waitMs)
      await delay(waitMs)
    }
  }

  throw lastError
}
/* eslint-enable no-await-in-loop */

// Logs a failed attempt, so a slow upload shows why it is slow
const logRetry = (vlog: LogFunction, what: string): OnRetry => (error, attempt, delayMs) => {
  const message = error instanceof Error ? error.message : String(error)
  vlog(`${what} attempt ${attempt} failed (${message}). Retrying in ${(delayMs / 1000).toFixed(1)}s...`)
}

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

// Uploads one part and returns its ETag
async function uploadPart(
  uploadTicketId: string,
  part: Part,
  signedUrl: string,
  body: PartBody,
  vlog: LogFunction,
): Promise<string> {
  let url = signedUrl

  return withRetry(
    async () => {
      const response = await fetch(url, {
        body,
        headers: {'Content-Length': String(body.length)},
        method: 'PUT',
      })

      if (!response.ok) {
        // A signed URL lasts one hour, and a slow upload can outlive it. This is
        // the one 403 worth another attempt, so it throws an error with no
        // status rather than one isRetryable would refuse.
        if (response.status === 403) {
          const [fresh] = await getMultipartPartUrls(uploadTicketId, [part.partNumber])
          url = fresh.url
          throw new Error(`Part ${part.partNumber} failed: the signed URL expired`)
        }

        throw getResponseError(response, `Part ${part.partNumber}`)
      }

      const etag = response.headers.get('etag')
      if (!etag) throw new Error(`Part ${part.partNumber} uploaded but returned no ETag`)

      return etag
    },
    logRetry(vlog, `Part ${part.partNumber}`),
  )
}

interface UploadPartsProps {
  concurrency?: number
  filePath: string
  onProgress: (data: ProgressData) => void
  ticket: MultipartUploadTicket
  vlog: LogFunction
  zipSize: number
}

// Uploads the file in parts, several at a time. Progress is reported as each
// part finishes, which at the default part size is often enough for the log.
export async function uploadParts({
  concurrency = DEFAULT_CONCURRENCY,
  filePath,
  onProgress,
  ticket,
  vlog,
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
          const etag = await uploadPart(ticket.id, part, signedUrl, body, vlog)

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

    // Every byte is uploaded by now. Losing this call to one bad moment would
    // throw all of it away, so it gets the same retry as a part.
    await withRetry(() => completeMultipartUpload(ticket.id, uploaded), logRetry(vlog, 'Completing the upload'))
  } catch (error) {
    // Promise.all rejects on the first failed part, but p-limit keeps starting
    // the parts behind it. Without this the rest of the file uploads to an
    // upload that is already being cancelled.
    limit.clearQueue()
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

  try {
    vlog(`Uploading in parts of ${Math.round(ticket.partSize / 1024 / 1024)}MB...`)
    await uploadParts({concurrency, filePath, onProgress, ticket, vlog, zipSize})
  } catch (error) {
    // The parts already uploaded cost storage until something removes them. The
    // bucket also clears an upload that was never completed after 7 days.
    await abortMultipartUpload(ticket.id).catch(() => {})
    throw error
  }

  return ticket.id
}
