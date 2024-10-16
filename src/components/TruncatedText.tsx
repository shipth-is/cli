import {measureElement, Box, Text, TextProps} from 'ink'
import {useRef} from 'react'
import stringLength from 'string-length'
import stripAnsi from 'strip-ansi'

interface Props extends TextProps {
  children: string
}

// Was having some issues with <Text wrap="truncate" />
export const TruncatedText = ({children, wrap, ...textPropsWithoutWrap}: Props) => {
  const ref = useRef()

  // TODO: still not perfect as things get cut off earlier in the JobLogTail component?
  const getTruncated = (input: string) => {
    const withoutCrlf = input.replaceAll(/[\r\n]/g, '')
    if (!ref.current) return withoutCrlf
    const {width} = measureElement(ref.current)
    const withoutAnsi = stripAnsi(withoutCrlf)
    const textLength = stringLength(withoutAnsi)
    return textLength > width ? withoutCrlf.substring(0, width) : withoutCrlf
  }

  return (
    <Box ref={ref as any}>
      <Text {...textPropsWithoutWrap}>{getTruncated(children)}</Text>
    </Box>
  )
}
