import appleUtils from '@expo/apple-utils'
import {Flags} from '@oclif/core'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {getRenderedMarkdown} from '@cli/components/index.js'
import {getInput, getMaskedInput} from '@cli/utils/index.js'

// @expo/apple-utils is CommonJS, so it has to be imported as a default and destructured -
// see src/apple/expo.ts. We import Auth directly here rather than via that shim, so that
// everything which touches your Apple password is readable in this one file.
const {Auth} = appleUtils

const SOURCE_URL = 'https://github.com/shipth-is/cli/blob/main/src/commands/apple/login.ts'

// TODO: remove once Apple's config endpoint works again, or @expo/apple-utils stops needing it.
// That endpoint has 404'd since 2026-09-11, which surfaces as "iTunes service key is empty"
// (expo/eas-cli#4392, fastlane/fastlane#30199). Not a secret - App Store Connect sends the same
// value as X-Apple-Widget-Key.
const APPLE_SERVICE_KEY = 'e0b80c3bf78523bfe80974d320935bfa30add02e1bff88ec2166c6bd5a706c42'

export default class AppleLogin extends BaseAuthenticatedCommand<typeof AppleLogin> {
  static override args = {}

  static override description = `Authenticate with Apple - saves the session to the auth file.

Your Apple password is sent only to Apple, never to ShipThis. Only the resulting session cookies are saved locally. Read the source: ${SOURCE_URL}`

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --force --appleEmail me@email.nowhere',
    '<%= config.bin %> <%= command.id %> --logout',
  ]

  static override flags = {
    appleEmail: Flags.string({
      char: 'e',
      description: 'Your Apple Developer email address',
    }),
    force: Flags.boolean({char: 'f'}),
    quiet: Flags.boolean({char: 'q', description: 'Avoid output except for interactions and errors'}),
    logout: Flags.boolean({char: 'l', description: 'Forget the saved Apple session (log out)'}),
  }

  public async run(): Promise<void> {
    const {flags} = this

    // Only set if unset, so it can still be overridden from the environment.
    if (!process.env.EXPO_APP_STORE_AUTH_SERVICE_KEY) {
      process.env.EXPO_APP_STORE_AUTH_SERVICE_KEY = APPLE_SERVICE_KEY
    }

    if (flags.logout) {
      await this.setAppleCookies(undefined)
      if (!this.flags.quiet) this.log('You have been logged out of Apple.')
      await this.config.runCommand(`apple:status`)
      return
    }

    const isLoggedIn = await this.hasValidAppleAuthState()
    if (isLoggedIn && !flags.force) {
      throw new Error('You are already logged in to Apple. Use --force to re-authenticate.')
    }

    // Shown even when --quiet - the iOS wizard runs this with --quiet
    this.log(
      getRenderedMarkdown({
        filename: 'apple-login-notice.md.ejs',
        templateVars: {
          sourceURL: `https://github.com/shipth-is/cli/blob/v${this.config.version}/src/commands/apple/login.ts`,
        },
      }),
    )

    const getAppleEmail = async (): Promise<string> => {
      if (flags.appleEmail) return flags.appleEmail
      const appleEmail = await getInput('Please enter your Apple Developer account email address: ')
      if (!appleEmail) throw new Error('Email address is required')
      return appleEmail
    }

    // This uses getMaskedInput so that it doesn't echo the password
    const getApplePassword = async (): Promise<string> => {
      const applePassword = await getMaskedInput('Please enter your Apple Developer password: ')
      if (!applePassword) throw new Error('Password is required')
      return applePassword
    }

    const appleEmail = await getAppleEmail()
    const applePassword = await getApplePassword()

    // The password goes to Apple here and is not used anywhere else
    const authState = await Auth.loginAsync({
      password: applePassword,
      username: appleEmail,
    })

    if (!authState) {
      throw new Error('Failed to authenticate with Apple')
    }

    // Session cookies are saved to the local auth file
    await this.setAppleCookies(authState.cookies)

    if (!this.flags.quiet) await this.config.runCommand(`apple:status`)

  }
}
