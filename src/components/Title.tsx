import {Text, TextProps} from 'ink'

interface TitleProps extends TextProps {
  children: string
}

export const Title = ({children, ...rest}: TitleProps) => (
  <Text bold {...rest}>
    {children.toUpperCase()}
  </Text>
)
