const USE_LOCAL = process.env.NODE_ENV === 'local'

// TODO: prod
export const DEV_API_URL = 'https://api.develop.shipthis.cc/api/1.0.0'
export const LOCAL_API_URL = 'https://easy-reliably-gull.ngrok-free.app/api/1.0.0'
export const API_URL = USE_LOCAL ? LOCAL_API_URL : DEV_API_URL

export const DEV_WS_URL = 'wss://ws.develop.shipthis.cc'
export const LOCAL_WS_URL = 'wss://easy-reliably-gull.ngrok-free.app'
export const WS_URL = USE_LOCAL ? LOCAL_WS_URL : DEV_WS_URL

export const DEV_WEB_URL = 'https://develop.shipthis.cc/'
export const LOCAL_WEB_URL = 'https://easy-reliably-gull.ngrok-free.app/'
export const WEB_URL = USE_LOCAL ? LOCAL_WEB_URL : DEV_WEB_URL
