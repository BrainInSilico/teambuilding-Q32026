import { describe, it, expect } from 'vitest'
import {
  paletteMenace,
  niveauTension,
  libellePhase,
  noteArtefact,
  phraseVerdict,
  evenementTon,
} from './presentation.js'

describe('paletteMenace', () => {
  it('calme sous 50', () => {
    expect(paletteMenace(0)).toBe('calme')
    expect(paletteMenace(49)).toBe('calme')
  })
  it('tension de 50 à 79', () => {
    expect(paletteMenace(50)).toBe('tension')
    expect(paletteMenace(79)).toBe('tension')
  })
  it('critique à partir de 80', () => {
    expect(paletteMenace(80)).toBe('critique')
    expect(paletteMenace(100)).toBe('critique')
  })
})

describe('niveauTension', () => {
  it('renvoie une valeur dans [0,1]', () => {
    expect(niveauTension([{ niveau: 0 }, { niveau: 0 }])).toBeGreaterThanOrEqual(0)
    expect(niveauTension([{ niveau: 100 }, { niveau: 100 }])).toBeLessThanOrEqual(1)
  })
  it('croît avec les niveaux moyens', () => {
    const bas = niveauTension([{ niveau: 10 }, { niveau: 20 }])
    const haut = niveauTension([{ niveau: 80 }, { niveau: 90 }])
    expect(haut).toBeGreaterThan(bas)
  })
  it('0 si liste vide (pas de NaN)', () => {
    expect(niveauTension([])).toBe(0)
  })
})

describe('libellePhase', () => {
  it('donne un libellé FR pour chaque phase connue', () => {
    expect(libellePhase('menace')).toMatch(/menace/i)
    expect(libellePhase('assignation')).toMatch(/assignation/i)
    expect(libellePhase('realisation')).toMatch(/réalisation/i)
    expect(libellePhase('score')).toMatch(/score/i)
  })
  it('renvoie la phase brute si inconnue', () => {
    expect(libellePhase('???')).toBe('???')
  })
})

describe('noteArtefact', () => {
  it('réduction 100 → éradiqué', () => {
    expect(noteArtefact(100).toLowerCase()).toContain('éradiqué')
  })
  it('réduction nulle → effort gâché', () => {
    expect(noteArtefact(0).toLowerCase()).toContain('gâché')
  })
  it('réduction moyenne → libellé intermédiaire non vide', () => {
    expect(typeof noteArtefact(50)).toBe('string')
    expect(noteArtefact(50).length).toBeGreaterThan(0)
  })
})

describe('phraseVerdict', () => {
  it('renvoie une phrase non vide selon la réduction', () => {
    expect(phraseVerdict(100).length).toBeGreaterThan(0)
    expect(phraseVerdict(0).length).toBeGreaterThan(0)
  })
  it('distingue succès et échec', () => {
    expect(phraseVerdict(100)).not.toBe(phraseVerdict(0))
  })
})

describe('evenementTon', () => {
  it('repit est positif', () => {
    expect(evenementTon('repit')).toBe('positif')
  })
  it('surtension/cascade/mutation sont négatifs', () => {
    expect(evenementTon('surtension')).toBe('negatif')
    expect(evenementTon('cascade')).toBe('negatif')
    expect(evenementTon('mutation')).toBe('negatif')
  })
  it('inconnu → négatif par défaut', () => {
    expect(evenementTon('???')).toBe('negatif')
  })
})
