import {WebSocketListener, useWebSocket} from './useWebSocket.js'

export interface GoRuntimeLogListenerProps {
  projectId: string
  buildId: string
}

export function useGoRuntimeLogListener({projectId, buildId}: GoRuntimeLogListenerProps) {
  const listener: WebSocketListener = {
    async eventHandler(pattern: string, rawLog: any) {
      console.log(`[Go Runtime Log] ${JSON.stringify(rawLog)}`)
    },
    getPattern: () => [`project.${projectId}:build.${buildId}:runtime-log`],
  }

  useWebSocket([listener])
}
