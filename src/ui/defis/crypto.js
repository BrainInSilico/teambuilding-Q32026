// Défi Crypto — généré au runtime, auto-vérifié. L'organisateur ne connaît ni
// les textes ni les méthodes (générés ici, jamais auteurés). Difficulté
// croissante pour éviter un score binaire 0/100.

const A = 'A'.charCodeAt(0)
const estLettre = (c) => c >= 'A' && c <= 'Z'

function cesar(texte, k) {
  return texte.replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - A + k) % 26 + 26) % 26 + A))
}

// Applique une méthode de chiffrement à un clair (déjà en MAJUSCULES).
export function chiffrer(clair, methode) {
  const t = clair.toUpperCase()
  switch (methode.type) {
    case 'cesar':
      return cesar(t, methode.k)
    case 'atbash':
      return t.replace(/[A-Z]/g, (c) => String.fromCharCode(A + 25 - (c.charCodeAt(0) - A)))
    case 'miroir':
      return t.split('').reverse().join('')
    case 'cesar-miroir':
      return cesar(t, methode.k).split('').reverse().join('')
    case 'vigenere': {
      const cle = methode.cle
      let j = 0
      return t.replace(/[A-Z]/g, (c) => {
        const k = cle.charCodeAt(j % cle.length) - A
        j++
        return String.fromCharCode(((c.charCodeAt(0) - A + k) % 26) + A)
      })
    }
    case 'substitution':
      return t.replace(/[A-Z]/g, (c) => methode.perm[c.charCodeAt(0) - A])
    default:
      return t
  }
}

// Normalise une saisie : MAJUSCULES, lettres seulement.
const normaliser = (s) =>
  (s ?? '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[^A-Z]/g, '')

export function verifier(saisie, clair) {
  return normaliser(saisie) === normaliser(clair) && normaliser(clair).length > 0
}

// 10 champs lexicaux UNIVERSELS (rien de culturel, aucun nom propre). Mots
// stockés en A–Z (sans accents) : le chiffre ne fuite donc aucun caractère.
export const THEMES = [
  ['GIRAFE', 'RENARD', 'TORTUE', 'BALEINE', 'MARMOTTE', 'CROCODILE', 'REQUIN', 'CRAPAUD', 'HERISSON', 'PANTHERE'],
  ['TOMATE', 'BANANE', 'CAROTTE', 'POIVRON', 'FROMAGE', 'CHOCOLAT', 'GALETTE', 'ABRICOT', 'BISCUIT', 'POIREAU'],
  ['GENOU', 'COUDE', 'TALON', 'MENTON', 'POIGNET', 'CHEVILLE', 'MOLLET', 'ORTEIL', 'GORGE', 'EPAULE'],
  ['ESCALIER', 'FAUTEUIL', 'ARMOIRE', 'PLAFOND', 'CUISINE', 'MIROIR', 'RIDEAU', 'COUSSIN', 'TIROIR', 'BALCON'],
  ['MARTEAU', 'TOURNEVIS', 'PINCEAU', 'PERCEUSE', 'BROUETTE', 'TENAILLE', 'BOULON', 'ENCLUME', 'RABOT', 'BALANCE'],
  ['MANTEAU', 'CHAUSSURE', 'PANTALON', 'CHAPEAU', 'CEINTURE', 'CHEMISE', 'BONNET', 'FOULARD', 'SANDALE', 'VESTON'],
  ['ROSEAU', 'BAMBOU', 'MUGUET', 'CHARDON', 'LIERRE', 'TULIPE', 'JONQUILLE', 'COQUELICOT', 'FOUGERE', 'PISSENLIT'],
  ['CORAIL', 'COQUILLAGE', 'ALGUE', 'RIVAGE', 'COURANT', 'GALET', 'NAGEOIRE', 'MEDUSE', 'MOUSSE', 'MAREE'],
  ['BATEAU', 'BICYCLETTE', 'CAMION', 'TRAINEAU', 'VOILIER', 'CHARRETTE', 'SCOOTER', 'TRAMWAY', 'PIROGUE', 'AVION'],
  ['NUAGE', 'ORAGE', 'TONNERRE', 'BROUILLARD', 'GIVRE', 'ECLAIR', 'AVERSE', 'BRUME', 'GRELON', 'NEIGE'],
]

export const FAMILLES = {
  cesar: 'Décalage d’alphabet (type César)',
  atbash: 'Miroir d’alphabet (A↔Z, B↔Y…)',
  miroir: 'Texte renversé',
  'cesar-miroir': 'Décalage + texte renversé',
  vigenere: 'Décalage glissant (Vigenère, clé donnée)',
  substitution: 'Substitution (chaque lettre → une autre, clé partielle)',
}

const TYPES = ['cesar', 'atbash', 'miroir', 'cesar-miroir', 'vigenere', 'substitution']
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
// Clés Vigenère courtes, universelles, sans accent ni nom propre.
const CLES = ['SEL', 'MER', 'VENT', 'NEIGE', 'SABLE', 'PIN', 'ROC', 'LUNE']

// Mélange Fisher-Yates piloté par le rng.
function melanger(arr, rng) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Tire une méthode ALÉATOIRE (type + paramètres). César ±N (sens à deviner),
// Vigenère (clé tirée), substitution (permutation aléatoire). Aucun ordre fixe :
// un joueur ne peut pas pré-construire de table valable d'un tour à l'autre.
function tirerMethode(rng) {
  const type = TYPES[Math.floor(rng() * TYPES.length)]
  if (type === 'cesar' || type === 'cesar-miroir') {
    const ampleur = 1 + Math.floor(rng() * 24)
    const signe = rng() < 0.5 ? 1 : -1
    return { type, k: signe * ampleur }
  }
  if (type === 'vigenere') return { type, cle: melanger(CLES, rng)[0] }
  if (type === 'substitution') return { type, perm: melanger(ALPHABET, rng).join('') }
  return { type }
}

// Aide spécifique à la famille (en plus du crib 1ʳᵉ lettre).
function aideMethode(methode, clair) {
  if (methode.type === 'vigenere') return `clé : ${methode.cle}`
  if (methode.type === 'substitution') {
    // Révèle quelques correspondances (chiffré → clair) tirées du mot.
    const vues = []
    for (const L of clair) {
      if (vues.length >= 3) break
      if (!vues.some((v) => v.endsWith(L))) {
        const ciph = methode.perm[L.charCodeAt(0) - A]
        vues.push(`${ciph}→${L}`)
      }
    }
    return `clé partielle : ${vues.join(' · ')}`
  }
  return ''
}

export function genererCrypto(rng, n = 5) {
  // Un seul champ lexical par partie (non précisé aux joueurs, mais signalé) :
  // une fois un mot cassé, on peut deviner le thème → aide à la déduction.
  const theme = THEMES[Math.floor(rng() * THEMES.length)]
  const mots = melanger(theme, rng).slice(0, n)
  return mots.map((clair) => {
    const methode = tirerMethode(rng)
    return {
      clair,
      chiffre: chiffrer(clair, methode),
      famille: FAMILLES[methode.type], // aide : on nomme la famille, pas la clé
      crib: clair[0], // aide : une lettre déchiffrée (point d'entrée)
      aide: aideMethode(methode, clair), // aide spécifique (clé Vigenère / clé partielle)
    }
  })
}
