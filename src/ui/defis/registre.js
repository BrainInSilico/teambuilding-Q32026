// Registre des 5 défis : associe chaque menace à son défi.
// type 'manuel'  → saisie du score par l'organisateur (défis physiques, ou
//                  repli tant que le défi digital n'est pas branché).
// type 'digital' → composant jouable à l'écran qui rapporte (x, n).
// `n` = réussite maximale (sert au calcul réduction = (x/n)×100).
//
// Les composants digitaux sont injectés par leurs unités respectives via
// enregistrerDefi(). Par défaut tout est manuel → la boucle reste jouable.
const REGISTRE = {
  arcade: { titre: 'Arcade — casse-brique', type: 'manuel', n: 100, labelX: 'réussite %' },
  codename: { titre: 'Codename', type: 'manuel', n: 8, labelX: 'mots trouvés' },
  bowling: { titre: 'Bowling gobelets', type: 'manuel', n: 10, labelX: 'quilles tombées' },
  tour: { titre: 'La Tour', type: 'manuel', n: 8, labelX: 'étages tenus 5 s' },
  crypto: { titre: 'Crypto', type: 'manuel', n: 5, labelX: 'paliers résolus' },
}

export function defiPour(menaceId) {
  return REGISTRE[menaceId] ?? { titre: menaceId, type: 'manuel', n: 10, labelX: 'réussite' }
}

// Associe un composant à un défi (appelé par l'unité du défi).
//  - type 'digital'  : le composant produit un score (onTermine).
//  - type 'physique' : le composant affiche des INSTRUCTIONS (mise en place) ;
//    le score est saisi à la main. nVariable → on saisit aussi le total n.
export function enregistrerDefi(menaceId, { Composant, n, type = 'digital', nVariable = false, labelX }) {
  REGISTRE[menaceId] = {
    ...REGISTRE[menaceId],
    type,
    Composant,
    nVariable,
    ...(n ? { n } : {}),
    ...(labelX ? { labelX } : {}),
  }
}
