import {Interfaces, Help, Command} from '@oclif/core'

// Custom help - lets hide the "internal" topic from the help output
export default class CustomHelp extends Help {
  formatTopics(topics: Interfaces.Topic[]): string {
    const publicTopics = topics.filter((t) => t.name !== 'internal')
    return super.formatTopics(publicTopics)
  }

  // formatCommand is protected, so we need to override it to make it public
  exposedFormatCommand(command: Command.Loadable): string {
    return super.formatCommand(command)
  }
}
