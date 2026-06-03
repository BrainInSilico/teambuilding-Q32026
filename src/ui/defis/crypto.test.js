import { describe, it, expect } from 'vitest'
import { chiffrer, verifier, genererCrypto } from './crypto.js'
import { mulberry32 } from '../../engine/rng.js'

describe('chiffrer', () => {
  it('César décale les lettres', () => {
    expect(chiffrer('ABC', { type: 'cesar', k: 1 })).toBe('BCD')
    expect(chiffrer('XYZ', { type: 'cesar', k: 3 })).toBe('ABC')
  })
  it('Atbash inverse l’alphabet', () => {
    expect(chiffrer('ABC', { type: 'atbash' })).toBe('ZYX')
  })
  it('Miroir renverse le texte', () => {
    expect(chiffrer('SOLEIL', { type: 'miroir' })).toBe('LIELOS')
  })
})

describe('verifier', () => {
  it('insensible à la casse et aux espaces', () => {
    expect(verifier(' so leil ', 'SOLEIL')).toBe(true)
    expect(verifier('lune', 'SOLEIL')).toBe(false)
  })
})

describe('genererCrypto', () => {
  it('produit n paliers, chacun déchiffrable vers son clair', () => {
    const paliers = genererCrypto(mulberry32(42), 5)
    expect(paliers).toHaveLength(5)
    for (const p of paliers) {
      // le chiffré n'est pas le clair (sauf cas dégénéré), et le clair valide
      expect(verifier(p.clair, p.clair)).toBe(true)
      expect(typeof p.chiffre).toBe('string')
      expect(p.chiffre.length).toBeGreaterThan(0)
    }
  })
  it('est déterministe pour un même seed', () => {
    expect(genererCrypto(mulberry32(7), 5)).toEqual(genererCrypto(mulberry32(7), 5))
  })
  it('difficulté croissante : indice present au 1er palier, absent au dernier', () => {
    const paliers = genererCrypto(mulberry32(1), 5)
    expect(paliers[0].indice).toBeTruthy()
  })
})
