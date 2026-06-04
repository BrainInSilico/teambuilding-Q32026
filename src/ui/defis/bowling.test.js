import { describe, it, expect } from 'vitest'
import { setupBowling, DISPOSITIONS, DISTANCES } from './bowling.js'
import { mulberry32 } from '../../engine/rng.js'

describe('setupBowling', () => {
  it('tire une disposition (avec son nombre de gobelets) et une distance valides', () => {
    const s = setupBowling(mulberry32(42))
    expect(DISPOSITIONS.some((d) => d.nom === s.disposition && d.gobelets === s.gobelets)).toBe(true)
    expect(DISTANCES).toContain(s.distance)
  })
  it('déterministe pour un même seed', () => {
    expect(setupBowling(mulberry32(7))).toEqual(setupBowling(mulberry32(7)))
  })
  it('varie selon le seed', () => {
    const a = JSON.stringify(setupBowling(mulberry32(1)))
    const b = JSON.stringify(setupBowling(mulberry32(2)))
    const c = JSON.stringify(setupBowling(mulberry32(9)))
    expect(new Set([a, b, c]).size).toBeGreaterThan(1)
  })

  it('difficulté : entraînement = peu de gobelets ; épique = 2 essais', () => {
    for (let s = 0; s < 30; s++) {
      expect(setupBowling(mulberry32(s), 'entrainement').gobelets).toBeLessThanOrEqual(9)
    }
    expect(setupBowling(mulberry32(1), 'epique').essais).toBe(2)
    expect(setupBowling(mulberry32(1), 'normal').essais).toBe(3)
    expect(setupBowling(mulberry32(1), 'entrainement').essais).toBe(3)
  })
})
