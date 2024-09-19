import forge from 'node-forge'

import {Certificate, CertificateType} from '@cli/apple/expo.js'

function decodeCertificate(certificateContent: string) {
  const decodedContent = forge.util.decode64(certificateContent)
  const asn1 = forge.asn1.fromDer(decodedContent)
  return forge.pki.certificateFromAsn1(asn1)
}

function encodePkcs12(pkcs12Asn1: any) {
  const derBytes = forge.asn1.toDer(pkcs12Asn1).getBytes()
  return forge.util.encode64(derBytes)
}

export interface CreateCertificateResult {
  certificate: any
  privateKey: forge.pki.rsa.PrivateKey
  privateKeyPem: string
}

// Create a new certificate
export async function createCertificate(
  ctx: any,
  certificateType = CertificateType.IOS_DISTRIBUTION,
): Promise<CreateCertificateResult> {
  const {
    pem: csrPem,
    keyPair: {privateKey},
  } = await Certificate.createCertificateSigningRequestAsync()

  const certificate = await Certificate.createAsync(ctx, {
    csrContent: csrPem,
    certificateType,
  })

  return {
    certificate,
    privateKey,
    privateKeyPem: forge.pki.privateKeyToPem(privateKey),
  }
}

export interface ExportCertificateResult {
  certificateBase64: string
  certificatePassword: string
}

// Convert to a PKCS12 file and password
export function exportCertificate(certificate: any, privateKey: forge.pki.rsa.PrivateKey): ExportCertificateResult {
  const decodedCertificate = decodeCertificate(certificate.attributes.certificateContent)

  const password = forge.util.encode64(forge.random.getBytesSync(16))
  const pkcs12Asn1 = forge.pkcs12.toPkcs12Asn1(privateKey, [decodedCertificate], password, {
    friendlyName: 'key',
    algorithm: '3des',
  })
  const encodedPkcs12 = encodePkcs12(pkcs12Asn1)
  return {
    certificateBase64: encodedPkcs12,
    certificatePassword: password,
  }
}
