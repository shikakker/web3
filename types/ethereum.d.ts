import type { providers } from 'ethers'

interface InjectedEthereumProvider extends providers.ExternalProvider {
  on?: (
    event: 'accountsChanged',
    listener: (accounts: string[]) => void,
  ) => void
  removeListener?: (
    event: 'accountsChanged',
    listener: (accounts: string[]) => void,
  ) => void
}

declare global {
  interface Window {
    ethereum?: InjectedEthereumProvider
  }
}

export {}
