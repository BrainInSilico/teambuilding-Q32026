// Générateur de consigne du défi « La Tour » (physique, dés de JDR).
// On impose un ORDRE d'empilement tiré au hasard (hors d4) → la même tour n'est
// jamais construite deux fois pareil, et l'organisateur ne sait pas d'avance.
export const DES = ['d20', 'd12', 'd10', 'd8', 'd6'] // d4 exclu (trop instable)

// Mélange Fisher-Yates piloté par le rng.
function melanger(arr, rng) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function setupTour(rng = Math.random) {
  return { ordre: melanger(DES, rng) }
}
