import type { LayoutId } from '../types'
import { KEYBOARD_LAYOUTS } from '../data/keyboardLayouts'

interface LayoutSelectorProps {
  layoutId: LayoutId
  onChange: (layoutId: LayoutId) => void
}

export function LayoutSelector({ layoutId, onChange }: LayoutSelectorProps) {
  return (
    <section className="panel p-4" aria-label="Keyboard layout settings">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Layout</h2>
      <div className="flex flex-wrap gap-2">
        {Object.values(KEYBOARD_LAYOUTS).map((layout) => (
          <button
            key={layout.id}
            type="button"
            className={`btn ${layoutId === layout.id ? 'btn-primary' : ''}`}
            aria-pressed={layoutId === layout.id}
            onClick={() => onChange(layout.id as LayoutId)}
          >
            {layout.name}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">{KEYBOARD_LAYOUTS[layoutId]?.description}</p>
    </section>
  )
}
