import { describe, it, expect } from 'vitest'
import { chiffrer, verifier, genererCrypto, THEMES, FAMILLES } from './crypto.js'
import { mulberry32 } from '../../engine/rng.js'

describe('chiffrer', () => {
  it('César décale les lettres (positif et négatif)', () => {
    expect(chiffrer('ABC', { type: 'cesar', k: 1 })).toBe('BCD')
    expect(chiffrer('ABC', { type: 'cesar', k: -1 })).toBe('ZAB')
  })
  it('Atbash inverse l’alphabet', () => {
    expect(chiffrer('ABC', { type: 'atbash' })).toBe('ZYX')
  })
  it('Miroir renverse le texte', () => {
    expect(chiffrer('SOLEIL', { type: 'miroir' })).toBe('LIELOS')
  })
  it('Vigenère décale selon une clé répétée', () => {
    // clé BCDE : +1 +2 +3 +4 sur AAAA
    expect(chiffrer('AAAA', { type: 'vigenere', cle: 'BCDE' })).toBe('BCDE')
  })
  it('Substitution applique la permutation fournie', () => {
    const perm = 'BCDEFGHIJKLMNOPQRSTUVWXYZA' // = César +1
    expect(chiffrer('ABC', { type: 'substitution', perm })).toBe('BCD')
  })
})

describe('familles diversifiées', () => {
  it('FAMILLES couvre César, Atbash, miroir, Vigenère et substitution', () => {
    const noms = Object.values(FAMILLES).join(' ').toLowerCase()
    expect(noms).toMatch(/césar|cesar/)
    expect(noms).toMatch(/vigen/)
    expect(noms).toMatch(/substitution/)
  })
})

describe('verifier', () => {
  it('insensible à la casse et aux espaces', () => {
    expect(verifier(' so leil ', 'SOLEIL')).toBe(true)
    expect(verifier('lune', 'SOLEIL')).toBe(false)
  })
})

describe('genererCrypto v2', () => {
  it('produit n paliers, chacun avec famille + crib (1ʳᵉ lettre du clair)', () => {
    const paliers = genererCrypto(mulberry32(42), 'normal')
    expect(paliers).toHaveLength(5)
    for (const p of paliers) {
      expect(verifier(p.clair, p.clair)).toBe(true)
      expect(typeof p.chiffre).toBe('string')
      expect(p.famille).toBeTruthy() // aide : nom de la famille
      expect(p.crib).toBe(p.clair[0]) // aide : une lettre déchiffrée
    }
  })
  it('est déterministe pour un même seed', () => {
    expect(genererCrypto(mulberry32(7), 'normal')).toEqual(genererCrypto(mulberry32(7), 'normal'))
  })
  it('les méthodes ne sont PAS en ordre croissant fixe (varient selon le seed)', () => {
    const a = genererCrypto(mulberry32(1), 'normal').map((p) => p.famille)
    const b = genererCrypto(mulberry32(99), 'normal').map((p) => p.famille)
    expect(a).not.toEqual(b) // deux seeds → séquences de familles différentes
  })

  it('au moins 10 champs lexicaux universels disponibles', () => {
    expect(THEMES.length).toBeGreaterThanOrEqual(10)
  })

  it('tous les mots d’une partie viennent du MÊME champ lexical', () => {
    const clairs = genererCrypto(mulberry32(42), 'normal').map((p) => p.clair)
    const themesContenant = THEMES.filter((t) => clairs.every((m) => t.includes(m)))
    expect(themesContenant.length).toBe(1)
  })

  it('le champ tiré varie selon le seed', () => {
    const t1 = genererCrypto(mulberry32(2), 'normal')[0].clair
    const t2 = genererCrypto(mulberry32(500), 'normal')[0].clair
    const t3 = genererCrypto(mulberry32(8), 'normal')[0].clair
    expect(new Set([t1, t2, t3]).size).toBeGreaterThan(1)
  })

  it('difficulté : entraînement = 4 énigmes simples (ni Vigenère ni substitution)', () => {
    const paliers = genererCrypto(mulberry32(42), 'entrainement')
    expect(paliers).toHaveLength(4)
    for (const p of paliers) {
      expect(p.famille.toLowerCase()).not.toMatch(/vigen|substitution/)
    }
  })

  it('difficulté : épique = 6 énigmes', () => {
    expect(genererCrypto(mulberry32(42), 'epique')).toHaveLength(6)
  })
})
