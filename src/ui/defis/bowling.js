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

export function setupBowling(rng = Math.random) {
  const d = DISPOSITIONS[Math.floor(rng() * DISPOSITIONS.length)]
  const distance = DISTANCES[Math.floor(rng() * DISTANCES.length)]
  return { disposition: d.nom, gobelets: d.gobelets, distance }
}
