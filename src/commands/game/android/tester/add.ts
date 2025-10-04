import {getAuthedHeaders} from '@cli/api/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {API_URL} from '@cli/constants/config.js'
import {getErrorMessage} from '@cli/utils/errors.js'
import {Args, Command, Flags} from '@oclif/core'
import axios from 'axios'
import {niceError} from '@cli/utils/query/useAndroidServiceAccountTestResult.js'

async function addTester(projectId: string, email: string) {
  const headers = getAuthedHeaders()
  try {
    const {data} = await axios.post(
      `${API_URL}/projects/${projectId}/credentials/android/key/testers/`,
      {email},
      {
        headers,
      },
    )
    return data
  } catch (error) {
    // If it is an issue with the service account key - format the error nicely
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        if (!('error' in error.response.data)) throw error
        const {error: keyTestError} = error.response.data
        throw new Error(niceError(keyTestError))
      }
    }
    throw error
  }
}

async function getTesters(projectId: string) {
  const headers = getAuthedHeaders()
  const {data} = await axios.get(`${API_URL}/projects/${projectId}/credentials/android/key/testers/`, {
    headers,
  })
  return data
}

export default class GameAndroidTesterAdd extends BaseGameCommand<typeof GameAndroidTesterAdd> {
  static override args = {
    file: Args.string({description: 'file to read'}),
  }
  static override description = 'describe the command here'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {
    ...BaseGameCommand.flags,
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    
    const testers = await getTesters(game.id)
    console.log(JSON.stringify(testers, null, 2))

    const addResp = await addTester(game.id, 'david@lunchme.xyz')
    console.log(JSON.stringify(addResp, null, 2))

    console.log('getting testers again')

    const testersAfter = await getTesters(game.id)
    console.log(JSON.stringify(testersAfter, null, 2))
  }
}
