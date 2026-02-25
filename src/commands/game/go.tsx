import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {Go} from '@cli/components/Go.js'
import {CommandGame} from '@cli/components/index.js'

import {render} from 'ink'

export default class GameGo extends BaseGameCommand<typeof GameGo> {
  static override args = {}
  static override description = 'Preview your game in the ShipThis Go app.'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {
    ...BaseGameCommand.flags,
  }

  public async run(): Promise<void> {
    await this.ensureWeAreInAProjectDir()
    const gameId = this.getGameId()
    if (!gameId) {
      this.error('No game ID found')
    }

    const handleComplete = () => process.exit(0)
    const handleError = (error: any) => {
      this.error(`Error generating go build: ${error}`)
    }

    render(
      <CommandGame command={this}>
        <Go onComplete={handleComplete} onError={handleError} />
      </CommandGame>,
    )
  }
}
