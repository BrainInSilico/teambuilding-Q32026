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

// Échelle de difficulté croissante (1 → n).
function methodePalier(i, rng) {
  const k = 1 + Math.floor(rng() * 24)
  switch (i) {
    case 0:
      return { methode: { type: 'cesar', k: 3 }, indice: 'César : chaque lettre décalée de 3.' }
    case 1:
      return { methode: { type: 'cesar', k }, indice: 'César : décalage inconnu.' }
    case 2:
      return { methode: { type: 'atbash' }, indice: 'A↔Z, B↔Y… (miroir d’alphabet).' }
    case 3:
      return { methode: { type: 'miroir' }, indice: '' }
    default:
      return { methode: { type: 'cesar-miroir', k }, indice: '' }
  }
}

export function genererCrypto(rng, n = 5) {
  const paliers = []
  for (let i = 0; i < n; i++) {
    const clair = MOTS[Math.floor(rng() * MOTS.length)]
    const { methode, indice } = methodePalier(i, rng)
    paliers.push({ clair, chiffre: chiffrer(clair, methode), indice })
  }
  return paliers
}
