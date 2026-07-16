/**
 * Interop shim for @expo/apple-utils.
 *
 * That package ships a single CommonJS bundle (built with @vercel/ncc), while
 * ShipThis is ESM ("type": "module"). Node cannot statically detect the named
 * exports of a bundle like that, so `import {Auth} from '@expo/apple-utils'`
 * type-checks but throws at runtime:
 *
 *   SyntaxError: Named export 'Auth' not found. The requested module
 *   '@expo/apple-utils' is a CommonJS module, which may not support all
 *   module.exports as named exports.
 *
 * The fix is the one Node itself suggests: import the CommonJS module as a
 * default import and destructure it. We do that once, here, so the rest of the
 * codebase can use ordinary named imports.
 */
import appleUtils from '@expo/apple-utils'

export const {
  ApiKey,
  ApiKeyType,
  App,
  Auth,
  BetaGroup,
  BundleId,
  CapabilityType,
  CapabilityTypeOption,
  Certificate,
  CertificateType,
  Profile,
  ProfileType,
  Session,
  UserRole,
} = appleUtils
