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

const MOTS = ['SOLEIL', 'PLANETE', 'GALAXIE', 'COMETE', 'ORBITE', 'LUMIERE', 'ETOILE', 'NEBULEUSE']

const FAMILLES = {
  cesar: 'Décalage d’alphabet (type César)',
  atbash: 'Miroir d’alphabet (A↔Z, B↔Y…)',
  miroir: 'Texte renversé',
  'cesar-miroir': 'Décalage + texte renversé',
}

const TYPES = ['cesar', 'atbash', 'miroir', 'cesar-miroir']

// Tire une méthode ALÉATOIRE (type + paramètres). Le décalage César peut être
// positif OU négatif (sens à deviner). Aucun ordre de difficulté imposé : un
// joueur ne peut pas pré-construire de table valable d'un tour à l'autre.
function tirerMethode(rng) {
  const type = TYPES[Math.floor(rng() * TYPES.length)]
  if (type === 'cesar' || type === 'cesar-miroir') {
    const ampleur = 1 + Math.floor(rng() * 24)
    const signe = rng() < 0.5 ? 1 : -1
    return { type, k: signe * ampleur }
  }
  return { type }
}

export function genererCrypto(rng, n = 5) {
  const paliers = []
  for (let i = 0; i < n; i++) {
    const clair = MOTS[Math.floor(rng() * MOTS.length)]
    const methode = tirerMethode(rng)
    paliers.push({
      clair,
      chiffre: chiffrer(clair, methode),
      famille: FAMILLES[methode.type], // aide : on nomme la famille, pas la clé
      crib: clair[0], // aide : une lettre déchiffrée (point d'entrée)
    })
  }
  return paliers
}
