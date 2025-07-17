// This is from https://gist.github.com/Carnageous/1a55a8747f12e1c4fc86ebe2d05a0a55
// Following from this discussion https://github.com/vadimdemedes/ink/issues/432

import {Box, DOMElement, measureElement, useFocus, useInput} from 'ink'
import {useEffect, useReducer, useRef} from 'react'

interface ScrollAreaState {
  height: number
  innerHeight: number
  scrollTop: number
}

type ScrollAreaAction =
  | {height: number; type: 'SET_HEIGHT'}
  | {innerHeight: number; type: 'SET_INNER_HEIGHT'}
  | {type: 'SCROLL_DOWN'}
  | {type: 'SCROLL_UP'}

const reducer = (state: ScrollAreaState, action: ScrollAreaAction) => {
  switch (action.type) {
    case 'SET_INNER_HEIGHT': {
      return {
        ...state,
        innerHeight: action.innerHeight,
      }
    }

    case 'SET_HEIGHT': {
      return {
        ...state,
        height: action.height,
      }
    }

    case 'SCROLL_DOWN': {
      return {
        ...state,
        scrollTop: Math.min(
          state.innerHeight <= state.height ? 0 : state.innerHeight - state.height,
          state.scrollTop + 1,
        ),
      }
    }

    case 'SCROLL_UP': {
      return {
        ...state,
        scrollTop: Math.max(0, state.scrollTop - 1),
      }
    }

    default: {
      return state
    }
  }
}

export interface ScrollAreaProps extends React.PropsWithChildren {
  height: number
}

export function ScrollArea({children, height}: ScrollAreaProps) {
  useFocus()
  const [state, dispatch] = useReducer(reducer, {
    height,
    innerHeight: 0,
    scrollTop: 0,
  })

  const innerRef = useRef<DOMElement>(null)

  useEffect(() => {
    dispatch({height, type: 'SET_HEIGHT'})
  }, [height])

  useEffect(() => {
    if (!innerRef.current) return

    const dimensions = measureElement(innerRef.current)

    dispatch({
      innerHeight: dimensions.height,
      type: 'SET_INNER_HEIGHT',
    })
  }, [])

  useInput((_input, key) => {
    if (key.downArrow) {
      dispatch({
        type: 'SCROLL_DOWN',
      })
    }

    if (key.upArrow) {
      dispatch({
        type: 'SCROLL_UP',
      })
    }
  })

  return (
    <Box flexDirection="column" flexGrow={1} height={height} overflow="hidden">
      <Box flexDirection="column" flexShrink={0} marginTop={-state.scrollTop} ref={innerRef}>
        {children}
      </Box>
    </Box>
  )
}
