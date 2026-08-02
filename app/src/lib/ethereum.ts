/** Minimal EIP-1193 provider surface used by the Support MetaMask flow. */

export type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

type ProviderError = { code?: number; message?: string }

export function getEthereum(): EthereumProvider | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as Window & { ethereum?: EthereumProvider }).ethereum
}

export function hasMetaMaskProvider(): boolean {
  return Boolean(getEthereum())
}

/** Parse a decimal ETH/BNB amount into a `0x`-prefixed wei hex value. */
export function parseEtherToHex(amount: string): string | null {
  const trimmed = amount.trim()
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null
  const [wholeRaw = '0', fracRaw = ''] = trimmed.split('.')
  const whole = wholeRaw.replace(/^0+(?=\d)/, '') || '0'
  const fracPadded = (fracRaw + '000000000000000000').slice(0, 18)
  const wei = BigInt(whole) * 10n ** 18n + BigInt(fracPadded)
  if (wei <= 0n) return null
  return `0x${wei.toString(16)}`
}

export async function requestAccounts(provider: EthereumProvider): Promise<string | null> {
  const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[]
  return accounts[0]?.trim() || null
}

export async function ensureChain(
  provider: EthereumProvider,
  chain: {
    chainId: string
    chainName: string
    nativeCurrency: { name: string; symbol: string; decimals: number }
    rpcUrls: readonly string[]
    blockExplorerUrls?: readonly string[]
  },
): Promise<void> {
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain.chainId }],
    })
  } catch (error) {
    const code = (error as ProviderError)?.code
    if (code !== 4902) throw error
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: chain.chainId,
          chainName: chain.chainName,
          nativeCurrency: chain.nativeCurrency,
          rpcUrls: [...chain.rpcUrls],
          blockExplorerUrls: chain.blockExplorerUrls
            ? [...chain.blockExplorerUrls]
            : undefined,
        },
      ],
    })
  }
}

export async function sendNativeTransfer(
  provider: EthereumProvider,
  args: { from: string; to: string; valueHex: string },
): Promise<string> {
  const txHash = (await provider.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: args.from,
        to: args.to,
        value: args.valueHex,
      },
    ],
  })) as string
  return txHash
}
