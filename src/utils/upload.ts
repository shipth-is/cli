import {Readable, Transform} from 'stream'

export const ON_PROGRESS_THROTTLE_MS = 1000

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

interface ProgressData {
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
    onProgress({
      progress: total ? sent / total : 0,
      loadedBytes: sent,
      totalBytes: total,
      speedMBps: sent / elapsedSeconds / 1024 / 1024,
      elapsedSeconds,
    })
  }, ON_PROGRESS_THROTTLE_MS)

  const streamWithProgress = zipStream.pipe(progressStream)
  const webStream = Readable.toWeb(streamWithProgress) as ReadableStream<Uint8Array>

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
