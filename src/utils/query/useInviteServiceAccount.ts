import {useMutation} from '@tanstack/react-query'
import axios from 'axios'

import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL, cacheKeys} from '@cli/constants/index.js'

import {queryClient} from './queryClient.js'

interface MutateProps {
  developerId: string
  projectId: string
}

interface MutateResponse {
  projectId: string
}

export const useInviteServiceAccount = () => useMutation({
    async mutationFn({developerId, projectId}: MutateProps) {
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
    async onSuccess(data: MutateResponse) {
      // TODO: found a race condition perhaps
      const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
      await sleep(1000)
      queryClient.invalidateQueries({
        queryKey: cacheKeys.androidKeyTestResult({projectId: data.projectId}),
      })
    },
  })
