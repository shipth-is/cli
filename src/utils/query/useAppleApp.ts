import {useQuery, UseQueryResult} from '@tanstack/react-query'

import type {App} from '@expo/apple-utils'

import {App as AppleApp} from '@cli/apple/expo.js'
import {ScalarDict} from '@cli/types.js'

export interface AppleAppQueryProps {
  ctx: any
  iosBundleId?: string
}

export type AppleAppQueryResponse = {
  app: App | null
  summary: ScalarDict | null
}

const queryFn = async ({ctx, iosBundleId}: AppleAppQueryProps) => {
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
      id: app.id,
      name: app.attributes.name,
      bundleId: app.attributes.bundleId,
      primaryLocale: app.attributes.primaryLocale,
    },
  }
}

export const useAppleApp = (props: AppleAppQueryProps): UseQueryResult<AppleAppQueryResponse> => {
  const queryResult = useQuery<AppleAppQueryResponse>({
    queryKey: ['appleApp', props.iosBundleId],
    queryFn: () => queryFn(props),
  })

  return queryResult
}
