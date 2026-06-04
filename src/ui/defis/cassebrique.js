// Défi Arcade = Casse-brique. Cœur logique PUR (collisions), testable hors DOM.
// Terrain normalisé 100×100. Balle traitée comme un point.

const L = 100
const H = 100
// Le nombre de briques est tiré au hasard à chaque partie (variété + difficulté).
const COLS_MIN = 5
const COLS_MAX = 7
const RANGS_MIN = 2
const RANGS_MAX = 4
export const MIN_BRIQUES = COLS_MIN * RANGS_MIN
export const MAX_BRIQUES = COLS_MAX * RANGS_MAX

const dansRect = (x, y, r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h

// La balle accélère à chaque brique cassée (plafonnée) → difficulté croissante.
const ACCEL = 1.06
const VITESSE_MAX = 6

// Avance d'un pas : déplacement + rebonds murs/raquette/briques. Fonction pure.
export function pas(etat) {
  const b = { ...etat.balle }
  let { cassees, perdu } = etat
  let briques = etat.briques

  b.x += b.vx
  b.y += b.vy

  // Murs latéraux + plafond.
  if (b.x <= 0) { b.x = 0; b.vx = Math.abs(b.vx) }
  if (b.x >= etat.L) { b.x = etat.L; b.vx = -Math.abs(b.vx) }
  if (b.y <= 0) { b.y = 0; b.vy = Math.abs(b.vy) }

  // Raquette (ligne basse).
  const r = etat.raquette
  if (b.vy > 0 && b.y >= r.y && b.x >= r.x && b.x <= r.x + r.largeur) {
    b.y = r.y
    b.vy = -Math.abs(b.vy)
  }

  // Sous le terrain → perdu.
  if (b.y > etat.H) perdu = true

  // Brique touchée (la première vivante contenant le point).
  const i = briques.findIndex((br) => br.vivante && dansRect(b.x, b.y, br))
  if (i !== -1) {
    briques = briques.map((br, k) => (k === i ? { ...br, vivante: false } : br))
    cassees += 1
    b.vy = -b.vy
    // Accélération plafonnée.
    const v = Math.hypot(b.vx, b.vy)
    const f = Math.min(ACCEL, VITESSE_MAX / v)
    b.vx *= f
    b.vy *= f
  }

  return { ...etat, balle: b, briques, cassees, perdu }
}

const entre = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1))

// Terrain initial : grille de briques (taille TIRÉE au hasard), balle au centre.
export function nouveauTerrain(rng = Math.random) {
  const cols = entre(rng, COLS_MIN, COLS_MAX)
  const rangs = entre(rng, RANGS_MIN, RANGS_MAX)
  const margeX = 6
  const largeurB = (L - margeX * 2) / cols
  const hauteurB = 7
  const briques = []
  for (let rang = 0; rang < rangs; rang++) {
    for (let col = 0; col < cols; col++) {
      briques.push({
        x: margeX + col * largeurB,
        y: 12 + rang * (hauteurB + 2),
        w: largeurB - 2,
        h: hauteurB,
        vivante: true,
      })
    }
  }
  return {
    L,
    H,
    balle: { x: 50, y: 70, vx: rng() < 0.5 ? -1.4 : 1.4, vy: -1.8, r: 1 },
    raquette: { x: 40, largeur: 20, y: 95 },
    briques,
    cassees: 0,
    perdu: false,
    total: briques.length,
  }
}
