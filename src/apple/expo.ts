// This is just to fix the weird export issue (no export named Auth when running but ok when developing)
import * as expo from '@expo/apple-utils/build/index.js'

// TODO: this is awful
const defaultExport = expo.default
const {App, Auth, BundleId, Certificate, CertificateType, Profile, ProfileType, Session, ApiKey, UserRole, ApiKeyType} =
  defaultExport

export {App, Auth, BundleId, Certificate, CertificateType, Profile, ProfileType, Session, ApiKey, UserRole, ApiKeyType}
