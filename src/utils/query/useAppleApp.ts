import type {App} from '@expo/apple-utils'
import {UseQueryResult, useQuery} from '@tanstack/react-query'

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
  })

  return queryResult
}
