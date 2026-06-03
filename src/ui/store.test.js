import { describe, it, expect } from 'vitest'
import { reducer, etatInitial } from './store.js'

// Joue une suite d'actions depuis l'état initial.
const jouer = (...actions) => actions.reduce((e, a) => reducer(e, a), etatInitial())
const demarrer = { type: 'demarrer', seed: 42, joueurs: ['A', 'B', 'C', 'D'] }

describe('store — état initial', () => {
  it('démarre en phase setup, sans partie', () => {
    const e = etatInitial()
    expect(e.phase).toBe('setup')
    expect(e.partie).toBeNull()
  })
})

describe('store — demarrer', () => {
  it('crée la partie et applique la montée du tour 1 (phase menace)', () => {
    const e = jouer(demarrer)
    expect(e.phase).toBe('menace')
    expect(e.partie).not.toBeNull()
    expect(e.partie.tour).toBe(1)
    expect(e.joueurs).toEqual(['A', 'B', 'C', 'D'])
  })
  it('est déterministe pour un même seed', () => {
    expect(jouer(demarrer).partie).toEqual(jouer(demarrer).partie)
  })
})

describe('store — transitions de phase', () => {
  it('tour 1 : menace → assignation (pas d’événement)', () => {
    const e = jouer(demarrer, { type: 'continuer' })
    expect(e.phase).toBe('assignation')
  })

  it('validerAssignation → realisation et enregistre la répartition', () => {
    const assignation = { arcade: ['A'], codename: ['B', 'C'] }
    const e = jouer(demarrer, { type: 'continuer' }, { type: 'validerAssignation', assignation })
    expect(e.phase).toBe('realisation')
    expect(e.assignation).toEqual(assignation)
  })

  it('validerResultats applique les scores et passe à score avec des notes', () => {
    const e = jouer(
      demarrer,
      { type: 'continuer' },
      { type: 'validerAssignation', assignation: { arcade: ['A'] } },
      { type: 'validerResultats', resultats: { arcade: { x: 10, n: 10 } } },
    )
    expect(e.phase).toBe('score')
    expect(e.partie.menaces.find((m) => m.id === 'arcade').niveau).toBe(0)
    expect(e.dernierScore.find((s) => s.menaceId === 'arcade').note.toLowerCase()).toContain('éradiqué')
  })
})

describe('store — fin de tour & rejouer', () => {
  const tourComplet = (resultats = {}) => [
    { type: 'continuer' }, // menace → assignation (ou événement)
    { type: 'validerAssignation', assignation: {} },
    { type: 'validerResultats', resultats },
    { type: 'continuer' }, // score → tour suivant / fin
  ]

  it('score → continuer passe au tour suivant (montée appliquée)', () => {
    const e = jouer(demarrer, ...tourComplet())
    expect(e.partie.fini).toBe(false)
    expect(e.partie.tour).toBe(2)
    expect(e.phase).toBe('menace')
  })

  it('atteint la phase fin quand la partie se termine', () => {
    let e = jouer(demarrer)
    for (let i = 0; i < 8 && e.phase !== 'fin'; i++) {
      e = tourComplet().reduce((acc, a) => reducer(acc, a), e)
    }
    expect(e.phase).toBe('fin')
    expect(['purge', 'survie', 'argos']).toContain(e.partie.issue)
  })

  it('rejouer réinitialise en setup', () => {
    const e = reducer(jouer(demarrer), { type: 'rejouer' })
    expect(e.phase).toBe('setup')
    expect(e.partie).toBeNull()
  })

  it('action inconnue → état inchangé', () => {
    const e = jouer(demarrer)
    expect(reducer(e, { type: 'zzz' })).toBe(e)
  })
})
