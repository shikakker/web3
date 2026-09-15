import type { Eip1193Provider } from 'ethers'

interface InjectedEthereumProvider extends Eip1193Provider {
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
