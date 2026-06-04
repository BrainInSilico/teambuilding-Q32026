// Défi Codename-like — grille de mots générée. Un joueur voit les rôles et
// donne des indices ; les autres devinent. Score = alliés trouvés.
// Contenu généré (jamais auteuré par l'organisateur).

// Grand pool de mots COMMUNS et variés (volontairement non thématique : on
// tire 25 cartes au hasard pour éviter que les mots soient tous proches).
// Mots universels, aucun nom propre.
export const POOL_MOTS = [
  'CHAISE', 'TABLE', 'LIVRE', 'ROUTE', 'PONT', 'MONTAGNE', 'RIVIÈRE', 'FORÊT',
  'JARDIN', 'MAISON', 'VOITURE', 'VÉLO', 'TRAIN', 'AVION', 'BATEAU', 'SOLEIL',
  'LUNE', 'ÉTOILE', 'NUAGE', 'PLUIE', 'NEIGE', 'VENT', 'FEU', 'GLACE',
  'PIERRE', 'SABLE', 'MÉTAL', 'VERRE', 'PAPIER', 'BOIS', 'FLEUR', 'ARBRE',
  'FEUILLE', 'FRUIT', 'POMME', 'PAIN', 'SUCRE', 'SEL', 'LAIT', 'CAFÉ',
  'MIEL', 'ŒUF', 'POISSON', 'OISEAU', 'CHAT', 'CHIEN', 'CHEVAL', 'ABEILLE',
  'ARAIGNÉE', 'SERPENT', 'LION', 'OURS', 'LOUP', 'SOURIS', 'LAPIN', 'MAIN',
  'PIED', 'TÊTE', 'CŒUR', 'DENT', 'PORTE', 'FENÊTRE', 'MUR', 'TOIT',
  'CLÉ', 'LAMPE', 'HORLOGE', 'MIROIR', 'LIT', 'MUSIQUE', 'DANSE', 'COULEUR',
  'OMBRE', 'LUMIÈRE', 'BRUIT', 'RÊVE', 'MOT', 'NOMBRE', 'CERCLE', 'CARRÉ',
  'ROUE', 'CORDE', 'AIGUILLE', 'CISEAUX', 'MARTEAU', 'COUTEAU', 'ASSIETTE', 'BOUTEILLE',
  'PANIER', 'SAC', 'BOÎTE', 'CHAPEAU', 'GANT', 'MANTEAU', 'BOUTON', 'MONTRE',
  'BAGUE', 'OR', 'ARGENT', 'TOUR', 'CHÂTEAU', 'ÉCHELLE', 'BALLON', 'TAMBOUR',
]
const MOTS = POOL_MOTS

// Mélange de Fisher-Yates piloté par le rng.
function melanger(arr, rng) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function genererGrille(rng, { taille = 25, nbAllies = 8, nbPieges = 1 } = {}) {
  const mots = melanger(MOTS, rng).slice(0, taille)
  const roles = [
    ...Array(nbAllies).fill('allie'),
    ...Array(nbPieges).fill('piege'),
    ...Array(Math.max(0, taille - nbAllies - nbPieges)).fill('neutre'),
  ]
  const rolesMelanges = melanger(roles, rng)
  return mots.map((mot, i) => ({ mot, role: rolesMelanges[i] }))
}
