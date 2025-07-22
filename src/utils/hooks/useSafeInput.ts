import {Key, useInput, useStdin} from 'ink'

// These are copied from ink/build/hooks/use-input.d.ts
type Options = {isActive?: boolean}
type Handler = (input: string, key: Key) => void

// When we use useInput, it will only work if we are in raw mode (interactive terminal)
// We also usually need to handle the input in lower case
export const useSafeInput = (handler: Handler, options: Options = {isActive: true}) => {
  const {isRawModeSupported} = useStdin()
  const isActive = (isRawModeSupported === true) && options.isActive !== false
  useInput(
    (input, key) => {
      const lowerInput = input.toLowerCase()
      return handler(lowerInput, key)
    },
    {isActive},
  )
}
