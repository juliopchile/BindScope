import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import {
  SUPPORT_CONFIG,
  configuredNetworks,
  hasCryptoSupport,
  hasDonateMethods,
  hasKofiSupport,
  paymentPayload,
  type CryptoNetwork,
  type CryptoNetworkId,
} from '../data/supportConfig'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n'
import {
  ensureChain,
  getEthereum,
  hasMetaMaskProvider,
  parseEtherToHex,
  requestAccounts,
  sendNativeTransfer,
} from '../lib/ethereum'
import { AddressQr } from './AddressQr'
import { KofiIcon, MetaMaskIcon } from './SupportIcons'

type Panel = 'home' | 'metamask' | 'manual'

type SupportModalProps = {
  onClose: () => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
}

function shortenAddress(address: string): string {
  const trimmed = address.trim()
  if (trimmed.length <= 14) return trimmed
  return `${trimmed.slice(0, 6)}…${trimmed.slice(-4)}`
}

function networkLabelKey(id: CryptoNetworkId): MessageKey {
  switch (id) {
    case 'ethereum':
      return 'footerNetworkEthereum'
    case 'bsc':
      return 'footerNetworkBsc'
    case 'tron':
      return 'footerNetworkTron'
    case 'bitcoin':
      return 'footerNetworkBitcoin'
    case 'solana':
      return 'footerNetworkSolana'
  }
}

function isEvmSendable(network: CryptoNetwork | undefined): boolean {
  return Boolean(network?.evm && network.chain)
}

