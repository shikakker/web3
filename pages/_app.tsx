import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'

import '../styles/globals.css'

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="app-shell">
        <header className="app-header">
          <a className="brand" href="/">
            Web3 Sessions
          </a>
          <span className="app-subtitle">Wallet ownership demo</span>
        </header>
        <main className="app-main">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  )
}

export default App
