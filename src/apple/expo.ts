// This is just to fix the weird export issue (no export named Auth when running but ok when developing)
import * as expo from '@expo/apple-utils/build/index.js'

// TODO: this is awful
const defaultExport = expo.default
const {
  ApiKey,
  ApiKeyType,
  App,
  Auth,
  BundleId,
  CapabilityType,
  CapabilityTypeOption,
  Certificate,
  CertificateType,
  Profile,
  ProfileType,
  Session,
  UserRole,
} = defaultExport

export {
  ApiKey,
  ApiKeyType,
  App,
  Auth,
  BundleId,
  CapabilityType,
  CapabilityTypeOption,
  Certificate,
  CertificateType,
  Profile,
  ProfileType,
  Session,
  UserRole,
}