export function SupportModal({ onClose, returnFocusRef }: SupportModalProps) {
  const { t } = useI18n()
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [panel, setPanel] = useState<Panel>('home')
  const networks = configuredNetworks()
  const [manualNetworkId, setManualNetworkId] = useState<CryptoNetworkId>(
    networks[0]?.id ?? 'ethereum',
  )
  const [metamaskNetworkId, setMetamaskNetworkId] = useState<CryptoNetworkId>(
    networks[0]?.id ?? 'ethereum',
  )
  const [amount, setAmount] = useState('')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [sendStatus, setSendStatus] = useState<
    'idle' | 'working' | 'sent' | 'failed' | 'invalid'
  >('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [walletError, setWalletError] = useState<string | null>(null)
  const hasWallet = hasMetaMaskProvider()
  const showKofi = hasKofiSupport()
  const showCrypto = hasCryptoSupport()
  const showMethods = hasDonateMethods()

  const manualNetwork: CryptoNetwork | undefined =
    networks.find((n) => n.id === manualNetworkId) ?? networks[0]
  const metamaskNetwork: CryptoNetwork | undefined =
    networks.find((n) => n.id === metamaskNetworkId) ?? networks[0]
  const metamaskCanSend = isEvmSendable(metamaskNetwork)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        returnFocusRef.current?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => {
      dialogRef.current?.focus()
    })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, returnFocusRef])

  useEffect(() => {
    if (copyStatus === 'idle') return
    const timer = window.setTimeout(() => setCopyStatus('idle'), 2000)
    return () => window.clearTimeout(timer)
  }, [copyStatus])

  async function copyAddress(network: CryptoNetwork | undefined) {
    const address = network?.address.trim()
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  async function sendWithMetaMask() {
    const provider = getEthereum()
    const network = metamaskNetwork
    if (!provider || !isEvmSendable(network) || !network?.chain) {
      setWalletError('missing')
      return
    }
    const valueHex = parseEtherToHex(amount)
    if (!valueHex) {
      setSendStatus('invalid')
      return
    }
    setSendStatus('working')
    setWalletError(null)
    setTxHash(null)
    try {
      const account = await requestAccounts(provider)
      if (!account) {
        setSendStatus('failed')
        setWalletError('accounts')
        return
      }
      await ensureChain(provider, network.chain)
      const hash = await sendNativeTransfer(provider, {
        from: account,
        to: network.address.trim(),
        valueHex,
      })
      setTxHash(hash)
      setSendStatus('sent')
    } catch {
      setSendStatus('failed')
      setWalletError('send')
    }
  }

  function goHome() {
    setPanel('home')
    setSendStatus('idle')
    setWalletError(null)
    setCopyStatus('idle')
  }

  function selectMetamaskNetwork(id: CryptoNetworkId) {
    setMetamaskNetworkId(id)
    setSendStatus('idle')
    setWalletError(null)
    setTxHash(null)
    setCopyStatus('idle')
  }

  const symbol = metamaskNetwork?.chain?.nativeCurrency.symbol ?? 'ETH'

  function renderAddressHelpers(network: CryptoNetwork) {
    return (
      <>
        <code
          className="block break-all rounded-md border px-2 py-1.5 font-mono text-xs"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          {network.address.trim()}
        </code>

        <button
          type="button"
          className="inline-flex min-h-10 w-full items-center justify-center rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2"
          style={{
            borderColor: 'var(--accent)',
            color: 'var(--fg)',
            outlineColor: 'var(--focus)',
          }}
          onClick={() => {
            void copyAddress(network)
          }}
        >
          {t('footerCopyAddress')}
        </button>

        {copyStatus === 'copied' ? (
          <p className="text-xs" style={{ color: 'var(--fg-muted)' }} role="status">
            {t('footerCopySuccess')}
          </p>
        ) : null}
        {copyStatus === 'failed' ? (
          <p className="text-xs" style={{ color: 'var(--fg-muted)' }} role="status">
            {t('footerCopyFailed')}
          </p>
        ) : null}

        <AddressQr
          key={network.id}
          value={paymentPayload(network)}
          label={t('footerQrAriaLabel', {
            chain: t(networkLabelKey(network.id)),
          })}
        />
      </>
    )
  }

  return (
    <div className="support-modal" role="presentation">
      <button
        type="button"
        className="support-modal__backdrop"
        aria-label={t('footerSupportClose')}
        onClick={() => {
          onClose()
          returnFocusRef.current?.focus()
        }}
      />
      <div
        ref={dialogRef}
        className="support-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          background: 'var(--bg)',
          borderColor: 'var(--border)',
          color: 'var(--fg)',
        }}
      >
        <div className="support-modal__header flex items-start justify-between gap-3">
          <div>
            {panel !== 'home' ? (
              <button
                type="button"
                className="support-modal__back mb-1 inline-flex min-h-8 items-center rounded-md px-1 text-xs font-medium focus-visible:outline focus-visible:outline-2"
                style={{ color: 'var(--fg-muted)', outlineColor: 'var(--focus)' }}
                onClick={goHome}
              >
                {t('footerSupportBack')}
              </button>
            ) : null}
            <h2 id={titleId} className="text-base font-semibold">
              {panel === 'metamask'
                ? t('footerMetamaskTitle')
                : panel === 'manual'
                  ? t('footerManualTitle')
                  : t('footerSupportDialogAriaLabel')}
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border px-2 text-sm focus-visible:outline focus-visible:outline-2"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--fg)',
              outlineColor: 'var(--focus)',
            }}
            onClick={() => {
              onClose()
              returnFocusRef.current?.focus()
            }}
          >
            <span aria-hidden="true">×</span>
            <span className="sr-only">{t('footerSupportClose')}</span>
          </button>
        </div>

        <div className="support-modal__body mt-3 space-y-3">
          {!showMethods ? (
            <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
              {t('footerSupportEmpty')}
            </p>
          ) : null}

          {showMethods && panel === 'home' ? (
            <div className="grid gap-2">
              {showKofi ? (
                <a
                  className="support-modal__action support-modal__action--kofi inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2"
                  style={{
                    borderColor: '#66288a',
                    color: 'var(--fg)',
                    outlineColor: 'var(--focus)',
                    background: 'color-mix(in srgb, #66288a 12%, var(--surface))',
                  }}
                  href={SUPPORT_CONFIG.kofiUrl.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <KofiIcon className="support-icon support-icon--kofi" />
                  {t('footerKofi')}
                </a>
              ) : null}

              {showCrypto ? (
                <>
                  <button
                    type="button"
                    className="support-modal__action inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--fg)',
                      outlineColor: 'var(--focus)',
                      background: 'var(--surface)',
                    }}
                    onClick={() => setPanel('metamask')}
                  >
                    <MetaMaskIcon className="support-icon support-icon--metamask" />
                    {t('footerMetamask')}
                  </button>
                  <button
                    type="button"
                    className="support-modal__action inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2"
                    style={{
                      borderColor: 'var(--accent)',
                      color: 'var(--fg)',
                      outlineColor: 'var(--focus)',
                      background: 'var(--surface)',
                    }}
                    onClick={() => setPanel('manual')}
                  >
                    {t('footerManual')}
                  </button>
                </>
              ) : null}
            </div>
          ) : null}

          {showMethods && panel === 'metamask' ? (
            <div className="space-y-3">
              {!hasWallet ? (
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                    {t('footerMetamaskMissing')}
                  </p>
                  <a
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--accent)',
                      outlineColor: 'var(--focus)',
                    }}
                    href={SUPPORT_CONFIG.metamaskInstallUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('footerMetamaskInstall')}
                  </a>
                  <button
                    type="button"
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2"
                    style={{
                      borderColor: 'var(--accent)',
                      color: 'var(--fg)',
                      outlineColor: 'var(--focus)',
                    }}
                    onClick={() => setPanel('manual')}
                  >
                    {t('footerMetamaskUseManual')}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                    {t('footerMetamaskHint')}
                  </p>
                  {networks.length > 1 ? (
                    <label className="block space-y-1 text-sm">
                      <span style={{ color: 'var(--fg-muted)' }}>{t('footerNetworkLabel')}</span>
                      <select
                        className="w-full min-h-10 rounded-md border px-2 py-1.5"
                        style={{
                          borderColor: 'var(--border)',
                          background: 'var(--surface)',
                          color: 'var(--fg)',
                        }}
                        value={metamaskNetwork?.id}
                        onChange={(event) =>
                          selectMetamaskNetwork(event.target.value as CryptoNetworkId)
                        }
                      >
                        {networks.map((network) => (
                          <option key={network.id} value={network.id}>
                            {t(networkLabelKey(network.id))}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : metamaskNetwork ? (
                    <p className="text-sm font-medium">{t(networkLabelKey(metamaskNetwork.id))}</p>
                  ) : null}

                  {metamaskCanSend && metamaskNetwork ? (
                    <>
                      <label className="block space-y-1 text-sm">
                        <span style={{ color: 'var(--fg-muted)' }}>
                          {t('footerMetamaskAmount', { symbol })}
                        </span>
                        <input
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          placeholder="0.01"
                          className="w-full min-h-10 rounded-md border px-2 py-1.5 font-mono text-sm"
                          style={{
                            borderColor: 'var(--border)',
                            background: 'var(--surface)',
                            color: 'var(--fg)',
                          }}
                          value={amount}
                          onChange={(event) => {
                            setAmount(event.target.value)
                            if (sendStatus !== 'idle') setSendStatus('idle')
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2"
                        style={{
                          borderColor: 'var(--accent)',
                          color: 'var(--fg)',
                          outlineColor: 'var(--focus)',
                          background: 'color-mix(in srgb, var(--accent) 14%, var(--surface))',
                        }}
                        disabled={sendStatus === 'working' || !metamaskNetwork}
                        onClick={() => {
                          void sendWithMetaMask()
                        }}
                      >
                        <MetaMaskIcon className="support-icon support-icon--metamask" />
                        {sendStatus === 'working'
                          ? t('footerMetamaskSending')
                          : t('footerMetamaskSend')}
                      </button>

                      {sendStatus === 'invalid' ? (
                        <p className="text-xs" style={{ color: 'var(--fg-muted)' }} role="status">
                          {t('footerMetamaskInvalidAmount')}
                        </p>
                      ) : null}
                      {sendStatus === 'failed' ? (
                        <p className="text-xs" style={{ color: 'var(--fg-muted)' }} role="status">
                          {walletError === 'accounts'
                            ? t('footerWalletFailed')
                            : t('footerMetamaskSendFailed')}
                        </p>
                      ) : null}
                      {sendStatus === 'sent' && txHash ? (
                        <p
                          className="text-xs break-all"
                          style={{ color: 'var(--fg-muted)' }}
                          role="status"
                        >
                          {t('footerMetamaskSent', { hash: shortenAddress(txHash) })}
                        </p>
                      ) : null}
                    </>
                  ) : metamaskNetwork ? (
                    <div className="space-y-3">
                      <p className="text-xs" style={{ color: 'var(--fg-muted)' }} role="status">
                        {t('footerMetamaskUnsupported', {
                          chain: t(networkLabelKey(metamaskNetwork.id)),
                        })}
                      </p>
                      {renderAddressHelpers(metamaskNetwork)}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          ) : null}

          {showMethods && panel === 'manual' && manualNetwork ? (
            <div className="space-y-3">
              <label className="block space-y-1 text-sm">
                <span style={{ color: 'var(--fg-muted)' }}>{t('footerNetworkLabel')}</span>
                <select
                  className="w-full min-h-10 rounded-md border px-2 py-1.5"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--fg)',
                  }}
                  value={manualNetwork.id}
                  onChange={(event) => {
                    setManualNetworkId(event.target.value as CryptoNetworkId)
                    setCopyStatus('idle')
                  }}
                >
                  {networks.map((network) => (
                    <option key={network.id} value={network.id}>
                      {t(networkLabelKey(network.id))}
                    </option>
                  ))}
                </select>
              </label>

              <p className="text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>
                {t('footerCryptoHeading', {
                  chain: t(networkLabelKey(manualNetwork.id)),
                })}
              </p>

              {renderAddressHelpers(manualNetwork)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
