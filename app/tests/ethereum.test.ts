import { describe, expect, it } from 'vitest'
import { parseEtherToHex } from '../src/lib/ethereum'

describe('parseEtherToHex', () => {
  it('converts whole and fractional amounts to wei hex', () => {
    expect(parseEtherToHex('1')).toBe(`0x${(10n ** 18n).toString(16)}`)
    expect(parseEtherToHex('0.01')).toBe(`0x${(10n ** 16n).toString(16)}`)
    expect(parseEtherToHex('1.5')).toBe(`0x${(15n * 10n ** 17n).toString(16)}`)
  })

  it('rejects empty, zero, and malformed amounts', () => {
    expect(parseEtherToHex('')).toBeNull()
    expect(parseEtherToHex('0')).toBeNull()
    expect(parseEtherToHex('0.0')).toBeNull()
    expect(parseEtherToHex('-1')).toBeNull()
    expect(parseEtherToHex('1.2.3')).toBeNull()
    expect(parseEtherToHex('abc')).toBeNull()
  })
})
