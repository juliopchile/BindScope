/**
 * Owner-editable support / donate endpoints (SF).
 * Leave `kofiUrl` empty or clear network addresses to hide those methods.
 */

export type CryptoNetworkId = 'ethereum' | 'bsc' | 'tron' | 'bitcoin' | 'solana'

export interface EvmChainMeta {
  /** Hex chain id, e.g. `0x1`. */
  chainId: string
  chainName: string
  nativeCurrency: { name: string; symbol: string; decimals: number }
  rpcUrls: readonly string[]
  blockExplorerUrls?: readonly string[]
}

export interface CryptoNetwork {
  id: CryptoNetworkId
  /** Receive address; empty string hides this network. */
  address: string
  /** MetaMask / EIP-1193 send support (EVM only). */
  evm: boolean
  /** Present when `evm` is true — used for switch/add + send. */
  chain?: EvmChainMeta
}

export interface SupportConfig {
  kofiUrl: string
  networks: readonly CryptoNetwork[]
  githubRepoUrl: string
  githubIssuesUrl: string
  metamaskInstallUrl: string
}

export const SUPPORT_CONFIG: SupportConfig = {
  kofiUrl: 'https://ko-fi.com/memristor',
  networks: [
    {
      id: 'ethereum',
      address: '0x0b75c5be2e03467cb8871a732323e335d79b6225',
      evm: true,
      chain: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://ethereum.publicnode.com'],
        blockExplorerUrls: ['https://etherscan.io'],
      },
    },
    {
      id: 'bsc',
      address: '0x0b75c5be2e03467cb8871a732323e335d79b6225',
      evm: true,
      chain: {
        chainId: '0x38',
        chainName: 'BNB Smart Chain',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com'],
      },
    },
    {
      id: 'tron',
      address: 'TCB3HP6He9NV6afDyomgqditu1GhE33DJC',
      evm: false,
    },
    {
      id: 'bitcoin',
      address: '1127EouYkWkHhKxxXWM7oGFvAsThWsMoVc',
      evm: false,
    },
    {
      id: 'solana',
      address: 'GJ3sykuFxfBJZDKLMkPGmZvDzoFzXHHQMrkbBBSZniH3',
      evm: false,
    },
  ],
  githubRepoUrl: 'https://github.com/juliopchile/BindScope',
  githubIssuesUrl: 'https://github.com/juliopchile/BindScope/issues',
  metamaskInstallUrl: 'https://metamask.io/download/',
}

export function hasKofiSupport(config: SupportConfig = SUPPORT_CONFIG): boolean {
  return config.kofiUrl.trim().length > 0
}

export function configuredNetworks(
  config: SupportConfig = SUPPORT_CONFIG,
): CryptoNetwork[] {
  return config.networks.filter((network) => network.address.trim().length > 0)
}

export function hasCryptoSupport(config: SupportConfig = SUPPORT_CONFIG): boolean {
  return configuredNetworks(config).length > 0
}

export function hasDonateMethods(config: SupportConfig = SUPPORT_CONFIG): boolean {
  return hasKofiSupport(config) || hasCryptoSupport(config)
}

export function evmNetworks(config: SupportConfig = SUPPORT_CONFIG): CryptoNetwork[] {
  return configuredNetworks(config).filter((network) => network.evm && network.chain)
}

export function getNetworkById(
  id: CryptoNetworkId,
  config: SupportConfig = SUPPORT_CONFIG,
): CryptoNetwork | undefined {
  return configuredNetworks(config).find((network) => network.id === id)
}

/** QR / clipboard payload — EIP-681 for Ethereum; plain address otherwise. */
export function paymentPayload(network: CryptoNetwork): string {
  const address = network.address.trim()
  if (!address) return ''
  if (network.id === 'ethereum') return `ethereum:${address}`
  if (network.id === 'bitcoin') return `bitcoin:${address}`
  return address
}
