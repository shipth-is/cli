import fs from 'node:fs'
import {Readable, Transform} from 'stream'

import {getNewUploadTicket} from '@cli/api/index.js'
import {getS3Error} from '@cli/utils/errors.js'

import type {LogFunction} from './types.d.js'

export const ON_PROGRESS_THROTTLE_MS = 2000

// Digital Ocean Spaces rejects a PUT above this size. Only multipart can send
// a larger file.
export const MAX_SINGLE_UPLOAD_SIZE = 5 * 1000 * 1000 * 1000

export function createProgressStream(
  totalSize: number, 
  onProgress: (sent: number, total: number) => void,
  throttleMs?: number
): Transform {
  let sent = 0
  let lastCallTime = 0
  
  return new Transform({
    transform(chunk, encoding, callback) {
      sent += chunk.length
      
      const now = Date.now()
      if (!throttleMs || now - lastCallTime >= throttleMs) {
        onProgress(sent, totalSize)
        lastCallTime = now
      }
      
      callback(null, chunk)
    },
  })
}

export interface ProgressData {
  progress: number
  loadedBytes: number
  totalBytes: number
  speedMBps: number
  elapsedSeconds: number
}

interface UploadProps {
  url: string
  zipStream: Readable
  zipSize: number
  onProgress: (data: ProgressData) => void
}

// Uploads a zip file with progress tracking
export function uploadZip({url, zipStream, zipSize, onProgress}: UploadProps): Promise<Response> {
  const startTime = Date.now()

  const progressStream = createProgressStream(zipSize, (sent, total) => {
    const elapsedSeconds = (Date.now() - startTime) / 1000
    const speedMBps = elapsedSeconds < 0.001 ? 0 : sent / elapsedSeconds / 1024 / 1024
    onProgress({
      progress: total ? sent / total : 0,
      loadedBytes: sent,
      totalBytes: total,
      speedMBps,
      elapsedSeconds,
    })
  }, ON_PROGRESS_THROTTLE_MS)

  const streamWithProgress = zipStream.pipe(progressStream)
  const webStream = Readable.toWeb(streamWithProgress) as ReadableStream<Uint8Array>

  // The 'duplex' property is required when using a ReadableStream as the request body.
  // 'duplex: half' indicates half-duplex communication (one direction at a time),
  // which is the mode needed for streaming request bodies with fetch().
  // Type assertion is necessary because 'duplex' is not yet part of the standard
  // TypeScript RequestInit type definition, though it's required by the fetch spec
  // for streaming uploads.
  const response = fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/zip',
      'Content-Length': zipSize.toString(),
    },
    body: webStream,
    duplex: 'half',
  } as RequestInit & {duplex: 'half'})

  return response
}

interface SingleUploadProps {
  filePath: string
  onProgress: (data: ProgressData) => void
  projectId: string
  vlog: LogFunction
  zipSize: number
}

// Uploads the zip in one request and returns the ID of the upload ticket
export async function singleUpload({
  filePath,
  onProgress,
  projectId,
  vlog,
  zipSize,
}: SingleUploadProps): Promise<string> {
  vlog('Requesting upload ticket...')
  const uploadTicket = await getNewUploadTicket(projectId)

  const response = await uploadZip({
    onProgress,
    url: uploadTicket.url,
    zipSize,
    zipStream: fs.createReadStream(filePath),
  })

  if (!response.ok) throw await getS3Error(response, 'Upload')

  return uploadTicket.id
}
