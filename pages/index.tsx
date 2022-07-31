import { signIn } from 'next-auth/react'
import { useConnect, useAccount } from 'wagmi'

function Home() {
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData }] = useAccount()
  const metamaskInstalled = connectData.connectors[0].name === 'MetaMask'

  const handleLogin = async () => {
    try {
      const callbackUrl = '/protected'
      if (accountData?.address) {
        signIn('credentials', { address: accountData.address, callbackUrl })
        return
      }
      const { data, error } = await connect(connectData.connectors[0])
      if (error) {
        throw error
      }
      signIn('credentials', { address: data?.account, callbackUrl })
    } catch (error) {
      window.alert(error)
    }
  }

  return (
    <Page>
      <section className="flex flex-col space-y-4 gap-6">
        <Text variant="h1">Web3 Sessions with NextAuth.js</Text>
                
        {metamaskInstalled ? (
          <>
            <Text>Try it by logging in!</Text>
            <Button onClick={handleLogin}>Login</Button>
          </>
        ) : (
          <>
            <Text>
              {' '}
              Please install{' '}
              <Link href="https://metamask.io/" target="_blank">
                Metamask
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
