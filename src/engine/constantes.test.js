import { describe, it, expect } from 'vitest'
import { CONFIG, MENACES } from './constantes.js'

describe('MENACES', () => {
  it('décrit exactement 5 menaces, une par défi', () => {
    expect(MENACES).toHaveLength(5)
    const ids = MENACES.map((m) => m.id)
    expect(new Set(ids).size).toBe(5)
  })
  it('chaque menace a id, nom, registre', () => {
    for (const m of MENACES) {
      expect(m).toMatchObject({
        id: expect.any(String),
        nom: expect.any(String),
        registre: expect.any(String),
      })
    }
  })
})

describe('CONFIG (chiffrage placeholder)', () => {
  it('expose les ranges et constantes attendus', () => {
    expect(CONFIG.niveauDepart.lo).toBeLessThan(CONFIG.niveauDepart.hi)
    expect(CONFIG.vitesse.lo).toBeLessThan(CONFIG.vitesse.hi)
    expect(CONFIG.seuilT.lo).toBeLessThanOrEqual(CONFIG.seuilT.hi)
    expect(CONFIG.contagionParMenaceSaturee).toBeGreaterThan(0)
    expect(CONFIG.integriteDepart).toBe(0) // le système démarre corrompu, à restaurer
    expect(CONFIG.integriteDeltaPerk).toBeGreaterThan(0)
    expect(CONFIG.integriteDeltaMalus).toBeGreaterThan(0)
    expect(CONFIG.ligneSurvie).toBeGreaterThan(0)
    expect(CONFIG.toursMin).toBeLessThanOrEqual(CONFIG.toursCible)
    expect(CONFIG.toursCible).toBeLessThanOrEqual(CONFIG.toursMax)
  })
  it('garantit aucune victoire facile : niveau de départ min > seuil T max', () => {
    expect(CONFIG.niveauDepart.lo).toBeGreaterThan(CONFIG.seuilT.hi)
  })
})
