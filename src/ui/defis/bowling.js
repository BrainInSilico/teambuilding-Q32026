// Générateur de mise en place du défi Bowling-gobelets (physique). Tire au
// hasard une disposition (et donc le nombre de gobelets) + une distance de tir.
// L'organisateur ne choisit rien → pas de « meilleure stratégie » connue.
export const DISPOSITIONS = [
  { nom: 'Pyramide à 3 étages', gobelets: 6 },
  { nom: 'Pyramide à 4 étages', gobelets: 10 },
  { nom: 'Mur 3 × 3', gobelets: 9 },
  { nom: 'Mur 4 × 3', gobelets: 12 },
  { nom: 'Losange', gobelets: 13 },
]
export const DISTANCES = ['2 m', '2,5 m', '3 m']

// Difficulté : entraînement = petites figures (≤ 9 gobelets) ; épique = 2 essais.
export function setupBowling(rng = Math.random, difficulte = 'normal') {
  const pool = difficulte === 'entrainement' ? DISPOSITIONS.filter((d) => d.gobelets <= 9) : DISPOSITIONS
  const d = pool[Math.floor(rng() * pool.length)]
  const distance = DISTANCES[Math.floor(rng() * DISTANCES.length)]
  const essais = difficulte === 'epique' ? 2 : 3
  return { disposition: d.nom, gobelets: d.gobelets, distance, essais }
}
