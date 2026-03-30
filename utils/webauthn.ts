/**
 * WebAuthn Helpers for encoding/decoding base64url and Uint8Array.
 * Required for browser-backend communication during Passkey ceremony.
 */

/**
 * Converts a base64url string to a Uint8Array.
 */
export function base64urlToUint8Array(base64url: string): Uint8Array {
  const padding = '='.repeat((4 - (base64url.length % 4)) % 4)
  const base64 = (base64url + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

/**
 * Converts an ArrayBuffer to a base64url string.
 */
export function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = window.btoa(binary)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * Prepares options received from the server for navigator.credentials.create.
 */
export function prepareCreationOptions(options: any): PublicKeyCredentialCreationOptions {
  return {
    ...options,
    challenge: base64urlToUint8Array(options.challenge),
    user: {
      ...options.user,
      id: base64urlToUint8Array(options.user.id)
    },
    excludeCredentials: (options.excludeCredentials || []).map((cred: any) => ({
      ...cred,
      id: base64urlToUint8Array(cred.id)
    }))
  }
}

/**
 * Prepares the credential response for sending to the server.
 */
export function prepareCredentialResponse(credential: PublicKeyCredential) {
  const response = credential.response as AuthenticatorAttestationResponse
  return {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      attestationObject: bufferToBase64url(response.attestationObject),
      transports: typeof response.getTransports === 'function' ? response.getTransports() : []
    },
    clientExtensionResults: credential.getClientExtensionResults()
  }
}

/**
 * Prepares options received from the server for navigator.credentials.get.
 */
export function prepareAssertionOptions(options: any): PublicKeyCredentialRequestOptions {
  return {
    ...options,
    challenge: base64urlToUint8Array(options.challenge),
    allowCredentials: (options.allowCredentials || []).map((cred: any) => ({
      ...cred,
      id: base64urlToUint8Array(cred.id)
    }))
  }
}

/**
 * Prepares the assertion response for sending to the server.
 */
export function prepareAssertionResponse(credential: PublicKeyCredential) {
  const response = credential.response as AuthenticatorAssertionResponse
  return {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      authenticatorData: bufferToBase64url(response.authenticatorData),
      signature: bufferToBase64url(response.signature),
      userHandle: response.userHandle ? bufferToBase64url(response.userHandle) : null
    },
    clientExtensionResults: credential.getClientExtensionResults()
  }
}
