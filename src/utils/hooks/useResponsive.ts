import { useScreenSize } from 'fullscreen-ink'

// TODO: this is a bit crude
const WIDE_BREAKPOINT = 100
const TALL_BREAKPOINT = 35

export function useResponsive() {
  const { height, width } = useScreenSize()

  const isWide = width >= WIDE_BREAKPOINT
  const isTall = height >= TALL_BREAKPOINT

  return {
    height,
    isTall,
    isWide,
    width,
  }
}