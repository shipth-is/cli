export const DEFAULT_SHIPPED_FILES_GLOBS = ['**/*']
export const DEFAULT_IGNORED_FILES_GLOBS = ['.git', '.gitignore', 'shipthis.json', 'shipthis-*.zip']

const PRIMARY_DOMAIN = 'shipthis.cc'

interface BackendUrls {
  api: string
  ws: string
  web: string
}

function getUrlsForDomain(domain: string): BackendUrls {
  const isPublic = domain.includes(PRIMARY_DOMAIN)
  const apiDomain = (isPublic ? `api.` : '') + domain // develop.shipthis.cc -> api.develop.shipthis.cc
  const wsDomain = (isPublic ? `ws.` : '') + domain // develop.shipthis.cc -> ws.develop.shipthis.cc
  return {
    api: `https://${apiDomain}/api/1.0.0`,
    ws: `wss://${wsDomain}`,
    web: `https://${domain}/`,
  }
}

export const DOMAIN_ENV_VAR_NAME = 'SHIPTHIS_DOMAIN'
export const DOMAIN = process.env[DOMAIN_ENV_VAR_NAME] || PRIMARY_DOMAIN
export const BACKEND_URLS = getUrlsForDomain(DOMAIN)

export const API_URL = BACKEND_URLS.api
export const WS_URL = BACKEND_URLS.ws
export const WEB_URL = BACKEND_URLS.web
