import {setOptions, parse} from 'marked'
import {Text} from 'ink'
import fs from 'fs'
import TerminalRenderer, {TerminalRendererOptions} from 'marked-terminal'
import path from 'path'

interface Props extends TerminalRendererOptions {
  filename: string
  templateVars?: Record<string, string>
}

const root = path.dirname(process.argv[1])

export const Markdown = ({filename, templateVars, ...options}: Props): JSX.Element => {
  setOptions({renderer: new TerminalRenderer(options)})
  const mdPath = path.join(root, '..', 'assets', 'markdown', filename)
  const mdTemplate = fs.readFileSync(mdPath, 'utf8').trim()
  // Quick and dirty template - use ${name} in the markdown file
  const markdown = !templateVars
    ? mdTemplate
    : mdTemplate.replace(/\${(.*?)}/g, (_, key) => templateVars[key.trim()] || '')
  return <Text>{parse(markdown).trim()}</Text>
}
