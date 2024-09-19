import axios from 'axios'
import {ApiKey, Certificate} from '@expo/apple-utils'

import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL} from '@cli/constants/index.js'

import {ProjectCredential, UserCertificate_iOS, UserCredential} from './types.js'

export * from './types.js'
export * from './upload.js'
export * from './import.js'

export async function getUserCredentials(pageSize = 100): Promise<UserCredential[]> {
  const headers = getAuthedHeaders()
  const {data} = await axios({
    method: 'get',
    url: `${API_URL}/credentials?pageSize=${pageSize}`,
    headers,
  })
  return data.data as UserCredential[]
}

export async function getProjectCredentials(projectId: string, pageSize = 100): Promise<ProjectCredential[]> {
  const headers = getAuthedHeaders()
  const {data} = await axios({
    method: 'get',
    url: `${API_URL}/projects/${projectId}/credentials?pageSize=${pageSize}`,
    headers,
  })
  return data.data as ProjectCredential[]
}

// Find a valid cert that we have the private key for
// TODO: rename as is apple specific?
export async function getUseableCert(certs: Certificate[]): Promise<Certificate | undefined> {
  const validCertSerialNumbers = certs
    .filter((cert) => cert.attributes.status == 'Issued')
    .map((cert) => cert.attributes.serialNumber)
  const userCredentials = await getUserCredentials()
  const userCred = userCredentials.find((cred) => {
    return validCertSerialNumbers.includes(cred.serialNumber)
  })
  if (!userCred) return undefined
  return certs.find((cert) => cert.attributes.serialNumber == userCred.serialNumber)
}

// Looks for a registered API key that we have saved
// TODO: rename as is apple specific?
export async function getUsableKey(keys: ApiKey[]): Promise<ApiKey | undefined> {
  // For the keys we use the "ids" as the serial number
  const validKeyIds = keys.filter((key) => key.attributes.isActive).map((key) => key.id)
  const userCredentials = await getUserCredentials()
  const userCred = userCredentials.find((cred) => {
    return validKeyIds.includes(cred.serialNumber)
  })
  if (!userCred) return undefined
  return keys.find((key) => key.id == userCred.serialNumber)
}

// Tells us if we need to create a project cert given the valid user cert
// TODO: rename as is apple specific?
export async function hasProjectCredentials(projectId: string, userCert: Certificate): Promise<Boolean> {
  const serialNumber = userCert.attributes.serialNumber
  const headers = getAuthedHeaders()
  try {
    await axios({
      method: 'get',
      url: `${API_URL}/projects/${projectId}/credentials/${serialNumber}`,
      headers,
    })
    return true
  } catch (error: any) {
    return false
  }
}

// Gets the content (certificate and password) from a Certificate
// TODO: rename as is apple specific?
export async function getUserCredentialsContent(userCert: Certificate): Promise<UserCertificate_iOS> {
  const serialNumber = userCert.attributes.serialNumber
  const headers = getAuthedHeaders()
  const {data} = await axios({
    method: 'get',
    url: `${API_URL}/credentials/${serialNumber}`,
    headers,
  })
  const userCredential = data as UserCredential
  const {data: contents} = await axios({
    method: 'get',
    url: userCredential.url,
  })
  const userCredentialContents = contents as UserCertificate_iOS
  return userCredentialContents
}

// Tells us if we need to create/upload a keystore for a project
// TODO: rename as is Android specific?
export async function getHasKeystore(projectId: string) {
  const headers = getAuthedHeaders()
  try {
    await axios.get(`${API_URL}/projects/${projectId}/credentials/android/certificate`, {
      headers,
    })
    return true
  } catch (e: any) {
    if (e.response?.status === 404) {
      return false
    }
    throw e
  }
}
