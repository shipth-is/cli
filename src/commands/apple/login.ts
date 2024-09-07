import axios from 'axios'
import {Flags} from '@oclif/core'
import {colorize, stderr} from '@oclif/core/ux'
import {promises as readline} from 'node:readline'

import {BaseCommand} from '@cli/baseCommands'
import {API_URL} from '@cli/config'

export default class Login extends BaseCommand<typeof Login> {
  static override args = {}

  static override description = 'Authenticate with Apple - saves the session to the auth file'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --force --email me@email.nowhere',
  ]

  static override flags = {
    force: Flags.boolean({char: 'f'}),
    email: Flags.string({
      char: 'e',
      description: 'Your Apple email address',
    }),
  }

  public async run(): Promise<void> {
    try {
      const {flags} = this

      const authConfig = await this.getAuthConfig()
      if (authConfig.shipThisUser && !flags.force) {
        throw new Error(
          `You are already logged in as ${authConfig.shipThisUser.email} use --force to login as a different user or remove the auth file`,
        )
      }
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      const getEmail = async (): Promise<string> => {
        if (flags.email) return flags.email
        const email = await rl.question('Please enter your email address: ')
        if (!email) throw new Error('Email address is required')
        return email
      }

      const email = await getEmail()

      await axios.post(`${API_URL}/auth/email/send`, {email})

      this.log('Please check your email for an email with an OTP.')

      const getOTP = async (): Promise<string> => {
        const otp = await rl.question('Please enter the OTP: ')
        if (!otp) throw new Error('OTP is required')
        return otp
      }

      const otp = await getOTP()

      const {data: shipThisUser} = await axios.post(`${API_URL}/auth/email/verify`, {email, otp})

      await this.setAuthConfig({shipThisUser})

      this.log('You are now logged in as', shipThisUser.email)
      this.exit(0)
    } catch (err: any) {
      stderr(colorize('#FF0000', err.message))
      this.exit(1)
    }
  }
}
