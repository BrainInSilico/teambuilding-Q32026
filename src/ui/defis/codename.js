// Défi Codename-like — grille de mots générée. Un joueur voit les rôles et
// donne des indices ; les autres devinent. Score = alliés trouvés.
// Contenu généré (jamais auteuré par l'organisateur).

const MOTS = [
  'ÉTOILE', 'COMÈTE', 'ROBOT', 'VIRUS', 'CODE', 'NUIT', 'MIROIR', 'ORAGE',
  'PHARE', 'RÉSEAU', 'ÉCLAIR', 'SIGNAL', 'OMBRE', 'PORTE', 'CLÉ', 'NOYAU',
  'PRISME', 'FUSÉE', 'TITAN', 'ÉCHO',
]

// Mélange de Fisher-Yates piloté par le rng.
function melanger(arr, rng) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function genererGrille(rng, { taille = 9, nbAllies = 5, nbPieges = 1 } = {}) {
  const mots = melanger(MOTS, rng).slice(0, taille)
  const roles = [
    ...Array(nbAllies).fill('allie'),
    ...Array(nbPieges).fill('piege'),
    ...Array(Math.max(0, taille - nbAllies - nbPieges)).fill('neutre'),
  ]
  const rolesMelanges = melanger(roles, rng)
  return mots.map((mot, i) => ({ mot, role: rolesMelanges[i] }))
}
