// Pont entre onglets du MÊME appareil (BroadcastChannel) : une page de défi
// publie son score, la feuille de score (écran principal) le reçoit et se
// remplit automatiquement. 100 % offline, même origine. Dégrade en no-op si
// BroadcastChannel est indisponible (la saisie manuelle reste possible).
const NOM = 'argos-defis'
const dispo = () => typeof BroadcastChannel !== 'undefined'

export function publierScore(menaceId, x, n) {
  if (!dispo()) return false
  const c = new BroadcastChannel(NOM)
  c.postMessage({ type: 'score', menaceId, x, n })
  c.close()
  return true
}

export function ecouterScores(callback) {
  if (!dispo()) return () => {}
  const c = new BroadcastChannel(NOM)
  c.onmessage = (e) => {
    if (e.data && e.data.type === 'score') callback(e.data)
  }
  return () => c.close()
}
