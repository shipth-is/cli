import {Box, render, Text} from 'ink'

import {getEncryptionKey} from '@cli/api/credentials/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {Command, StatusTable} from '@cli/components/index.js'
import {getShortDate} from '@cli/utils/index.js'

export default class GameEncryptionStatus extends BaseGameCommand<typeof GameEncryptionStatus> {
  static override args = {}

  static override description = 'Shows if encryption is on for a game, and the fingerprint of its key.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    ...BaseGameCommand.flags,
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const credential = await getEncryptionKey(game.id)

    render(
      <Command command={this}>
        <Box flexDirection="column" gap={1}>
          <StatusTable
            statuses={{
              Encryption: game.details?.useEncryption ? 'On' : 'Off',
              Key: credential
                ? `${credential.serialNumber} (created ${getShortDate(credential.createdAt)})`
                : 'None yet - it is made when you turn encryption on',
            }}
            title="Encryption"
          />
          <Text>Works on Godot 4.5+ for iOS and Android.</Text>
        </Box>
      </Command>,
    )
  }
}
