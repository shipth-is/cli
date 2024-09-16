import React from 'react'

import {API_URL} from '@cli/constants/index.js'
import {ListWithTitle} from './ListWithTitle.js'

// Shows some debugging when not in production
export const Environment = () => {
  const {NODE_ENV} = process.env
  // TODO: will this be set in prod? Maybe in prod it is empty?
  if (NODE_ENV === 'production') return null
  return <ListWithTitle title="Environment" listItems={[`NODE_ENV is ${NODE_ENV}`, `API_URL is ${API_URL}`]} />
}
