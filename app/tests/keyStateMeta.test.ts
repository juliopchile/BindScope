import { describe, expect, it } from 'vitest'
import { getKeyStateMeta, LEGEND_STATES } from '../src/ui/keyStateMeta'

describe('key state meta', () => {
  it('gives every non-free legend state a non-color mark', () => {
    for (const state of LEGEND_STATES) {
      const meta = getKeyStateMeta(state)
      if (state === 'free') {
        expect(meta.mark).toBe('')
      } else {
        expect(meta.mark.length).toBeGreaterThan(0)
      }
    }
  })

  it('maps each state to a distinct fill class', () => {
    const classes = LEGEND_STATES.map((state) => getKeyStateMeta(state).fillClass)
    expect(new Set(classes).size).toBe(classes.length)
  })
})
