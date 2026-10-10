import type {App} from '@expo/apple-utils'
import {UseQueryResult, useQuery} from '@tanstack/react-query'
import {useEffect} from 'react'

import {App as AppleApp} from '@cli/apple/expo.js'
import {ScalarDict} from '@cli/types'

export interface AppleAppQueryProps {
  ctx: any
  iosBundleId?: string
}

export type AppleAppQueryResponse = {
  app: App | null
  summary: ScalarDict | null
}

export const queryAppleApp = async ({ctx, iosBundleId}: AppleAppQueryProps) => {
  if (!iosBundleId) {
    return {app: null, summary: null}
  }

  const app = await AppleApp.findAsync(ctx, {
    bundleId: iosBundleId,
  })

  if (!app) {
    return {app: null, summary: null}
  }

  return {
    app,
    summary: {
      bundleId: app.attributes.bundleId,
      id: app.id,
      name: app.attributes.name,
      primaryLocale: app.attributes.primaryLocale,
    },
  }
}

export const useAppleApp = (props: AppleAppQueryProps): UseQueryResult<AppleAppQueryResponse> => {
  const queryResult = useQuery<AppleAppQueryResponse>({
    queryFn: () => queryAppleApp(props),
    queryKey: ['appleApp', props.iosBundleId],
    // A failed Apple request gives the same answer when sent again
    retry: false,
  })

  // The status commands render and then return, so the exit code is how a script sees the failure
  useEffect(() => {
    if (queryResult.isError) process.exitCode = 1
  }, [queryResult.isError])

  return queryResult
}
