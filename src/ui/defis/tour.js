// Générateur de consigne du défi « La Tour » (physique, dés de JDR).
// La difficulté fixe le nombre de dés et la présence/place du d8 :
//   entraînement : 5 dés, sans d8
//   normal       : 7 dés, un d8 vers la fin
//   épique        : 8 dés, un d8 placé au hasard
// d4 toujours exclu (trop instable).
const POOL = ['d20', 'd12', 'd10', 'd6'] // dés « de base » empilables (hors d8/d4)

const CONFIG = {
  entrainement: { n: 5, d8: 'aucun' },
  normal: { n: 7, d8: 'fin' },
  epique: { n: 8, d8: 'hasard' },
}

export function setupTour(rng = Math.random, difficulte = 'normal') {
  const conf = CONFIG[difficulte] ?? CONFIG.normal
  const ordre = Array.from({ length: conf.n }, () => POOL[Math.floor(rng() * POOL.length)])

  if (conf.d8 === 'fin') {
    // dernier tiers de la pile
    const tiers = Math.ceil(conf.n / 3)
    const idx = conf.n - 1 - Math.floor(rng() * tiers)
    ordre[idx] = 'd8'
  } else if (conf.d8 === 'hasard') {
    ordre[Math.floor(rng() * conf.n)] = 'd8'
  }

  return { ordre }
}
