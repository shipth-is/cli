import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import {expect} from 'chai'

// Point the API at a closed local port so importCredential rejects without touching
// the network. This must happen before the modules that read it are loaded.
process.env.SHIPTHIS_DOMAIN = '127.0.0.1:1'
const {importKeystore} = await import('@cli/utils/query/useImportKeystore.js')

async function expectRejection(promise: Promise<unknown>): Promise<void> {
  try {
    await promise
  } catch {
    return
  }

  expect.fail('Expected importKeystore to reject')
}

const generatedZips = (dir: string) => fs.readdirSync(dir).filter((f) => f.startsWith('shipthis-keyStore-'))

describe('importKeystore (query/useImportKeystore)', () => {
  let workDir: string
  let originalCwd: string
  let jksFilePath: string

  beforeEach(() => {
    originalCwd = process.cwd()
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'shipthis-keystore-test-'))
    jksFilePath = path.join(workDir, 'keyStore.jks')
    fs.writeFileSync(jksFilePath, 'not-a-real-keystore')
    process.chdir(workDir)
  })

  afterEach(() => {
    process.chdir(originalCwd)
    fs.rmSync(workDir, {force: true, recursive: true})
  })

  it('removes the generated zip when the import rejects', async () => {
    await expectRejection(
      importKeystore({
        gameId: 'test-game-id',
        jksFilePath,
        keyPassword: 'key-password',
        keystorePassword: 'keystore-password',
      }),
    )

    // The generated zip holds the keystore and both passwords in plaintext
    expect(generatedZips(workDir)).to.deep.equal([])
  })

  it('never deletes a caller supplied zip when the import rejects', async () => {
    const callerZip = path.join(workDir, 'my-own-keystore.zip')
    fs.writeFileSync(callerZip, 'caller supplied zip')

    await expectRejection(importKeystore({gameId: 'test-game-id', zipFilePath: callerZip}))

    expect(fs.existsSync(callerZip)).to.equal(true)
  })

  it('rejects rather than hanging when the zip cannot be written', async () => {
    await expectRejection(
      importKeystore({
        gameId: 'test-game-id',
        jksFilePath: path.join(workDir, 'does-not-exist.jks'),
        keyPassword: 'key-password',
        keystorePassword: 'keystore-password',
      }),
    )

    expect(generatedZips(workDir)).to.deep.equal([])
  })
})
