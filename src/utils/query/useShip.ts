import {useMutation} from '@tanstack/react-query'

import {cacheKeys} from '@cli/constants/index.js'
import {Job} from '@cli/types'
import {queryClient} from '@cli/utils/index.js'
import {ship} from '@cli/utils/ship/index.js'

export const useShip = () =>
  useMutation({
    mutationFn: ship,
    async onSuccess(data: Job[]) {
      if (!data.length) return
      const projectId = data[0].project.id
      const queryKey = cacheKeys.jobs({pageNumber: 0, projectId})
      // Invalidate the jobs query
      queryClient.invalidateQueries({queryKey})
    },
  })
