// ============================================================================
//  Moteur de jeu ARGOS — API publique. SOURCE DE VÉRITÉ.
//  État immuable et SÉRIALISABLE (aucune fonction stockée) : on garde le seed
//  et le nombre de tirages déjà consommés (`etape`), et on repositionne le RNG
//  à la demande. Toute jauge est clampée dans [0,100]. Le LLM propose, le
//  moteur valide et applique.
// ============================================================================
import { mulberry32, between, clamp } from './rng.js'
import { CONFIG, MENACES, DECK_EVENEMENTS } from './constantes.js'

// Recrée un RNG positionné après `etape` tirages — garantit le déterminisme
// tout en gardant l'état sérialisable.
function rngPositionne(seed, etape) {
  const rng = mulberry32(seed)
  for (let i = 0; i < etape; i++) rng()
  return rng
}

export function nouvellePartie(seed = (Math.random() * 1e9) | 0) {
  const rng = mulberry32(seed)
  let etape = 0
  const tirer = () => {
    etape += 1
    return rng()
  }

  const menaces = MENACES.map((def) => ({
    id: def.id,
    nom: def.nom,
    registre: def.registre,
    // niveau VISIBLE
    niveau: Math.round(CONFIG.niveauDepart.lo + tirer() * (CONFIG.niveauDepart.hi - CONFIG.niveauDepart.lo)),
    // CACHÉ : vitesse de montée par tour
    vitesse: CONFIG.vitesse.lo + tirer() * (CONFIG.vitesse.hi - CONFIG.vitesse.lo),
    // compteur de répit (tours pendant lesquels la menace monte au ralenti)
    repit: 0,
  }))

  // CACHÉ : seuil de victoire-purge
  const seuilT = Math.round(CONFIG.seuilT.lo + tirer() * (CONFIG.seuilT.hi - CONFIG.seuilT.lo))

  return {
    seed,
    etape,
    tour: 1,
    phase: 'menace',
    integrite: CONFIG.integriteDepart,
    seuilT,
    menaces,
    fini: false,
    issue: null,
    evenement: null, // dernier événement joué (libellé public) ; null si aucun
  }
}

// Sélecteur public : SEULE information que l'UI a le droit de montrer.
// Filtre tout le brouillard (vitesses, seuil T, deck, seed, etape).
export function vuePublique(etat) {
  return {
    tour: etat.tour,
    phase: etat.phase,
    integrite: Math.round(etat.integrite),
    fini: etat.fini,
    issue: etat.issue,
    evenement: etat.evenement, // libellé public du dernier événement (ou null)
    menaces: etat.menaces.map((m) => ({
      id: m.id,
      nom: m.nom,
      registre: m.registre,
      niveau: Math.round(m.niveau),
      gelee: m.repit > 0,
    })),
  }
}

// Phase menace : chaque menace monte selon sa vitesse cachée, clampée à 100.
// Une menace en répit monte au ralenti et voit son compteur décrémenter.
// Fonction pure.
export function phaseMenace(etat) {
  return {
    ...etat,
    phase: 'menace',
    menaces: etat.menaces.map((m) => {
      const vitesseEffective = m.repit > 0 ? m.vitesse * CONFIG.facteurRepit : m.vitesse
      return {
        ...m,
        niveau: clamp(m.niveau + vitesseEffective, 0, 100),
        repit: Math.max(0, m.repit - 1),
      }
    }),
  }
}

// Riposte : un défi traité réduit sa menace de (x/n)×100, clampée à [0,100].
// Menace ramenée à 0 → perk : Répit (1 tour ralenti) + Intégrité augmentée.
// Fonction pure.
export function appliquerScore(etat, menaceId, x, n) {
  const reduction = (clamp(x, 0, n) / n) * 100
  let integrite = etat.integrite
  const menaces = etat.menaces.map((m) => {
    if (m.id !== menaceId) return m
    const niveau = clamp(m.niveau - reduction, 0, 100)
    if (niveau === 0 && m.niveau > 0) {
      integrite = clamp(integrite + CONFIG.integriteDeltaPerk, 0, 100)
      return { ...m, niveau, repit: 1 }
    }
    return { ...m, niveau }
  })
  return { ...etat, menaces, integrite }
}

// Fin de tour : résout les malus puis teste les conditions de fin.
//  - Malus : chaque menace saturée (≥100) → contagion (+X aux autres, clampée)
//    et −Intégrité.
//  - Victoire-purge : à partir du tour 3, si toutes ≤ T.
//  - Fin de partie (tour ≥ cible) : survie si Intégrité ≥ ligne, sinon ARGOS.
//  - Sinon : tour suivant. Aucune mort subite — la partie va jusqu'au bout.
// Fonction pure.
export function finDeTour(etat) {
  const saturees = etat.menaces.filter((m) => m.niveau >= 100).length

  let integrite = etat.integrite
  let menaces = etat.menaces
  if (saturees > 0) {
    integrite = clamp(integrite - CONFIG.integriteDeltaMalus * saturees, 0, 100)
    const contagion = CONFIG.contagionParMenaceSaturee * saturees
    menaces = etat.menaces.map((m) =>
      m.niveau >= 100 ? m : { ...m, niveau: clamp(m.niveau + contagion, 0, 100) },
    )
  }

  const base = { ...etat, menaces, integrite }

  // Victoire-purge (testée à partir du tour 3).
  if (base.tour >= 3 && menaces.every((m) => m.niveau <= base.seuilT)) {
    return { ...base, fini: true, issue: 'purge' }
  }

  // Fin de partie : la défaite/survie se lit en fin de partie sur l'Intégrité.
  if (base.tour >= CONFIG.toursCible) {
    return { ...base, fini: true, issue: integrite >= CONFIG.ligneSurvie ? 'survie' : 'argos' }
  }

  return { ...base, tour: base.tour + 1, phase: 'menace' }
}

// Événement aléatoire : 1 par tour à partir du tour 2, tiré d'un deck CACHÉ.
// Le moteur positionne le RNG (déterminisme + état sérialisable), tire un
// événement, applique son effet clampé, et expose seulement son libellé.
// Fonction pure.
export function appliquerEvenement(etat) {
  if (etat.tour < 2) return { ...etat, evenement: null }

  const rng = rngPositionne(etat.seed, etat.etape)
  let etape = etat.etape
  const tirer = () => {
    etape += 1
    return rng()
  }

  const idx = Math.floor(tirer() * DECK_EVENEMENTS.length)
  const evt = DECK_EVENEMENTS[idx]
  const menaces = evt.effet(etat.menaces, tirer, CONFIG)

  return {
    ...etat,
    etape,
    menaces,
    evenement: { id: evt.id, libelle: evt.libelle },
  }
}

export { rngPositionne, between, clamp }
