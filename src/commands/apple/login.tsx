import {Flags} from '@oclif/core'
import {promises as readline} from 'node:readline'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {getNewAuthState} from '@cli/apple/auth.js'

export default class AppleLogin extends BaseAuthenticatedCommand<typeof AppleLogin> {
  static override args = {}

  static override description = 'Authenticate with Apple - saves the session to the auth file'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --force --appleEmail me@email.nowhere',
  ]

  static override flags = {
    force: Flags.boolean({char: 'f'}),
    appleEmail: Flags.string({
      char: 'e',
      description: 'Your Apple email address',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = this

    const isLoggedIn = await this.hasValidAppleAuthState()
    if (isLoggedIn && !flags.force) {
      throw new Error('You are already logged in to Apple. Use --force to re-authenticate.')
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const getAppleEmail = async (): Promise<string> => {
      if (flags.appleEmail) return flags.appleEmail
      const appleEmail = await rl.question('Please enter your Apple email address: ')
      if (!appleEmail) throw new Error('Email address is required')
      return appleEmail
    }

    // TODO: important! - make it so it doesn't echo the password
    const getApplePassword = async (): Promise<string> => {
      console.warn('TODO: implement password masking - WARNING! your password will be shown below:')
      const applePassword = await rl.question('Please enter your Apple password: ')
      if (!applePassword) throw new Error('Password is required')
      return applePassword
    }

    const appleEmail = await getAppleEmail()
    const applePassword = await getApplePassword()

    const get2FA = async (): Promise<string> => {
      const otp = await rl.question('Please enter the 2FA code: ')
      if (!otp) throw new Error('2FA code is required')
      return otp
    }

    const authState = await getNewAuthState(appleEmail, applePassword, get2FA)

    if (!authState) {
      throw new Error('Failed to authenticate with Apple')
    }

    await this.setAppleCookies(authState.cookies)

    await this.config.runCommand(`apple:status`)

    this.exit(0)
  }
}
