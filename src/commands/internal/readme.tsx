import {Args, Command, Config, Flags} from '@oclif/core'

import ejs from 'ejs'
import path from 'path'
import fs from 'fs'

import {BaseCommand} from '@cli/baseCommands/index.js'
import {Topic} from '@oclif/core/interfaces'
import CustomHelp from '@cli/utils/help.js'

const ROOT_TOPIC_NAME = 'shipthis'
const ROOT_TOPIC_DESCRIPTION = 'Root topic'
const ROOT_TOPIC_FILENAME = 'README.md'

// Used when we have separate files for the subtopics and commands
const TOPIC_TEMPLATE = `
# <%= topic.name.replaceAll(":", " ") %>

<%= topic.description || "" %>

<% if (subTopics && subTopics.length > 0) { -%>
## Topics

<% subTopics.forEach(subTopic => { -%>
- [<%= subTopic.topic.name %>](<%= subTopic.filePath %>)
<% }) -%>
<% } -%>

<% if (commands && commands.length > 0) { -%>
## Commands

<% commands.forEach(readmeCommand => { -%>
- [<%= readmeCommand.command.id %>](<%= readmeCommand.filePath %>)
<% }) -%>
<% } -%>
`.trim()

// Used when we include the subtopics and commands in the current file
const TOPIC_TEMPLATE_INCLUDE = `
# <%= topic.name.replaceAll(":", " ") %>

<%= topic.description || "" %>

<% if (subTopics && subTopics.length > 0) { -%>
## Topics

<% subTopics.forEach(subTopic => { %>
<%- subTopic.rendered %>
<% }) -%>
<% } -%>

<% if (commands && commands.length > 0) { -%>
## Commands

<% commands.forEach(readmeCommand => { %>
<%- readmeCommand.renderedForInclude %>
<% }) -%>
<% } -%>
`.trim()

const COMMAND_TEMPLATE = `
# <%= command.id %>

## Description

<%= command.description || "" %>

## Help Output

\`\`\`
<%- helpOutput %>
\`\`\`
`.trim() // Remove the leading newline

// When we include the rendered command in-line in the topic file
const COMMAND_TEMPLATE_INCLUDE = `
### <%= command.id %>

#### Description

<%= command.description || "" %>

#### Help Output

\`\`\`
<%- helpOutput %>
\`\`\`
`.trim() // Remove the leading newline

interface ReadmeTopic {
  topic: Topic
  filePath: string
  subTopics: ReadmeTopic[]
  commands: ReadmeCommand[]
  includeTopicsAndCommands: boolean // Whether to include the topics and commands in the rendered output
  rendered?: string
}

type TopicTree = Record<string, ReadmeTopic>

interface ReadmeCommand {
  command: Command.Loadable
  filePath: string
  renderedForInclude?: string
  renderedForFile?: string
}

// This is ugly...
function getTopicTree(topics: Topic[], commands: Command.Loadable[], separateFileDepth: number): TopicTree {
  const commandIds = commands.map((command) => command.id)
  // Remove the internal topic
  const nonInternalTopics = topics.filter((topic) => topic.name !== 'internal')
  const nonCommandTopics = nonInternalTopics.filter((topic) => !commandIds.includes(topic.name))

  let topicTree: TopicTree = {
    [ROOT_TOPIC_NAME]: {
      filePath: ROOT_TOPIC_FILENAME,
      topic: {name: ROOT_TOPIC_NAME, description: ROOT_TOPIC_DESCRIPTION},
      subTopics: [],
      commands: [],
      includeTopicsAndCommands: separateFileDepth === 0,
    },
  }

  const topicsByName = Object.fromEntries(topics.map((topic) => [topic.name, topic]))

  for (const topic of nonCommandTopics) {
    const topicPath = topic.name.split(':')
    let currentParent = topicTree[ROOT_TOPIC_NAME]

    for (let i = 0; i < topicPath.length; i++) {
      const name = topicPath.slice(0, i + 1).join(':')
      const subTopic = currentParent.subTopics.find((subTopic) => subTopic.topic.name === name)

      if (!subTopic) {
        const currentDepth = i + 1
        const includeTopicsAndCommands = currentParent.includeTopicsAndCommands || currentDepth >= separateFileDepth
        const newSubTopic = {
          topic: topicsByName[name],
          subTopics: [],
          commands: [],
          filePath: `${path.join(...name.split(':'))}`,
          includeTopicsAndCommands,
        }
        currentParent.subTopics.push(newSubTopic)
        currentParent = newSubTopic
      } else {
        currentParent = subTopic
      }
    }
  }

  for (const command of commands) {
    const commandPath = command.id.split(':')
    if (commandPath[0] === 'internal') continue
    let currentParent = topicTree[ROOT_TOPIC_NAME]
    // the last item in the path is the command itself
    for (let i = 0; i < commandPath.length - 1; i++) {
      const name = commandPath.slice(0, i + 1).join(':')
      const subTopic = currentParent.subTopics.find((subTopic) => subTopic.topic.name === name)
      if (!subTopic) throw new Error('Could not find topic for command: ' + command.id)
      currentParent = subTopic
    }
    currentParent.commands.push({command, filePath: `${path.join(...command.id.split(':'))}`})
  }

  return topicTree
}

