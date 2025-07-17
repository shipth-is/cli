import {Command, Help, Interfaces} from '@oclif/core'

// Custom help - lets hide the "internal" topic from the help output
export default class CustomHelp extends Help {
  // formatCommand is protected, so we need to override it to make it public
  exposedFormatCommand(command: Command.Loadable): string {
    return super.formatCommand(command)
  }

  formatTopics(topics: Interfaces.Topic[]): string {
    const publicTopics = topics.filter((t) => t.name !== 'internal')
    return super.formatTopics(publicTopics)
  }
}
