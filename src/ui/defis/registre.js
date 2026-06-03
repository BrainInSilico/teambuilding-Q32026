// Registre des 5 défis : associe chaque menace à son défi.
// type 'manuel'  → saisie du score par l'organisateur (défis physiques, ou
//                  repli tant que le défi digital n'est pas branché).
// type 'digital' → composant jouable à l'écran qui rapporte (x, n).
// `n` = réussite maximale (sert au calcul réduction = (x/n)×100).
//
// Les composants digitaux sont injectés par leurs unités respectives via
// enregistrerDefi(). Par défaut tout est manuel → la boucle reste jouable.
const REGISTRE = {
  arcade: { titre: 'Arcade — réflexe', type: 'manuel', n: 5, labelX: 'cibles touchées' },
  codename: { titre: 'Codename', type: 'manuel', n: 8, labelX: 'mots trouvés' },
  bowling: { titre: 'Bowling gobelets', type: 'manuel', n: 10, labelX: 'quilles tombées' },
  tour: { titre: 'La Tour', type: 'manuel', n: 8, labelX: 'étages tenus 5 s' },
  crypto: { titre: 'Crypto croissante', type: 'manuel', n: 5, labelX: 'paliers résolus' },
}

export function defiPour(menaceId) {
  return REGISTRE[menaceId] ?? { titre: menaceId, type: 'manuel', n: 10, labelX: 'réussite' }
}

// Bascule un défi en digital avec son composant (appelé par l'unité du défi).
export function enregistrerDefi(menaceId, { Composant, n }) {
  REGISTRE[menaceId] = { ...REGISTRE[menaceId], type: 'digital', Composant, ...(n ? { n } : {}) }
}