// Given a topic, render it and all its subtopics and commands. Rendering is setting the `rendered` property
function renderTopic(readmeTopic: ReadmeTopic, config: Config): ReadmeTopic {
  const renderedSubTopics = readmeTopic.subTopics.map((subTopic) => renderTopic(subTopic, config))
  const renderedCommands = readmeTopic.commands.map((readmeCommand) => renderCommand(readmeCommand, config))
  const topicTemplate = readmeTopic.includeTopicsAndCommands ? TOPIC_TEMPLATE_INCLUDE : TOPIC_TEMPLATE
  const rendered = ejs.render(topicTemplate, {
    topic: readmeTopic.topic,
    subTopics: renderedSubTopics,
    commands: renderedCommands,
  })
  return {...readmeTopic, subTopics: renderedSubTopics, commands: renderedCommands, rendered}
}

// Given a command, render it. Rendering is setting the `rendered` property
function renderCommand(readmeCommand: ReadmeCommand, config: Config): ReadmeCommand {
  const columns = Number.parseInt(process.env.COLUMNS!, 10) || 120
  // Use our custom oclif help class
  const help = new CustomHelp(config, {maxWidth: columns, stripAnsi: true})
  const helpOutput = help.exposedFormatCommand(readmeCommand.command)
  // Insert into our template
  const renderedForInclude = ejs.render(COMMAND_TEMPLATE_INCLUDE, {command: readmeCommand.command, helpOutput})
  const renderedForFile = ejs.render(COMMAND_TEMPLATE, {command: readmeCommand.command, helpOutput})
  return {...readmeCommand, renderedForFile, renderedForInclude}
}

type WriteOutput = {
  created: string[]
  overwritten: string[]
}

function writeTopic(
  topic: ReadmeTopic,
  outputDir: string,
  dryRun: boolean,
  overWrite: boolean,
  only: string | undefined,
): WriteOutput {
  if (!topic.rendered) throw new Error(`Topic ${topic.topic.name} has not been rendered`)

  const makeFolderAndSave = (filePath: string, rendered: string) => {
    const exists = fs.existsSync(filePath)
    const outputList = exists ? writeOutput.overwritten : writeOutput.created
    outputList.push(filePath)
    const doWrite = !exists || overWrite
    // console.log({filePath, exists, dryRun, doWrite})
    if (!doWrite || dryRun) return
    const folder = path.dirname(filePath)
    fs.mkdirSync(folder, {recursive: true})
    fs.writeFileSync(filePath, rendered)
  }

  const skipFile = (filePath: string) => only && !filePath.match(only)

  const writeOutput: WriteOutput = {created: [], overwritten: []}
  const filePath = path.join(outputDir, topic.filePath)

  if (!skipFile(filePath)) makeFolderAndSave(filePath, topic.rendered)

  // We don't need to write the subtopics and commands if we are including them in the current file
  // TODO: the default oclif readme outputs them all but merges based on depth
  // if (topic.includeTopicsAndCommands) return writeOutput

  for (const subTopic of topic.subTopics) {
    const subWriteOutput = writeTopic(subTopic, outputDir, dryRun, overWrite, only)
    writeOutput.created.push(...subWriteOutput.created)
    writeOutput.overwritten.push(...subWriteOutput.overwritten)
  }

  for (const command of topic.commands) {
    if (!command.renderedForFile) throw new Error(`Command ${command.command.id} has not been rendered`)
    const filePath = path.join(outputDir, command.filePath)
    if (!skipFile(filePath)) makeFolderAndSave(filePath, command.renderedForFile)
  }

  return writeOutput
}

export default class InternalReadme extends BaseCommand<typeof InternalReadme> {
  static override args = {
    outputDir: Args.string({description: 'The directory where the readme files will be written', required: true}),
  }

  static override description = 'Generate the readme files for the commands'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    // By default do nothing
    notDryRun: Flags.boolean({char: 'n', description: 'Set to actually write the files (will not overwrite)'}),
    overWrite: Flags.boolean({char: 'o', description: 'Overwrite existing files'}),
    depth: Flags.integer({char: 'd', description: 'The depth of the topic tree to render as separate files'}),
    only: Flags.string({char: 'l', description: 'Glob pattern - will only write the files which match'}),
  }

  public async run(): Promise<void> {
    const {outputDir} = this.args

    const {notDryRun, overWrite, depth, only} = this.flags

    const dryRun = !notDryRun

    // Build the topic tree
    const {commands, topics} = this.config
    const topicTree = getTopicTree(topics, commands, depth || 0)

    // Render the topics and commands
    const renderedTopicTree = renderTopic(topicTree[ROOT_TOPIC_NAME], this.config)

    if (dryRun) console.log('Dry-run mode: No files will be written.')
    const writeOutput = writeTopic(renderedTopicTree, outputDir, dryRun, overWrite, only)

    if (writeOutput.created.length > 0)
      console.log(dryRun ? 'Would create the following files:' : 'Created the following files:')
    writeOutput.created.forEach((file) => console.log(`- ${file}`))

    if (writeOutput.overwritten.length > 0)
      console.log(notDryRun && overWrite ? 'Overwritten the following files:' : 'Would overwrite the following files:')
    writeOutput.overwritten.forEach((file) => console.log(`- ${file}`))
  }
}
