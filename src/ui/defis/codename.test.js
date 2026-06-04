import { describe, it, expect } from 'vitest'
import { genererGrille, POOL_MOTS } from './codename.js'
import { mulberry32 } from '../../engine/rng.js'

describe('genererGrille', () => {
  it('produit 25 cases avec le bon nombre de rôles', () => {
    const g = genererGrille(mulberry32(42), { taille: 25, nbAllies: 8, nbPieges: 1 })
    expect(g).toHaveLength(25)
    expect(g.filter((c) => c.role === 'allie')).toHaveLength(8)
    expect(g.filter((c) => c.role === 'piege')).toHaveLength(1)
    expect(g.filter((c) => c.role === 'neutre')).toHaveLength(16)
  })
  it('mots uniques sur les 25 cases', () => {
    const g = genererGrille(mulberry32(7), { taille: 25, nbAllies: 8, nbPieges: 1 })
    expect(new Set(g.map((c) => c.mot)).size).toBe(25)
  })
  it('grand pool de mots communs (≥ 60) pour de la variété non thématique', () => {
    expect(POOL_MOTS.length).toBeGreaterThanOrEqual(60)
    expect(new Set(POOL_MOTS).size).toBe(POOL_MOTS.length) // pas de doublon
  })
  it('déterministe pour un même seed', () => {
    expect(genererGrille(mulberry32(3), {})).toEqual(genererGrille(mulberry32(3), {}))
  })
})
