import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react'
import { useI18n } from '../i18n/useI18n'

export type ChromePanelId = 'games' | 'io' | 'prefs'

interface ChromeToolbarProps {
  leading: ReactNode
  openPanel: ChromePanelId | null
  onOpenPanelChange: (panel: ChromePanelId | null) => void
  gamesBadge?: number
  gamesPanel: ReactNode
  ioPanel: ReactNode
  prefsPanel: ReactNode
}

const PANEL_ORDER: ChromePanelId[] = ['games', 'io', 'prefs']

export function ChromeToolbar({
  leading,
  openPanel,
  onOpenPanelChange,
  gamesBadge,
  gamesPanel,
  ioPanel,
  prefsPanel,
}: ChromeToolbarProps) {
  const { t } = useI18n()
  const panelRegionId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const gamesButtonRef = useRef<HTMLButtonElement>(null)
  const ioButtonRef = useRef<HTMLButtonElement>(null)
  const prefsButtonRef = useRef<HTMLButtonElement>(null)

  const labels: Record<ChromePanelId, string> = {
    games: t('menuGames'),
    io: t('menuImportExport'),
    prefs: t('menuPrefs'),
  }

  const panels: Record<ChromePanelId, ReactNode> = {
    games: gamesPanel,
    io: ioPanel,
    prefs: prefsPanel,
  }

  const buttonRefs: Record<ChromePanelId, RefObject<HTMLButtonElement | null>> = {
    games: gamesButtonRef,
    io: ioButtonRef,
    prefs: prefsButtonRef,
  }

  useEffect(() => {
    if (!openPanel) return

    const focusTarget =
      openPanel === 'games'
        ? gamesButtonRef
        : openPanel === 'io'
          ? ioButtonRef
          : prefsButtonRef

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onOpenPanelChange(null)
        focusTarget.current?.focus()
      }
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null
      if (!target || rootRef.current?.contains(target)) return
      onOpenPanelChange(null)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [openPanel, onOpenPanelChange])

  function toggle(panel: ChromePanelId) {
    onOpenPanelChange(openPanel === panel ? null : panel)
  }

  return (
    <div ref={rootRef} className="chrome-toolbar mx-auto flex w-full max-w-[1400px] flex-col">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">{leading}</div>
        <div
          className="chrome-toolbar__actions flex flex-wrap items-center justify-end gap-2"
          role="toolbar"
          aria-label={t('chromeToolbarAriaLabel')}
        >
          {PANEL_ORDER.map((panel) => {
            const expanded = openPanel === panel
            return (
              <button
                key={panel}
                ref={buttonRefs[panel]}
                type="button"
                className="chrome-toolbar__trigger inline-flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2"
                style={{
                  borderColor: expanded ? 'var(--accent)' : 'var(--border)',
                  background: expanded ? 'var(--bg)' : 'transparent',
                  color: 'var(--fg)',
                  outlineColor: 'var(--focus)',
                }}
                aria-expanded={expanded}
                aria-controls={expanded ? panelRegionId : undefined}
                aria-haspopup="true"
                onClick={() => toggle(panel)}
              >
                <span>{labels[panel]}</span>
                {panel === 'games' && gamesBadge != null && gamesBadge > 0 ? (
                  <span
                    className="rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums"
                    style={{ background: 'var(--bg)', color: 'var(--fg-muted)' }}
                    aria-label={t('gamesSelectedCount', { count: gamesBadge })}
                  >
                    {gamesBadge}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {openPanel ? (
        <div
          id={panelRegionId}
          className="chrome-toolbar__panel mt-3 w-full rounded-lg border p-4"
          style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
          role="region"
          aria-label={labels[openPanel]}
        >
          {panels[openPanel]}
        </div>
      ) : null}
    </div>
  )
}
