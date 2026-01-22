import fs from 'node:fs'
import {ZipFile} from 'yazl'

import {createProgressStream, ON_PROGRESS_THROTTLE_MS} from './upload.js'

// Used to estimate the final zip size
const COMPRESSION_RATIO = 0.65

export interface ZipProgressData {
  progress: number
  writtenBytes: number
  estimatedTotalBytes: number
  sourceTotalBytes: number
  elapsedSeconds: number
  speedMBps: number
}

interface CreateZipProps {
  files: string[]
  outputPath: string
  onProgress: (data: ZipProgressData) => void
}

// Creates a zip file with progress tracking
export async function createZip({files, outputPath, onProgress}: CreateZipProps): Promise<void> {
  const startTime = Date.now()

  const statPromises = files.map(async (file) => {
    try {
      return await fs.promises.stat(file)
    } catch {
      // Skip inaccessible files
      return null
    }
  })

  const statsResults = await Promise.all(statPromises)

  let totalSourceSize = 0
  for (const stats of statsResults) {
    if (stats) {
      totalSourceSize += stats.size
    }
  }

  const estimatedZipSize = Math.max(Math.round(totalSourceSize * COMPRESSION_RATIO), 1)

  const zipFile = new ZipFile()
  for (const file of files) {
    zipFile.addFile(file, file)
  }

  return new Promise<void>((resolve, reject) => {
    const outputStream = fs.createWriteStream(outputPath)

    const progressStream = createProgressStream(estimatedZipSize, (written, total) => {
      const elapsedSeconds = (Date.now() - startTime) / 1000
      const speedMBps = elapsedSeconds < 0.001 ? 0 : written / elapsedSeconds / 1024 / 1024
      onProgress({
        progress: total ? Math.min(1, written / total) : 0,
        writtenBytes: written,
        estimatedTotalBytes: total,
        sourceTotalBytes: totalSourceSize,
        elapsedSeconds,
        speedMBps,
      })
    }, ON_PROGRESS_THROTTLE_MS)

    zipFile.outputStream
      .pipe(progressStream)
      .pipe(outputStream)
      .on('close', () => resolve())
      .on('error', reject)

    zipFile.end()
  })
}

