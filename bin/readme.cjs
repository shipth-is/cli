// Struggled to import and use the oclif classes in ES modules
// Quick and dirty convert of https://github.com/oclif/oclif/blob/main/src/commands/readme.ts
const ReadmeGenerator = require('oclif/lib/readme-generator').default

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

function compact(a) {
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  return a.filter((a) => Boolean(a))
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
