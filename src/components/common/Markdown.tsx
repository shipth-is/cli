import {setOptions, parse} from 'marked'
import {Text} from 'ink'
import fs from 'fs'
import TerminalRenderer, {TerminalRendererOptions} from 'marked-terminal'
import path from 'path'
import {useEffect, useState} from 'react'

interface Props extends TerminalRendererOptions {
  filename: string
  templateVars?: Record<string, string|boolean>
}

const cleanHyperlinks = (input: string): string => {
  // When we run in a <ScrollArea> the links break
  // Remove OSC 8 hyperlink wrappers but preserve the styled content inside
  return input
    .replace(/\x1b]8;;[^\x07]*\x07/g, '') // remove OSC 8 start
    .replace(/\x1b]8;;\x07/g, '') // remove OSC 8 end
}

export const getRenderedMarkdown = ({filename, templateVars, ...options}: Props): string => {
  setOptions({
    renderer: new TerminalRenderer({
      ...options,
    }),
  })

  // Handling when the entrypoint is a symlink
  const entrypointPath = fs.realpathSync(process.argv[1])
  const root = path.dirname(entrypointPath)

  const mdPath = path.join(root, '..', 'assets', 'markdown', filename)
  const mdTemplate = fs.readFileSync(mdPath, 'utf8').trim()

  let markdown = mdTemplate

  // This is crude and it needed ChatGPT for the regexes
  // TODO: consider a different templating system
  if (templateVars) {
    // Conditional blocks: ${if key} ... ${endif}
    markdown = markdown.replace(/\${if (.*?)\}([\s\S]*?)\${endif}/g, (_, key, content) => {
      return templateVars[key.trim()] ? content : ''
    })

    // Variable replacement: ${key}
    markdown = markdown.replace(/\${(.*?)}/g, (_, key) => {
      const trimmed = key.trim()
      return templateVars[trimmed] ? String(templateVars[trimmed]) : ''
    })
  }

  const rendered = parse(markdown).trim()
  const cleaned = cleanHyperlinks(rendered)
  return cleaned
}

export const Markdown = ({filename, templateVars, ...options}: Props): JSX.Element => {
  const [text, setText] = useState('')

  useEffect(() => {
    const cleaned = getRenderedMarkdown({filename, templateVars, ...options})
    setText(cleaned)
  }, [filename, templateVars, options])

  return <Text>{text}</Text>
}
