// Store React : machine à phases pilotant une partie. Le moteur reste la
// SOURCE DE VÉRITÉ ; le reducer ne fait qu'orchestrer ses fonctions pures.
//
// Phases : setup → menace → assignation → realisation → score → menace… → fin
// L'événement (tour ≥ 2) est appliqué à l'entrée du tour et affiché dans le
// bandeau du Plateau (pas de phase dédiée — cf. anatomie du tour).
import {
  nouvellePartie,
  phaseMenace,
  appliquerEvenement,
  appliquerScore,
  finDeTour,
} from '../engine/index.js'
import { noteArtefact } from './presentation.js'

export function etatInitial() {
  return {
    phase: 'setup',
    partie: null,
    joueurs: [],
    assignation: {},
    resultats: {},
    dernierScore: [],
  }
}

// Entrée dans un tour : montée des menaces, puis événement si tour ≥ 2.
function entrerTour(partie) {
  let p = phaseMenace(partie)
  if (p.tour >= 2) p = appliquerEvenement(p)
  return p
}

export function reducer(etat, action) {
  switch (action.type) {
    case 'demarrer': {
      const partie = entrerTour(nouvellePartie(action.seed))
      return { ...etatInitial(), phase: 'menace', partie, joueurs: action.joueurs ?? [] }
    }

    case 'continuer': {
      if (etat.phase === 'menace') return { ...etat, phase: 'assignation' }
      if (etat.phase === 'score') {
        const apres = finDeTour(etat.partie)
        if (apres.fini) return { ...etat, partie: apres, phase: 'fin' }
        return {
          ...etat,
          partie: entrerTour(apres),
          phase: 'menace',
          assignation: {},
          resultats: {},
          dernierScore: [],
        }
      }
      return etat
    }

    case 'validerAssignation': {
      if (etat.phase !== 'assignation') return etat
      return { ...etat, assignation: action.assignation ?? {}, phase: 'realisation' }
    }

    case 'validerResultats': {
      if (etat.phase !== 'realisation') return etat
      const resultats = action.resultats ?? {}
      let partie = etat.partie
      const dernierScore = []
      for (const [menaceId, { x, n }] of Object.entries(resultats)) {
        const reduction = n > 0 ? (Math.max(0, Math.min(x, n)) / n) * 100 : 0
        partie = appliquerScore(partie, menaceId, x, n)
        dernierScore.push({ menaceId, x, n, reduction, note: noteArtefact(reduction) })
      }
      return { ...etat, partie, resultats, dernierScore, phase: 'score' }
    }

    case 'rejouer':
      return etatInitial()

    default:
      return etat
  }
}
