// Helpers de présentation PURS — toute la logique d'affichage testable hors DOM.

// Palette d'une jauge de menace selon son niveau.
export function paletteMenace(niveau) {
  if (niveau >= 80) return 'critique'
  if (niveau >= 50) return 'tension'
  return 'calme'
}

// Tension globale ∈ [0,1] = niveau moyen normalisé. Sert au rendu d'ambiance.
export function niveauTension(menaces) {
  if (!menaces || menaces.length === 0) return 0
  const moyenne = menaces.reduce((s, m) => s + m.niveau, 0) / menaces.length
  return moyenne / 100
}

const LIBELLES_PHASE = {
  menace: 'Montée des menaces',
  assignation: 'Assignation',
  realisation: 'Réalisation',
  score: 'Score',
  evenement: 'Événement',
  fin: 'Fin de partie',
}

// Libellé FR d'une phase ; renvoie la valeur brute si inconnue.
export function libellePhase(phase) {
  return LIBELLES_PHASE[phase] ?? phase
}
