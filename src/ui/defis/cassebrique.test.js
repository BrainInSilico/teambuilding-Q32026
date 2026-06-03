import { describe, it, expect } from 'vitest'
import { nouveauTerrain, pas, NB_BRIQUES } from './cassebrique.js'

// État de base modifiable pour scénariser chaque collision.
const base = (over = {}) => ({
  L: 100,
  H: 100,
  balle: { x: 50, y: 50, vx: 0, vy: -2, r: 1 },
  raquette: { x: 40, largeur: 20, y: 95 },
  briques: [],
  cassees: 0,
  perdu: false,
  ...over,
})

describe('pas — collisions', () => {
  it('rebond sur le mur gauche (vx inversé, x clampé)', () => {
    const e = pas(base({ balle: { x: 1, y: 50, vx: -3, vy: 0, r: 1 } }))
    expect(e.balle.x).toBeGreaterThanOrEqual(0)
    expect(e.balle.vx).toBeGreaterThan(0)
  })

  it('casse une brique sur la trajectoire et inverse vy', () => {
    const brique = { x: 45, y: 40, w: 10, h: 6, vivante: true }
    const e = pas(base({ balle: { x: 50, y: 47, vx: 0, vy: -3, r: 1 }, briques: [brique] }))
    expect(e.briques[0].vivante).toBe(false)
    expect(e.cassees).toBe(1)
    expect(e.balle.vy).toBeGreaterThan(0)
  })

  it('la balle qui passe sous le terrain → perdu', () => {
    const e = pas(base({ balle: { x: 10, y: 99, vx: 0, vy: 3, r: 1 }, raquette: { x: 80, largeur: 20, y: 95 } }))
    expect(e.perdu).toBe(true)
  })

  it('rebond sur la raquette (vy repart vers le haut)', () => {
    const e = pas(base({ balle: { x: 50, y: 94, vx: 0, vy: 3, r: 1 }, raquette: { x: 45, largeur: 20, y: 95 } }))
    expect(e.balle.vy).toBeLessThan(0)
    expect(e.perdu).toBe(false)
  })

  it('est pure (n’altère pas l’état d’entrée)', () => {
    const e = base({ briques: [{ x: 45, y: 40, w: 10, h: 6, vivante: true }] })
    const snap = structuredClone(e)
    pas(e)
    expect(e).toEqual(snap)
  })
})

describe('nouveauTerrain', () => {
  it('génère NB_BRIQUES briques vivantes et une balle en mouvement', () => {
    const t = nouveauTerrain()
    expect(t.briques.filter((b) => b.vivante)).toHaveLength(NB_BRIQUES)
    expect(t.balle.vy).not.toBe(0)
  })
})
