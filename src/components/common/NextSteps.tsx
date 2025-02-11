import React from 'react'
import {ListWithTitle} from './ListWithTitle.js'

export interface NextStepsProps {
  steps: string[]
}

export const NextSteps = ({steps}: NextStepsProps) => {
  return <ListWithTitle listItems={steps} title="Next Steps" />
}
