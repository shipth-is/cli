import {getAuthedHeaders, getGoogleStatus} from '@cli/api/index.js'
import {API_URL, cacheKeys} from '@cli/constants/index.js'
import {AndroidServiceAccountSetupStatus, CredentialsType, Platform} from '@cli/types'
import {useAndroidServiceAccountSetupStatus, useProjectCredentials} from '@cli/utils/query/index.js'
import {useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import React, {useEffect, useRef, useState} from 'react'

import {WebSocketListener, useWebSocket} from './useWebSocket.js'

interface Props {
  onComplete: () => void
  onError: (error: Error) => void
  projectId: string
}

interface Output {
  handleStart: () => Promise<boolean>
  hasServiceAccountKey: boolean
  isCreating: boolean
  setupStatus: AndroidServiceAccountSetupStatus | undefined
}

const ERR_NOT_AUTHENTICATED = 'You must be connected to Google to create a Service Account Key'

const useHasServiceAccountKey = (projectId: string) => {
  const {data, isSuccess} = useProjectCredentials({platform: Platform.ANDROID, projectId})
  return (
    isSuccess &&
    data.data.some((cred) => cred.isActive && cred.platform === Platform.ANDROID && cred.type == CredentialsType.KEY)
  )
}

const useAndroidServiceAccount = ({onComplete, onError, projectId}: Props): Output => {
  const queryClient = useQueryClient()

  const [isStarting, setIsStarting] = useState<boolean>(false)
  const hasServiceAccountKey = useHasServiceAccountKey(projectId)

  const listener: WebSocketListener = {
    async eventHandler(pattern: string, data: any) {
      const key = cacheKeys.androidSetupStatus({projectId})
      queryClient.setQueryData(key, () => data)
    },
    getPattern: () => `project.${projectId}:android-setup-status`,
  }

  useWebSocket([listener])

  const {data: setupStatus} = useAndroidServiceAccountSetupStatus({projectId})

  const prevSetupStatusRef = useRef<string>('unknown')

  useEffect(() => {
    if (['queued', 'running'].includes(prevSetupStatusRef.current)) {
      if (setupStatus?.status === 'complete') onComplete()
      if (setupStatus?.status === 'error') onError(new Error(setupStatus.errorMessage))
    }

    prevSetupStatusRef.current = setupStatus?.status || 'unknown'
  }, [setupStatus])

  const handleStart = async () => {
    try {
      setIsStarting(true)

      const currentStatus = await getGoogleStatus()
      if (!currentStatus.isAuthenticated) throw new Error(ERR_NOT_AUTHENTICATED)

      const headers = getAuthedHeaders()
      const androidKeyApiBase = `${API_URL}/projects/${projectId}/credentials/android/key`

      // Start the android api-key setup process
      const startUrl = `${androidKeyApiBase}/setup/`
      const {data: updatedStatus} = await axios.post(startUrl, {}, {headers})

      queryClient.invalidateQueries({
        queryKey: cacheKeys.projectCredentials({pageNumber: 0, projectId}),
      })

      await queryClient.setQueryData(cacheKeys.androidSetupStatus({projectId}), (_) => updatedStatus)

      setIsStarting(false)
      return true
    } catch (error: any) {
      setIsStarting(false)
      console.warn('useAndroidServiceAccount.handleStart Error', error)
      onError(error)
      return false
    }
  }

  const isCreating = isStarting || setupStatus?.status === 'queued' || setupStatus?.status === 'running'

  return {
    handleStart,
    hasServiceAccountKey,
    isCreating,
    setupStatus,
  }
}

export {useAndroidServiceAccount, useHasServiceAccountKey}
