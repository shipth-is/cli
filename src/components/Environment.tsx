import React from 'react'

import {DOMAIN, API_URL, WS_URL, WEB_URL} from '@cli/constants/index.js'
import {StatusTable} from './StatusTable.js'

// Shows some debugging when not in production
export const Environment = () => {
  // TODO: will this be set in prod? Maybe in prod it is empty?
  if (process.env.NODE_ENV === 'production') return null

  return (
    <StatusTable
      marginTop={1}
      title="Environment"
      statuses={{
        DOMAIN: DOMAIN,
        API_URL: API_URL,
        WS_URL: WS_URL,
        WEB_URL: WEB_URL,
      }}
    />
  )
}
