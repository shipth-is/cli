interface baseCredentialContent {
  serialNumber: string
}

export interface UserCertificate_iOS extends baseCredentialContent {
  certificateBase64: string
  certificatePassword: string
}

export interface ProjectCertificate_iOS extends baseCredentialContent {
  certificateBase64: string
  certificatePassword: string
  mobileProvisionBase64: string
}

// TODO: use this
export interface ProjectCertificate_Android extends baseCredentialContent {
  keyAlias: string
  keyPassword: string
  keyStoreBase64: string
  keyStorePassword: string
}

export interface UserKey_iOS extends baseCredentialContent {
  issuer: string
  keyId: string
  p8Content: string
}
