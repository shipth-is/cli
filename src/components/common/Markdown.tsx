import {setOptions, parse} from 'marked'
import {Text} from 'ink'
import fs from 'fs'
import TerminalRenderer, {TerminalRendererOptions} from 'marked-terminal'

interface Props extends TerminalRendererOptions {
  path: string
  templateVars?: Record<string, string>
}

export const Markdown = ({path, templateVars, ...options}: Props): JSX.Element => {
  setOptions({renderer: new TerminalRenderer(options)})
  const template = fs.readFileSync(path, 'utf8').trim()
  // Quick and dirty template - use ${name} in the markdown file
  const markdown = !templateVars ? template : template.replace(/\${(.*?)}/g, (_, key) => templateVars[key.trim()] || '')
  return <Text>{parse(markdown).trim()}</Text>
}
