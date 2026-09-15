import { BrowserProvider, getAddress } from 'ethers'
import { getCsrfToken, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { buildWalletLoginMessage } from '../lib/wallet-auth'

function Home() {
  const [loginError, setLoginError] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)

  const requestWalletAddress = async () => {
    const ethereum = window.ethereum
    if (!ethereum?.request) {
      throw new Error('MetaMask is not available in this browser.')
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    if (
      !Array.isArray(accounts) ||
      accounts.length === 0 ||
      typeof accounts[0] !== 'string'
    ) {
      throw new Error('MetaMask did not return a wallet address.')
    }

    return getAddress(accounts[0])
  }

  const authenticateWallet = async (address: string) => {
    const nonce = await getCsrfToken()
    if (!nonce) {
      throw new Error('Unable to create a secure login challenge.')
    }

    const ethereum = window.ethereum
    if (!ethereum) {
      throw new Error('MetaMask is not available in this browser.')
    }

    const expectedAddress = getAddress(address)
    const provider = new BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const signerAddress = getAddress(await signer.getAddress())

    if (signerAddress !== expectedAddress) {
      throw new Error('The connected wallet changed. Please try again.')
    }

    const message = buildWalletLoginMessage(expectedAddress, nonce)
    const signature = await signer.signMessage(message)
    const result = await signIn('credentials', {
      address: expectedAddress,
      message,
      signature,
      nonce,
      callbackUrl: '/protected',
      redirect: false,
    })

    if (!result || result.error) {
      throw new Error('Wallet signature could not be verified.')
    }

    if (result.url) {
      window.location.assign(result.url)
    }
  }

  const handleLogin = async () => {
    if (isSigningIn) return

    setLoginError('')
    setIsSigningIn(true)

    try {
      const address = await requestWalletAddress()
      await authenticateWallet(address)
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : 'Wallet login failed.'
      )
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <section className="card stack" aria-labelledby="wallet-login-title">
      <h1 id="wallet-login-title" className="page-title">
        Sign in with your wallet
      </h1>
      <p className="body-copy">
        Connect MetaMask and sign a one-time login message. The server verifies
        the signature before creating a session for that wallet address.
      </p>
      <p className="info-note">
        Signing in does not create a blockchain transaction and does not request
        permission to move funds.
      </p>

      <button
        type="button"
        className="primary-button"
        onClick={handleLogin}
        disabled={isSigningIn}
        aria-busy={isSigningIn}
      >
        {isSigningIn ? 'Waiting for signature…' : 'Login with MetaMask'}
      </button>

      <p className="body-copy">
        MetaMask not installed? Get it from the{' '}
        <Link
          className="inline-link"
          href="https://metamask.io/"
          target="_blank"
          rel="noreferrer"
        >
          official MetaMask site
        </Link>
        .
      </p>

      {loginError ? (
        <p role="alert" className="error-message">
          {loginError}
        </p>
      ) : null}
    </section>
  )
}

export default Home
