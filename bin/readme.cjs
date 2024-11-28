// Struggled to import and use the oclif classes in ES modules
// Quick and dirty convert of https://github.com/oclif/oclif/blob/main/src/commands/readme.ts

const loadHelpClass = require('@oclif/core').loadHelpClass

const ReadmeGenerator = require('oclif/lib/readme-generator').default
const HelpCompatibilityWrapper = require('oclif/lib/help-compatibility').HelpCompatibilityWrapper

const path = require('path')
const fs = require('fs-extra')
//import {render} from 'ejs'

const render = require('ejs').render

const Config = require('@oclif/core').Config

const FLAGS = {
  'dry-run': false,
  multi: true,
  'nested-topics-depth': 3,
  'output-dir': 'docs',
  'plugin-directory': process.cwd(),
  'readme-path': 'README.md',
  'repository-prefix': undefined,
  version: undefined,
}

const columns = Number.parseInt(process.env.COLUMNS || '120', 10)

function compact(a) {
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  return a.filter((a) => Boolean(a))
}

async function slugify(str) {
  const {default: GithubSlugger} = await import('github-slugger')
  const slugger = new GithubSlugger()
  return slugger.slug(str)
}

class CustomGenerator extends ReadmeGenerator {
  constructor(config, options) {
    super(config, options)
  }

  async generate() {
    return super.generate()
  }

  commandCode(c) {
    // Remove the "See code: [link]" sections from the readme
    return undefined
  }

  async __disabled__multiCommands(commands, dir, nestedTopicsDepth) {
    console.log('-0-0-0-0-0-0-0-0-0-0-0-0-00--0')
    console.log('DIR', dir)
    //return super.multiCommands(commands, dir, nestedTopicsDepth)
    let topics = this.config.topics
    topics = nestedTopicsDepth
      ? topics.filter((t) => !t.hidden && (t.name.match(/:/g) || []).length < nestedTopicsDepth)
      : topics.filter((t) => !t.hidden && !t.name.includes(':'))

    topics = topics.filter((t) => commands.find((c) => c.id.startsWith(t.name)))
    // topics = uniqBy(
    //   sortBy(topics, (t) => t.name),
    //   (t) => t.name,
    // )
    for (const topic of topics) {
      // eslint-disable-next-line no-await-in-loop
      await this.createTopicFile(
        path.join('.', dir, topic.name.replaceAll(':', '/') + '.md'),
        topic,
        commands.filter((c) => c.id === topic.name || c.id.startsWith(topic.name + ':')),
      )
    }

    topics.map((t) => console.log('FUCK', `(${dir}/${t.name.replaceAll(':', '/')}.md)`))

    return (
      [
        '# Command Topics\n',
        ...topics.map((t) =>
          compact([
            `* [\`${this.config.bin} ${t.name.replaceAll(
              ':',
              this.config.topicSeparator,
            )}\`](${dir}/${t.name.replaceAll(':', '/')}.md)`,
            render(t.description || '', {config: this.config})
              .trim()
              .split('\n')[0],
          ]).join(' - '),
        ),
      ]
        .join('\n')
        .trim() + '\n'
    )
  }

  async createTopicFile(file, topic, commands) {
    //console.log('in the custom createTopicFile')
    const oldBin = `\`${this.config.bin} ${topic.name}\``
    const bin = `\`${this.config.bin} ${topic.name.replaceAll(':', ' ')}\``

    const oldDoc =
      [
        bin,
        '='.repeat(bin.length),
        '',
        render(topic.description || '', {config: this.config}).trim(),
        '',
        await this.commands(commands),
      ]
        .join('\n')
        .trim() + '\n'

    const doc =
      [
        render(topic.description || '', {config: this.config}).trim(),
        '',
        '### Usage',
        '',
        bin,
        '',
        '### Help output',
        '',
        await this.commands(commands),
      ]
        .join('\n')
        .trim() + '\n'

    await this.write(path.resolve(this.options.pluginDir ?? process.cwd(), file), doc)
  }

