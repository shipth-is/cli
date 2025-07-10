import { useScreenSize } from './useScreenSize.js'

// TODO: this is a bit crude
const WIDE_BREAKPOINT = 100
const TALL_BREAKPOINT = 35

export function useResponsive() {
  const { width, height } = useScreenSize()

  const isWide = width >= WIDE_BREAKPOINT
  const isTall = height >= TALL_BREAKPOINT

  return {
    width,
    height,
    isWide,
    isTall,
  }
}