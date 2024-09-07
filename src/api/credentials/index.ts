import axios from 'axios'
import {ApiKey, Certificate} from '@expo/apple-utils'

import {getAuthedHeaders} from '@cli/auth'
import {API_URL} from '@cli/config'
import {getProjectFromConfig} from '@cli/project'

// @ts-ignore
import {UserCertificate_iOS, UserCredential} from './types.ts'

// @ts-ignore
export * from './types.ts'
// @ts-ignore
export * from './upload.ts'
// @ts-ignore
export * from './import.ts'

async function getAllUserCredentials(): Promise<UserCredential[]> {
  console.debug('only getting first 100 credentials')
  const headers = await getAuthedHeaders()
  const {data} = await axios({
    method: 'get',
    url: `${API_URL}/credentials?pageSize=100`,
    headers,
  })
  return data.data as UserCredential[]
}

// Find a valid cert that we have the private key for
// TODO: rename as is apple specific?
export async function getUseableCert(certs: Certificate[]): Promise<Certificate | undefined> {
  const validCertSerialNumbers = certs
    .filter((cert) => cert.attributes.status == 'Issued')
    .map((cert) => cert.attributes.serialNumber)
  const userCredentials = await getAllUserCredentials()
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
  const userCredentials = await getAllUserCredentials()
  const userCred = userCredentials.find((cred) => {
    return validKeyIds.includes(cred.serialNumber)
  })
  if (!userCred) return undefined
  return keys.find((key) => key.id == userCred.serialNumber)
}

// Tells us if we need to create a project cert given the valid user cert
// TODO: rename as is apple specific?
export async function hasProjectCredentials(userCert: Certificate): Promise<Boolean> {
  const project = await getProjectFromConfig()
  const {id: projectId} = project
  const serialNumber = userCert.attributes.serialNumber
  const headers = await getAuthedHeaders()
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
  const headers = await getAuthedHeaders()
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
  const headers = await getAuthedHeaders()
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
