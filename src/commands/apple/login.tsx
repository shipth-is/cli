import {Flags} from '@oclif/core'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {getNewAuthState} from '@cli/apple/auth.js'
import {getMaskedInput, getInput} from '@cli/utils/index.js'

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

    const getAppleEmail = async (): Promise<string> => {
      if (flags.appleEmail) return flags.appleEmail
      const appleEmail = await getInput('Please enter your Apple email address: ')
      if (!appleEmail) throw new Error('Email address is required')
      return appleEmail
    }

    // This uses getMaskedInput so that it doesn't echo the password
    const getApplePassword = async (): Promise<string> => {
      const applePassword = await getMaskedInput('Please enter your Apple password: ')
      if (!applePassword) throw new Error('Password is required')
      return applePassword
    }

    const appleEmail = await getAppleEmail()
    const applePassword = await getApplePassword()

    const get2FA = async (): Promise<string> => {
      const otp = await getInput('Please enter the 2FA code: ')
      if (!otp) throw new Error('2FA code is required')
      return otp
    }

    const authState = await getNewAuthState(appleEmail, applePassword, get2FA)

    if (!authState) {
      throw new Error('Failed to authenticate with Apple')
    }

    await this.setAppleCookies(authState.cookies)

    if (!this.flags.quiet) await this.config.runCommand(`apple:status`)

    this.exit(0)
  }
}
