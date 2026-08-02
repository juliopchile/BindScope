import { useRef, useState } from 'react'
import { SUPPORT_CONFIG } from '../data/supportConfig'
import { useI18n } from '../i18n/useI18n'
import { KofiIcon, MetaMaskIcon } from './SupportIcons'
import { SupportModal } from './SupportModal'

export function SiteFooter() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const supportButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <footer
      className="site-footer mt-auto border-t px-4 py-3"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
    >
      <nav
        className="site-footer__nav mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm"
        aria-label={t('footerNavAriaLabel')}
      >
        <button
          ref={supportButtonRef}
          type="button"
          className="site-footer__action site-footer__support-trigger inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 py-1.5 font-medium focus-visible:outline focus-visible:outline-2"
          style={{ color: 'var(--fg)', outlineColor: 'var(--focus)' }}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className="site-footer__support-icons" aria-hidden="true">
            <KofiIcon className="support-icon support-icon--kofi" />
            <MetaMaskIcon className="support-icon support-icon--metamask" />
          </span>
          {t('footerSupport')}
        </button>

        <span className="site-footer__sep" aria-hidden="true" style={{ color: 'var(--fg-muted)' }}>
          |
        </span>

        <a
          className="site-footer__action inline-flex min-h-10 items-center rounded-md px-2 py-1.5 font-medium focus-visible:outline focus-visible:outline-2"
          style={{ color: 'var(--fg)', outlineColor: 'var(--focus)' }}
          href={SUPPORT_CONFIG.githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('footerSource')}
        </a>

        <span className="site-footer__sep" aria-hidden="true" style={{ color: 'var(--fg-muted)' }}>
          |
        </span>

        <a
          className="site-footer__action inline-flex min-h-10 items-center rounded-md px-2 py-1.5 font-medium focus-visible:outline focus-visible:outline-2"
          style={{ color: 'var(--fg)', outlineColor: 'var(--focus)' }}
          href={SUPPORT_CONFIG.githubIssuesUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('footerReportIssue')}
        </a>
      </nav>

      {open ? (
        <SupportModal onClose={() => setOpen(false)} returnFocusRef={supportButtonRef} />
      ) : null}
    </footer>
  )
}
