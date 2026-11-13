import {Flags} from '@oclif/core'
import axios from 'axios'

import {acceptTerms, setAuthToken} from '@cli/api/index.js'
import {BaseCommand} from '@cli/baseCommands/index.js'
import {API_URL, WEB_URL} from '@cli/constants/index.js'
import {AuthConfig, SelfWithJWT} from '@cli/types'
import {getErrorMessage, getInput} from '@cli/utils/index.js'

const TERMS_URL = new URL('/terms', WEB_URL).href
const PRIVACY_URL = new URL('/privacy', WEB_URL).href

// A 429 can ask for a wait of up to a day (the hour and day limits). The CLI waits only for short ones.
const MAX_WAIT_SECONDS = 60

// The codes the API puts in the body of a /verify 401
const WRONG_CODE = 'OTP_WRONG'
const NEEDS_NEW_CODE = ['OTP_EXPIRED', 'OTP_LOCKED']

// Returns the 6-digit login code with the spaces removed, or null if the input is not 6 digits
function parseLoginCode(input: string): null | string {
  const loginCode = input.replaceAll(/\s/g, '')
  return /^\d{6}$/.test(loginCode) ? loginCode : null
}

function getApiErrorCode(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined
  return error.response?.data?.code
}

// Returns the seconds to wait from a 429, or undefined for any other error
function getRetryAfterSeconds(error: unknown): number | undefined {
  if (!axios.isAxiosError(error) || error.response?.status !== 429) return undefined
  return Number(error.response.data?.retryAfter) || 1
}

const sleep = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

// Shows "Waiting N seconds..." on one line and counts down to 0
async function waitWithCountdown(seconds: number): Promise<void> {
  for (let secondsLeft = seconds; secondsLeft > 0; secondsLeft--) {
    const unit = secondsLeft === 1 ? 'second' : 'seconds'
    process.stdout.write(`\rWaiting ${secondsLeft} ${unit} before sending a new code...`)
    await sleep(1000)
  }

  // Clear the countdown line
  process.stdout.write('\r\u001B[K')
}

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
    const source = `shipthis-cli-${this.config.version}`

    // Sends the email. A 429 with a short wait counts down and sends again.
    const sendLoginCode = async (): Promise<void> => {
      for (;;) {
        try {
          await axios.post(`${API_URL}/auth/email/send`, {email, source})
          this.log(`We sent a 6-digit code to ${email}. The code expires in 5 minutes.`)
          return
        } catch (error) {
          const retryAfterSeconds = getRetryAfterSeconds(error)
          if (retryAfterSeconds === undefined) {
            this.error(getErrorMessage(error), {exit: 1})
          }

          if (retryAfterSeconds > MAX_WAIT_SECONDS) {
            this.error(`Please wait before you ask for a new code. Try again in ${retryAfterSeconds} seconds.`, {
              exit: 1,
            })
          }

          await waitWithCountdown(retryAfterSeconds)
        }
      }
    }

    // Asks until the input is 6 digits
    const askForLoginCode = async (): Promise<string> => {
      for (;;) {
        const loginCode = parseLoginCode(await getInput('Enter the 6-digit code from the email: '))
        if (loginCode) return loginCode
        this.log('The code has 6 digits.')
      }
    }

    const askToSendNewCode = async (): Promise<boolean> => {
      const answer = await getInput('Send a new code? (Y/n): ')
      return !answer.trim().toLowerCase().startsWith('n')
    }

    // Asks for the code until it is correct. Offers a new code when the old one stops working.
    const logInWithLoginCode = async (): Promise<SelfWithJWT> => {
      for (;;) {
        const loginCode = await askForLoginCode()
        try {
          const {data} = await axios.post(`${API_URL}/auth/email/verify`, {email, otp: loginCode, source})
          return data
        } catch (error) {
          const errorCode = getApiErrorCode(error)
          const canTryAgain = errorCode === WRONG_CODE || NEEDS_NEW_CODE.includes(`${errorCode}`)
          if (!canTryAgain) this.error(getErrorMessage(error), {exit: 1})

          this.log(getErrorMessage(error))
          if (errorCode === WRONG_CODE) continue

          if (!(await askToSendNewCode())) this.exit(1)
          await sendLoginCode()
        }
      }
    }

    await sendLoginCode()
    const shipThisUser = await logInWithLoginCode()

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
