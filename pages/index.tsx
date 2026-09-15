import { providers, utils } from 'ethers'
import { getCsrfToken, signIn } from 'next-auth/react'
import { useState } from 'react'
import { useConnect, useAccount } from 'wagmi'
import { buildWalletLoginMessage } from '../lib/wallet-auth'

declare global {
  interface Window {
    ethereum?: providers.ExternalProvider
  }
}

function Home() {
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData }] = useAccount()
  const [loginError, setLoginError] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)

  const metamaskConnector = connectData.connectors.find(
    (connector) => connector.name === 'MetaMask'
  )
  const metamaskInstalled = Boolean(metamaskConnector)

  const authenticateWallet = async (address: string) => {
    const nonce = await getCsrfToken()
    if (!nonce) {
      throw new Error('Unable to create a secure login challenge.')
    }

    if (!window.ethereum) {
      throw new Error('MetaMask is not available in this browser.')
    }

    const expectedAddress = utils.getAddress(address)
    const provider = new providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const signerAddress = utils.getAddress(await signer.getAddress())

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
      if (accountData?.address) {
        await authenticateWallet(accountData.address)
        return
      }

      if (!metamaskConnector) {
        throw new Error('MetaMask is not available in this browser.')
      }

      const { data, error } = await connect(metamaskConnector)
      if (error) {
        throw error
      }
      if (!data?.account) {
        throw new Error('MetaMask did not return a wallet address.')
      }

      await authenticateWallet(data.account)
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : 'Wallet login failed.'
      )
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <Page>
      <section className="flex flex-col space-y-4 gap-6">
        <Text variant="h1">Web3 Sessions with NextAuth.js</Text>

        {metamaskInstalled ? (
          <>
            <Text>
              Connect MetaMask and sign a login message to prove wallet
              ownership. This does not create a blockchain transaction.
            </Text>
            <Button onClick={handleLogin} disabled={isSigningIn}>
              {isSigningIn ? 'Waiting for signature…' : 'Login with MetaMask'}
            </Button>
            {loginError ? (
              <p role="alert" className="text-red-600">
                {loginError}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <Text>
              {' '}
              Please install{' '}
              <Link href="https://metamask.io/" target="_blank">
                MetaMask
              </Link>{' '}
              to use this example.
            </Text>
          </>
        )}
      </section>

      <hr className="border-t border-accents-2 my-6" />
    </Page>
  )
}

Home.Layout = Layout

export default Home
