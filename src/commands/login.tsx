import {Flags} from '@oclif/core'
import axios from 'axios'

import {acceptTerms, setAuthToken} from '@cli/api/index.js'
import {BaseCommand} from '@cli/baseCommands/index.js'
import {API_URL, WEB_URL} from '@cli/constants/index.js'
import {AuthConfig} from '@cli/types'
import {getInput} from '@cli/utils/index.js'

const TERMS_URL = new URL('/terms', WEB_URL).href
const PRIVACY_URL = new URL('/privacy', WEB_URL).href

export default class Login extends BaseCommand<typeof Login> {
  static override args = {}

  static override description = 'Authenticate - will create a new account if one does not exist.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --force --email me@email.nowhere',
    '<%= config.bin %> <%= command.id %> --acceptAgreements',
  ]

  static override flags = {
    email: Flags.string({
      char: 'e',
      description: 'Your email address',
    }),
    force: Flags.boolean({char: 'f'}),
    acceptAgreements: Flags.boolean({
      description: 'Accept the current version of the agreements (terms & privacy).',
      default: false,
    }),
  }

  public async run(): Promise<void> {
    const {flags} = this

    const authConfig: AuthConfig = await this.getAuthConfig()

    // shipthis login --acceptAgreements
    // works when logged in too. does not perform any other action
    if (flags.acceptAgreements) {
      if (authConfig.shipThisUser) {
        await acceptTerms()
        return this.log('You have accepted the latest terms and privacy policy.')
      }
    }

    if (authConfig.shipThisUser && !flags.force) {
      throw new Error(
        `You are already logged in as ${authConfig.shipThisUser.email} use --force to login as a different user or remove the auth file`,
      )
    }

    const getEmail = async (): Promise<string> => {
      if (flags.email) return flags.email
      const email = await getInput('Please enter your email address: ')
      if (!email) throw new Error('Email address is required')
      return email
    }

    const email = await getEmail()

    await axios.post(`${API_URL}/auth/email/send`, {email})

    this.log('Please check your email for an email with an OTP.')

    const getOTP = async (): Promise<string> => {
      const otp = await getInput('Please enter the OTP: ')
      if (!otp) throw new Error('OTP is required')
      return otp
    }

    const otp = await getOTP()

    const source = `shipthis-cli-${this.config.version}`
    const {data: shipThisUser} = await axios.post(`${API_URL}/auth/email/verify`, {email, otp, source})

    const getAcceptedTermsResponse = async (): Promise<boolean> => {
      if (flags.acceptAgreements) return true
      console.log(
        `Please review the following documents:\n\n${[
          `- Privacy Policy: ${PRIVACY_URL}`,
          `- Terms and Conditions: ${TERMS_URL}`,
        ].join('\n')}\n`,
      )
      const accepted = await getInput('Do you accept the terms of these documents? (yes/no): ')
      const answer = accepted.toLowerCase().trim().slice(0, 1)
      return answer === 'y'
    }

    await this.setAuthConfig({shipThisUser})
    setAuthToken(shipThisUser.jwt) // Apply the auth token - this is done in the baseCommand.init method
    this.log('You are now logged in as', shipThisUser.email)

    if (!shipThisUser.details?.hasAcceptedTerms) {
      const didAccept = await getAcceptedTermsResponse()
      if (!didAccept) throw new Error('You must accept the terms to continue')
      await acceptTerms()
    }

    // Run the status command
    await this.config.runCommand('status')
  }
}
