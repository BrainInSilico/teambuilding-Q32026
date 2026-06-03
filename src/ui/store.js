// Store React : useReducer enveloppant le moteur. Le moteur reste la source de
// vérité ; le reducer ne fait que router les actions vers ses fonctions pures.
import { nouvellePartie, phaseMenace } from '../engine/index.js'

export function etatInitial(seed) {
  return nouvellePartie(seed)
}

export function reducer(etat, action) {
  switch (action.type) {
    case 'phaseMenace':
      return phaseMenace(etat)
    default:
      return etat
  }
}
