
import {useMutation} from '@tanstack/react-query'

import {enforcePolicy, revokePolicy} from '@cli/api/index.js'
import {cacheKeys} from '@cli/constants/cacheKeys.js'
import {GoogleStatusResponse} from '@cli/types/api.js'

import {queryClient} from './queryClient.js'

interface Props {
  action: 'enforce' | 'revoke'
}

export const useUpdateGoogleOrgPolicy = () =>
  useMutation({
    async mutationFn(props: Props) {
      if (props.action === 'revoke') {
        return await revokePolicy()
      }
 
        return await enforcePolicy()
      
    },
    async onSuccess(data: GoogleStatusResponse) {
      queryClient.invalidateQueries({
        queryKey: cacheKeys.googleStatus(),
      })
    },
  })
