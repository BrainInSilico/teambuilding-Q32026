import { describe, it, expect } from 'vitest'
import { genererGrille } from './codename.js'
import { mulberry32 } from '../../engine/rng.js'

describe('genererGrille', () => {
  it('produit `taille` cases avec le bon nombre de rôles', () => {
    const g = genererGrille(mulberry32(42), { taille: 9, nbAllies: 5, nbPieges: 1 })
    expect(g).toHaveLength(9)
    expect(g.filter((c) => c.role === 'allie')).toHaveLength(5)
    expect(g.filter((c) => c.role === 'piege')).toHaveLength(1)
    expect(g.filter((c) => c.role === 'neutre')).toHaveLength(3)
  })
  it('mots uniques', () => {
    const g = genererGrille(mulberry32(7), { taille: 9, nbAllies: 5, nbPieges: 1 })
    expect(new Set(g.map((c) => c.mot)).size).toBe(9)
  })
  it('déterministe pour un même seed', () => {
    expect(genererGrille(mulberry32(3), {})).toEqual(genererGrille(mulberry32(3), {}))
  })
})
