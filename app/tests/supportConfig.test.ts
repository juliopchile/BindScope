import { describe, expect, it } from 'vitest'
import {
  SUPPORT_CONFIG,
  configuredNetworks,
  evmNetworks,
  getNetworkById,
  hasCryptoSupport,
  hasDonateMethods,
  hasKofiSupport,
  paymentPayload,
  type SupportConfig,
} from '../src/data/supportConfig'

const empty: SupportConfig = {
  kofiUrl: '',
  networks: [
    { id: 'ethereum', address: '', evm: true },
    { id: 'bitcoin', address: '', evm: false },
  ],
  githubRepoUrl: 'https://github.com/juliopchile/BindScope',
  githubIssuesUrl: 'https://github.com/juliopchile/BindScope/issues',
  metamaskInstallUrl: 'https://metamask.io/download/',
}

describe('supportConfig helpers', () => {
  it('ships with Ko-fi, multi-network wallets, and GitHub URLs', () => {
    expect(SUPPORT_CONFIG.githubRepoUrl).toBe('https://github.com/juliopchile/BindScope')
    expect(SUPPORT_CONFIG.githubIssuesUrl).toBe(
      'https://github.com/juliopchile/BindScope/issues',
    )
    expect(SUPPORT_CONFIG.kofiUrl).toBe('https://ko-fi.com/memristor')
    expect(hasKofiSupport(SUPPORT_CONFIG)).toBe(true)
    expect(hasCryptoSupport(SUPPORT_CONFIG)).toBe(true)
    expect(hasDonateMethods(SUPPORT_CONFIG)).toBe(true)
    expect(configuredNetworks(SUPPORT_CONFIG)).toHaveLength(5)
    expect(evmNetworks(SUPPORT_CONFIG).map((n) => n.id)).toEqual(['ethereum', 'bsc'])
    expect(getNetworkById('solana')?.address).toBe(
      'GJ3sykuFxfBJZDKLMkPGmZvDzoFzXHHQMrkbBBSZniH3',
    )
  })

  it('treats blank donate fields as hidden', () => {
    expect(hasKofiSupport({ ...empty, kofiUrl: '   ' })).toBe(false)
    expect(hasCryptoSupport(empty)).toBe(false)
    expect(configuredNetworks(empty)).toEqual([])
  })

  it('detects configured donate methods independently', () => {
    expect(hasKofiSupport({ ...empty, kofiUrl: 'https://ko-fi.com/example' })).toBe(true)
    expect(
      hasCryptoSupport({
        ...empty,
        networks: [{ id: 'bitcoin', address: 'bc1qexample', evm: false }],
      }),
    ).toBe(true)
    expect(
      hasDonateMethods({
        ...empty,
        kofiUrl: 'https://ko-fi.com/example',
      }),
    ).toBe(true)
    expect(
      hasDonateMethods({
        ...empty,
        networks: [{ id: 'ethereum', address: '0xabc', evm: true }],
      }),
    ).toBe(true)
  })

  it('builds helpful payment payloads for QR encoding', () => {
    expect(
      paymentPayload({
        id: 'ethereum',
        address: '0x0b75c5be2e03467cb8871a732323e335d79b6225',
        evm: true,
      }),
    ).toBe('ethereum:0x0b75c5be2e03467cb8871a732323e335d79b6225')
    expect(
      paymentPayload({
        id: 'bitcoin',
        address: '1127EouYkWkHhKxxXWM7oGFvAsThWsMoVc',
        evm: false,
      }),
    ).toBe('bitcoin:1127EouYkWkHhKxxXWM7oGFvAsThWsMoVc')
    expect(
      paymentPayload({
        id: 'solana',
        address: 'GJ3sykuFxfBJZDKLMkPGmZvDzoFzXHHQMrkbBBSZniH3',
        evm: false,
      }),
    ).toBe('GJ3sykuFxfBJZDKLMkPGmZvDzoFzXHHQMrkbBBSZniH3')
  })
})
