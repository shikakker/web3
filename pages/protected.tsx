import type { NextPageContext } from 'next'
import { getSession, useSession } from 'next-auth/react'

import { useProtected } from '../hooks/useProtected'

function Protected() {
  const handleLogout = useProtected()
  const { data: session } = useSession()
  const address = session?.address

  return (
    <section className="card stack" aria-labelledby="protected-title">
      <h1 id="protected-title" className="page-title">
        Protected wallet session
      </h1>
      <p className="body-copy">
        The server created this session only after verifying a message signed by
        the connected wallet.
      </p>
      {address ? (
        <p className="info-note">
          Signed in as <strong>{address}</strong>
        </p>
      ) : null}
      <p className="body-copy">
        Disconnecting the wallet also signs out this session so a stale browser
        session is not presented as an active wallet connection.
      </p>
      <button type="button" className="secondary-button" onClick={handleLogout}>
        Logout
      </button>
    </section>
  )
}

export default Protected

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
