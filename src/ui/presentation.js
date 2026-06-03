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

// Qualité d'un artefact/défi selon la réduction de menace obtenue (0→100).
// De « éradiqué » à « effort gâché ».
export function noteArtefact(reduction) {
  if (reduction >= 100) return 'Éradiqué'
  if (reduction >= 75) return 'Neutralisé'
  if (reduction >= 50) return 'Repoussé'
  if (reduction >= 25) return 'Contenu'
  if (reduction > 0) return 'À peine entamé'
  return 'Effort gâché'
}

// Phrase courte d'accompagnement du verdict (habillage ; remplacé/augmenté par
// ARGOS quand le LLM est branché).
export function phraseVerdict(reduction) {
  if (reduction >= 100) return 'Menace pulvérisée. Le système respire.'
  if (reduction >= 50) return 'Belle riposte — la pression retombe.'
  if (reduction > 0) return 'Quelques dégâts limités, mais elle tient.'
  return 'Coup dans le vide. La menace progresse.'
}
