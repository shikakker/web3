export function buildWalletLoginMessage(address: string, nonce: string) {
  const normalizedAddress = address.trim().toLowerCase()
  const normalizedNonce = nonce.trim()

  if (!normalizedAddress || !normalizedNonce) {
    throw new Error('INVALID_WALLET_LOGIN_CHALLENGE')
  }

  return [
    'Web3 Sessions authentication',
    '',
    `Wallet: ${normalizedAddress}`,
    `Nonce: ${normalizedNonce}`,
    '',
    'Sign this message to prove ownership of this wallet.',
    'This request does not create a blockchain transaction.',
  ].join('\n')
}
