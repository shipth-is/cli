import axios from 'axios'
import {useMutation} from '@tanstack/react-query'

import {getAuthedHeaders} from '@cli/api/index.js'
import {cacheKeys, API_URL} from '@cli/constants/index.js'

import {queryClient} from './queryClient.js'

interface MutateProps {
  projectId: string
  developerId: string
}

interface MutateResponse {
  projectId: string
}

export const useInviteServiceAccount = () => {
  return useMutation({
    mutationFn: async ({projectId, developerId}: MutateProps) => {
      try {
        const headers = getAuthedHeaders()
        const {data} = await axios.post(
          `${API_URL}/projects/${projectId}/credentials/android/key/invite/`,
          {developerId},
          {
            headers,
          },
        )
        return data
      } catch (error) {
        console.error('useInviteMutation Error', error)
        throw error
      }
    },
    onSuccess: async (data: MutateResponse) => {
      queryClient.invalidateQueries({
        queryKey: cacheKeys.androidKeyTestResult({projectId: data.projectId}),
      })
    },
  })
}
