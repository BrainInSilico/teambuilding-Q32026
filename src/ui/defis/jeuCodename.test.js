import { describe, it, expect } from 'vitest'
import { creer, lancer, retourner, passer } from './jeuCodename.js'

// Grille de test : indices 0..3 = alliés, 4 = assassin, 5.. = neutres.
const grille = [
  { mot: 'A1', role: 'allie' },
  { mot: 'A2', role: 'allie' },
  { mot: 'A3', role: 'allie' },
  { mot: 'A4', role: 'allie' },
  { mot: 'ASSASSIN', role: 'piege' },
  { mot: 'N1', role: 'neutre' },
  { mot: 'N2', role: 'neutre' },
]

describe('jeuCodename', () => {
  it('creer : budget = alliés − 1, phase annonce', () => {
    const e = creer(grille)
    expect(e.nbAllies).toBe(4)
    expect(e.coupsRestants).toBe(3) // 4 − 1
    expect(e.phase).toBe('annonce')
  })

  it('creer accepte un modificateur de coups (ex. −1 en épique)', () => {
    expect(creer(grille, -1).coupsRestants).toBe(2) // 4 − 1 − 1
  })

  it('lancer un indice → phase devine avec le nombre annoncé', () => {
    const e = lancer(creer(grille), 2)
    expect(e.phase).toBe('devine')
    expect(e.nombre).toBe(2)
  })

  it('trouver le nombre annoncé d’alliés clôt le coup (retour annonce, budget −1)', () => {
    let e = lancer(creer(grille), 2)
    e = retourner(e, 0) // allié 1/2
    expect(e.phase).toBe('devine')
    e = retourner(e, 1) // allié 2/2 → coup fini
    expect(e.phase).toBe('annonce')
    expect(e.trouves).toBe(2)
    expect(e.coupsRestants).toBe(2)
  })

  it('retourner un neutre clôt le coup', () => {
    let e = lancer(creer(grille), 2)
    e = retourner(e, 5) // neutre
    expect(e.phase).toBe('annonce')
    expect(e.coupsRestants).toBe(2)
  })

  it('retourner l’assassin = game over', () => {
    let e = lancer(creer(grille), 2)
    e = retourner(e, 4)
    expect(e.phase).toBe('fini')
    expect(e.issue).toBe('assassin')
  })

  it('trouver tous les alliés = gagné (ex. un coup à 2 puis un coup à 2)', () => {
    let e = creer(grille)
    e = lancer(e, 2)
    e = retourner(e, 0)
    e = retourner(e, 1) // 2 trouvés, coup fini
    e = lancer(e, 2)
    e = retourner(e, 2)
    e = retourner(e, 3) // 4 trouvés = tous
    expect(e.phase).toBe('fini')
    expect(e.issue).toBe('gagne')
    expect(e.trouves).toBe(4)
  })

  it('à court de coups sans tout trouver → fini (perdu)', () => {
    let e = creer(grille) // 3 coups
    // 3 coups d’1 allié chacun → 3 alliés, budget épuisé, il en manque 1
    for (const i of [0, 1, 2]) {
      e = lancer(e, 1)
      e = retourner(e, i)
    }
    expect(e.phase).toBe('fini')
    expect(e.issue).toBe('perdu')
    expect(e.trouves).toBe(3)
  })

  it('passer clôt le coup volontairement', () => {
    let e = lancer(creer(grille), 3)
    e = retourner(e, 0)
    e = passer(e)
    expect(e.phase).toBe('annonce')
    expect(e.coupsRestants).toBe(2)
  })
})
