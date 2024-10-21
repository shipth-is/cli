import axios from 'axios'
import {Flags} from '@oclif/core'

import {BaseCommand} from '@cli/baseCommands/index.js'
import {API_URL} from '@cli/constants/index.js'
import {AuthConfig} from '@cli/types'
import {getInput} from '@cli/utils/index.js'

export default class Login extends BaseCommand<typeof Login> {
  static override args = {}

  static override description = 'Authenticate - will create a new account if one does not exist.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --force --email me@email.nowhere',
  ]

  static override flags = {
    force: Flags.boolean({char: 'f'}),
    email: Flags.string({
      char: 'e',
      description: 'Your email address',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = this

    const authConfig: AuthConfig = await this.getAuthConfig()
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

    const {data: shipThisUser} = await axios.post(`${API_URL}/auth/email/verify`, {email, otp})

    await this.setAuthConfig({shipThisUser})

    this.log('You are now logged in as', shipThisUser.email)

    // Run the status command
    await this.config.runCommand('status')
  }
}
