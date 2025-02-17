import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import {useQueryClient} from '@tanstack/react-query'

import {AndroidServiceAccountSetupStatus, CredentialsType, Platform} from '@cli/types'
import {API_URL, cacheKeys} from '@cli/constants/index.js'

import {useAndroidServiceAccountSetupStatus, useProjectCredentials} from '@cli/utils/query/index.js'
import {getAuthedHeaders, getGoogleStatus} from '@cli/api/index.js'

import {useWebSocket, WebSocketListener} from './useWebSocket.js'

interface Props {
  projectId: string
  onError: (error: Error) => void
  onComplete: () => void
}

interface Output {
  handleStart: () => Promise<boolean>
  setupStatus: AndroidServiceAccountSetupStatus | undefined
  isCreating: boolean
  hasServiceAccountKey: boolean
}

const ERR_NOT_AUTHENTICATED = 'You must be connected to Google to create a Service Account Key'

const useHasServiceAccountKey = (projectId: string) => {
  const {data, isSuccess} = useProjectCredentials({projectId, platform: Platform.ANDROID})
  return (
    isSuccess &&
    data.data.some((cred) => cred.isActive && cred.platform === Platform.ANDROID && cred.type == CredentialsType.KEY)
  )
}

const useAndroidServiceAccount = ({projectId, onError, onComplete}: Props): Output => {
  const queryClient = useQueryClient()

  const [isStarting, setIsStarting] = useState<boolean>(false)
  const hasServiceAccountKey = useHasServiceAccountKey(projectId)

  const listener: WebSocketListener = {
    getPattern: () => `project.${projectId}:android-setup-status`,
    eventHandler: async (pattern: string, data: any) => {
      const key = cacheKeys.androidSetupStatus({projectId})
      queryClient.setQueryData(key, () => data)
    },
  }

  useWebSocket([listener])

  const {data: setupStatus} = useAndroidServiceAccountSetupStatus({projectId})

  const prevSetupStatusRef = useRef<string>('unknown')

  useEffect(() => {
    if (['running', 'queued'].includes(prevSetupStatusRef.current)) {
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
        queryKey: cacheKeys.projectCredentials({projectId, pageNumber: 0}),
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
    setupStatus,
    isCreating,
    hasServiceAccountKey,
  }
}

export {useAndroidServiceAccount, useHasServiceAccountKey}
