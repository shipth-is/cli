import {Platform} from '@cli/types.js'

export enum CredentialsType {
  CERTIFICATE = 'CERTIFICATE',
  KEY = 'KEY',
}
export interface UserCredential {
  id: string
  platform: Platform
  type: CredentialsType
  bucketName: string
  key: string
  createdAt: string
  updatedAt: string
  url: string
  serialNumber: string
}

export interface ProjectCredential extends UserCredential {
  identifier: string
}

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
  keyStoreBase64: string
  keyStorePassword: string
  keyPassword: string
  keyAlias: string
}

export interface UserKey_iOS extends baseCredentialContent {
  issuer: string
  keyId: string
  p8Content: string
}
