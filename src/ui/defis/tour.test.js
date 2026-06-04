import { describe, it, expect } from 'vitest'
import { setupTour } from './tour.js'
import { mulberry32 } from '../../engine/rng.js'

describe('setupTour — configuration selon la difficulté', () => {
  it('entraînement : 5 dés, AUCUN d8', () => {
    for (let s = 0; s < 20; s++) {
      const t = setupTour(mulberry32(s), 'entrainement')
      expect(t.ordre).toHaveLength(5)
      expect(t.ordre).not.toContain('d8')
    }
  })
  it('normal : 7 dés, un d8 vers la fin', () => {
    const t = setupTour(mulberry32(3), 'normal')
    expect(t.ordre).toHaveLength(7)
    expect(t.ordre).toContain('d8')
    expect(t.ordre.indexOf('d8')).toBeGreaterThanOrEqual(4) // dernier tiers
  })
  it('épique : 8 dés, un d8 (placé au hasard)', () => {
    const t = setupTour(mulberry32(5), 'epique')
    expect(t.ordre).toHaveLength(8)
    expect(t.ordre).toContain('d8')
  })
  it('déterministe pour un même seed', () => {
    expect(setupTour(mulberry32(7), 'normal')).toEqual(setupTour(mulberry32(7), 'normal'))
  })
  it('jamais de d4', () => {
    expect(setupTour(mulberry32(2), 'epique').ordre).not.toContain('d4')
  })
})
