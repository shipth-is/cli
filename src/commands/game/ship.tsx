import {BaseGameCommand} from '@cli/baseCommands/baseGameCommand.js'

import {CommandGame, Ship} from '@cli/components/index.js'
import {render} from 'ink'

export default class GameShip extends BaseGameCommand<typeof GameShip> {
  static override args = {}

  static override description = 'Builds the app (for all platforms with valid credentials) and ships it to the stores.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    await this.ensureWeAreInAProjectDir()

    const handleComplete = () => process.exit(0)
    const handleError = (e: Error) => {
      // The ship component shows the error - we just fail
      // TODO: specific error codes?
      process.exit(1)
    }

    render(
      <CommandGame command={this}>
        <Ship onComplete={handleComplete} onError={handleError} />
      </CommandGame>,
    )
  }
}
