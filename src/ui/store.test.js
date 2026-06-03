import { describe, it, expect } from 'vitest'
import { reducer, etatInitial } from './store.js'

describe('store reducer', () => {
  it('etatInitial crée une partie déterministe depuis un seed', () => {
    expect(etatInitial(42)).toEqual(etatInitial(42))
  })

  it("action 'phaseMenace' fait monter les niveaux", () => {
    const avant = etatInitial(42)
    const apres = reducer(avant, { type: 'phaseMenace' })
    const sommeAvant = avant.menaces.reduce((s, m) => s + m.niveau, 0)
    const sommeApres = apres.menaces.reduce((s, m) => s + m.niveau, 0)
    expect(sommeApres).toBeGreaterThan(sommeAvant)
  })

  it('ne mute pas l’état précédent', () => {
    const avant = etatInitial(42)
    const snapshot = structuredClone(avant)
    reducer(avant, { type: 'phaseMenace' })
    expect(avant).toEqual(snapshot)
  })

  it('action inconnue → état inchangé', () => {
    const avant = etatInitial(42)
    expect(reducer(avant, { type: 'zzz' })).toBe(avant)
  })
})