  renderCommand(c, HelpClass) {
    //console.log('in our custom renderCommand')
    const title = render(c.summary ?? c.description ?? '', {command: c, config: this.config})
      .trim()
      .split('\n')[0]
    const help = new HelpClass(this.config, {maxWidth: columns, respectNoCacheDefault: true, stripAnsi: true})
    const wrapper = new HelpCompatibilityWrapper(help)

    const header = () => {
      const usage = this.commandUsage(c)
      return usage ? `## \`${this.config.bin} ${usage}\`` : `## \`${this.config.bin}\``
    }

    try {
      // copy c to keep the command ID with colons, see:
      // https://github.com/oclif/oclif/pull/1165#discussion_r1282305242
      const command = {...c}

      const res = compact([
        //header(),
        //title,
        '```\n' + wrapper.formatCommand(c).trim() + '\n```',
        //this.commandCode(command),
      ]).join('\n\n')

      //console.log(JSON.stringify(res, null, 2))

      return res
    } catch (error) {
      console.error(error)
    }
  }

  async commands(commands) {
    //console.trace()
    //console.log('in our custom commands')
    const helpClass = await loadHelpClass(this.config)
    const res = [
      // ...(await Promise.all(
      //   commands.map(async (c) => {
      //     const usage = this.commandUsage(c)
      //     console.log(
      //       'USAGE',
      //       usage,
      //       `* [\`${this.config.bin} ${usage}\`](#${await slugify(`${this.config.bin}-${usage}`)})`,
      //     )
      //     return usage
      //       ? `* [\`${this.config.bin} ${usage}\`](#${await slugify(`${this.config.bin}-${usage}`)})`
      //       : `* [\`${this.config.bin}\`](#${await slugify(`${this.config.bin}`)})`
      //   }),
      // )),
      '',
      ...commands.map((c) => this.renderCommand({...c}, helpClass)).map((s) => s.trim() + '\n'),
    ]
      .join('\n')
      .trim()

    //console.log(JSON.stringify(res, null, 2))
    return res
  }
}

async function run() {
  FLAGS['plugin-directory'] ??= process.cwd()
  const readmePath = path.resolve(FLAGS['plugin-directory'], FLAGS['readme-path'])
  const tsConfigPath = path.resolve(FLAGS['plugin-directory'], 'tsconfig.json')
  if (await fs.pathExists(tsConfigPath)) {
    const {default: JSONC} = await import('tiny-jsonc')
    const tsConfigRaw = await fs.readFile(tsConfigPath, 'utf8')
    const tsConfig = JSONC.parse(tsConfigRaw)
    const outDir = tsConfig.compilerOptions?.outDir ?? 'lib'

    if (!(await fs.pathExists(outDir))) {
      this.warn(`No compiled source found at ${outDir}. Some commands may be missing.`)
    }
  }

  const config = await Config.load({
    devPlugins: false,
    root: FLAGS['plugin-directory'],
    userPlugins: false,
  })

  try {
    const p = require.resolve('@oclif/plugin-legacy', {paths: [FLAGS['plugin-directory']]})
    const plugin = new Plugin({root: p, type: 'core'})
    await plugin.load()
    config.plugins.set(plugin.name, plugin)
  } catch {}

  await config.runHook('init', {argv: this.argv, id: 'readme'})

  const generator = new CustomGenerator(config, {
    aliases: FLAGS.aliases,
    dryRun: FLAGS['dry-run'],
    multi: FLAGS.multi,
    nestedTopicsDepth: FLAGS['nested-topics-depth'],
    outputDir: FLAGS['output-dir'],
    pluginDir: FLAGS['plugin-directory'],
    readmePath,
    repositoryPrefix: FLAGS['repository-prefix'],
    version: FLAGS.version,
  })

  const readme = await generator.generate()
  if (FLAGS['dry-run']) {
    this.log(readme)
  }

  //return readme
}

run().then(console.log).catch(console.error)
