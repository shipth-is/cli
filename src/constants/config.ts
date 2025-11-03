export const AUTH_ENV_VAR_NAME = 'SHIPTHIS_TOKEN'
export const DOMAIN_ENV_VAR_NAME = 'SHIPTHIS_DOMAIN'

export const DEFAULT_SHIPPED_FILES_GLOBS = ['**/*']

// Generated from the Godot gitignore https://github.com/github/gitignore/blob/main/Godot.gitignore
// And included the shipthis.json and shipthis-*.zip
export const DEFAULT_IGNORED_FILES_GLOBS = [
  '.git',
  '.gitignore',
  'shipthis.json',
  'shipthis-*.zip',
  '.godot/**',
  '.nomedia',
  '.import/**',
  'export.cfg',
  'export_credentials.cfg',
  '*.translation',
  '.mono/**',
  'data_*/**',
  'mono_crash.*.json',
  '*.apk',
  '*.aab',
]

const PRIMARY_DOMAIN = 'shipth.is'
interface BackendUrls {
  api: string
  web: string
  ws: string
}

function getUrlsForDomain(domain: string): BackendUrls {
  const isPublic = domain.includes(PRIMARY_DOMAIN)
  const apiDomain = (isPublic ? `api.` : '') + domain // develop.shipth.is -> api.develop.shipth.is
  const wsDomain = (isPublic ? `ws.` : '') + domain // develop.shipth.is -> ws.develop.shipth.is
  return {
    api: `https://${apiDomain}/api/1.0.0`,
    web: `https://${domain}/`,
    ws: `wss://${wsDomain}`,
  }
}

export const DOMAIN = process.env[DOMAIN_ENV_VAR_NAME] || PRIMARY_DOMAIN
export const BACKEND_URLS = getUrlsForDomain(DOMAIN)

export const API_URL = BACKEND_URLS.api
export const WS_URL = BACKEND_URLS.ws
export const WEB_URL = BACKEND_URLS.web
