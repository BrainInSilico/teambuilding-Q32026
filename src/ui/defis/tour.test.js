import { describe, it, expect } from 'vitest'
import { setupTour, DES } from './tour.js'
import { mulberry32 } from '../../engine/rng.js'

describe('setupTour', () => {
  it('impose un ordre = permutation des dés (sans d4)', () => {
    const s = setupTour(mulberry32(42))
    expect([...s.ordre].sort()).toEqual([...DES].sort())
    expect(s.ordre).not.toContain('d4')
  })
  it('déterministe pour un même seed', () => {
    expect(setupTour(mulberry32(7))).toEqual(setupTour(mulberry32(7)))
  })
  it('l’ordre varie selon le seed', () => {
    const a = setupTour(mulberry32(1)).ordre.join('')
    const b = setupTour(mulberry32(2)).ordre.join('')
    const c = setupTour(mulberry32(9)).ordre.join('')
    expect(new Set([a, b, c]).size).toBeGreaterThan(1)
  })
})
