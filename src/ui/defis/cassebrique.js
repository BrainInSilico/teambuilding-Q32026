// Défi Arcade = Casse-brique. Cœur logique PUR (collisions), testable hors DOM.
// Terrain normalisé 100×100. Balle traitée comme un point.

const L = 100
const H = 100
const COLS = 6
const RANGS = 3
export const NB_BRIQUES = COLS * RANGS

const dansRect = (x, y, r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h

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
  }

  return { ...etat, balle: b, briques, cassees, perdu }
}

// Terrain initial : grille de briques en haut, balle au centre lancée vers le haut.
export function nouveauTerrain() {
  const margeX = 6
  const largeurB = (L - margeX * 2) / COLS
  const hauteurB = 7
  const briques = []
  for (let rang = 0; rang < RANGS; rang++) {
    for (let col = 0; col < COLS; col++) {
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
    balle: { x: 50, y: 70, vx: 1.4, vy: -1.8, r: 1 },
    raquette: { x: 40, largeur: 20, y: 95 },
    briques,
    cassees: 0,
    perdu: false,
  }
}
