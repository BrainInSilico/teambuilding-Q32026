import { describe, it, expect } from 'vitest'
import { nouveauTerrain, pas, accelPour, MIN_BRIQUES, MAX_BRIQUES } from './cassebrique.js'
import { mulberry32 } from '../../engine/rng.js'

const base = (over = {}) => ({
  L: 100,
  H: 100,
  balle: { x: 50, y: 50, vx: 0, vy: -2, r: 1 },
  raquette: { x: 40, largeur: 20, y: 95 },
  briques: [],
  cassees: 0,
  perdu: false,
  accel: 1.06,
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

  it('la balle ACCÉLÈRE (selon etat.accel) quand elle casse une brique', () => {
    const brique = { x: 45, y: 40, w: 10, h: 6, vivante: true }
    const avant = { vx: 1, vy: -2 }
    const e = pas(base({ balle: { x: 50, y: 47, vx: avant.vx, vy: avant.vy, r: 1 }, briques: [brique], accel: 1.2 }))
    const vitesseAvant = Math.hypot(avant.vx, avant.vy)
    const vitesseApres = Math.hypot(e.balle.vx, e.balle.vy)
    expect(vitesseApres).toBeCloseTo(vitesseAvant * 1.2, 5)
  })
})

describe('accelPour — accélération selon le nombre de briques', () => {
  it('plus de briques → accélération plus douce', () => {
    expect(accelPour(10)).toBeGreaterThan(accelPour(28))
    expect(accelPour(28)).toBeGreaterThan(1)
  })
  it('nouveauTerrain stocke une accel cohérente avec son total', () => {
    const t = nouveauTerrain(mulberry32(42))
    expect(t.accel).toBeCloseTo(accelPour(t.total), 6)
  })
})

describe('nouveauTerrain — nombre de briques aléatoire', () => {
  it('génère un nombre de briques dans [MIN, MAX], toutes vivantes', () => {
    const t = nouveauTerrain(mulberry32(42))
    const vivantes = t.briques.filter((b) => b.vivante)
    expect(t.briques.length).toBe(vivantes.length)
    expect(t.briques.length).toBeGreaterThanOrEqual(MIN_BRIQUES)
    expect(t.briques.length).toBeLessThanOrEqual(MAX_BRIQUES)
  })

  it('le tirage varie selon le seed', () => {
    const a = nouveauTerrain(mulberry32(1)).briques.length
    const b = nouveauTerrain(mulberry32(50)).briques.length
    // au moins un seed parmi plusieurs donne un total différent
    const c = nouveauTerrain(mulberry32(7)).briques.length
    expect(new Set([a, b, c]).size).toBeGreaterThan(1)
  })

  it('déterministe pour un même seed', () => {
    expect(nouveauTerrain(mulberry32(3))).toEqual(nouveauTerrain(mulberry32(3)))
  })
})
