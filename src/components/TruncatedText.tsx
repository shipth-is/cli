import {measureElement, Box, Text, TextProps, Spacer} from 'ink'
import {useRef} from 'react'
import stringLength from 'string-length'
import stripAnsi from 'strip-ansi'

interface Props extends TextProps {
  children: string
}

// Was having some issues with <Text wrap="truncate" />
export const TruncatedText = ({children, wrap, ...textProps}: Props) => {
  const ref = useRef()

  // TODO: still not perfect as things get cut off earlier in the JobLogTail component?
  const getTruncated = (input: string) => {
    if (!ref.current) return input
    const {width} = measureElement(ref.current)
    const withoutAnsi = stripAnsi(input)
    const textLength = stringLength(withoutAnsi)
    return textLength > width ? input.substring(0, width) : input
  }

  return (
    <Box ref={ref as any}>
      <Text {...textProps}>{getTruncated(children)}</Text>
    </Box>
  )
}
