
export const DEFAULT_SHIPPED_FILES_GLOBS = ['**/*']
export const DEFAULT_IGNORED_FILES_GLOBS = ['.git', '.gitignore', 'shipthis.json', 'shipthis-*.zip']

interface Backend {
  apiUrl: string
  wsUrl: string
  webUrl: string
}

export const BACKENDS: Record<string, Backend> = {
  dev: {
    apiUrl: 'https://api.develop.shipthis.cc/api/1.0.0',
    wsUrl: 'wss://ws.develop.shipthis.cc',
    webUrl: 'https://develop.shipthis.cc/',
  },
  local: {
    apiUrl: 'https://easy-reliably-gull.ngrok-free.app/api/1.0.0',
    wsUrl: 'wss://easy-reliably-gull.ngrok-free.app',
    webUrl: 'https://easy-reliably-gull.ngrok-free.app/',
  },
}

export const BACKEND_ENV_VAR_NAME = 'SHIPTHIS_BACKEND'
export const BACKEND_NAME = process.env[BACKEND_ENV_VAR_NAME] || 'dev'

export const API_URL = BACKENDS[BACKEND_NAME].apiUrl
export const WS_URL = BACKENDS[BACKEND_NAME].wsUrl
export const WEB_URL = BACKENDS[BACKEND_NAME].webUrl


