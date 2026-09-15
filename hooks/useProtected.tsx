import { signOut, useSession } from 'next-auth/react'
import { useCallback, useEffect } from 'react'

export function useProtected() {
  const { data: session } = useSession()

  const handleSignout = useCallback(async () => {
    await signOut({ callbackUrl: '/' })
  }, [])

  useEffect(() => {
    const ethereum = window.ethereum
    const sessionAddress = session?.address?.toLowerCase()

    if (!ethereum?.request || !sessionAddress) {
      return
    }

    let active = true

    const reconcileAccounts = (accounts: string[]) => {
      if (!active) return

      const connectedAddress = accounts[0]?.toLowerCase()
      if (!connectedAddress || connectedAddress !== sessionAddress) {
        void handleSignout()
      }
    }

    const readCurrentAccounts = async () => {
      try {
        const accounts = await ethereum.request?.({ method: 'eth_accounts' })
        if (Array.isArray(accounts)) {
          reconcileAccounts(
            accounts.filter((account): account is string => typeof account === 'string')
          )
        }
      } catch {
        void handleSignout()
      }
    }

    ethereum.on?.('accountsChanged', reconcileAccounts)
    void readCurrentAccounts()

    return () => {
      active = false
      ethereum.removeListener?.('accountsChanged', reconcileAccounts)
    }
  }, [handleSignout, session?.address])

  return handleSignout
}
