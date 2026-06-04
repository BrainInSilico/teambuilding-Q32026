// ============================================================================
//  CHIFFRAGE — placeholders à caler au RUN À BLANC.
//  Source unique de toutes les valeurs numériques du moteur.
//  Aucune valeur magique ne doit vivre ailleurs.
// ============================================================================

// Les 5 défis retenus → une menace par défi (habillage narratif posé en fin).
export const MENACES = [
  { id: 'arcade', nom: 'Surcharge', registre: 'réflexe' },
  { id: 'codename', nom: 'Brouillage', registre: 'verbal' },
  { id: 'bowling', nom: 'Instabilité', registre: 'adresse' },
  { id: 'tour', nom: 'Effondrement', registre: 'précision' },
  { id: 'crypto', nom: 'Chiffrement', registre: 'logique' },
]

export const CONFIG = {
  // Niveau de départ de chaque menace (visible). Tiré dans ce range.
  niveauDepart: { lo: 35, hi: 60 },
  // Vitesse de montée par tour (CACHÉE).
  vitesse: { lo: 8, hi: 22 },
  // Seuil de victoire-purge T (CACHÉ). Borne haute < niveau départ min
  // pour garantir aucune victoire facile d'emblée.
  seuilT: { lo: 15, hi: 30 },
  // Facteur du ralenti pendant un Répit (0.25 = monte au quart de sa vitesse).
  facteurRepit: 0.25,
  // Contagion : +X par menace saturée (à 100) appliqué aux autres en fin de tour.
  contagionParMenaceSaturee: 6,
  // Méta-jauge Intégrité système [0,100]. Démarre à 0 : le système est corrompu
  // par ARGOS au départ, l'équipe doit le RESTAURER (perks) en évitant les malus.
  integriteDepart: 0,
  integriteDeltaPerk: 5, // menace ramenée à 0
  integriteDeltaMalus: 10, // par menace saturée en fin de tour
  ligneSurvie: 50, // en fin de partie : >= ligne → survie, sinon ARGOS gagne
  // Partie élastique.
  toursMin: 4,
  toursCible: 5,
  toursMax: 6,
  // Amplitude d'un événement de type "surtension/répit" sur une jauge.
  evenementAmplitude: 12,
}

// ----------------------------------------------------------------------------
//  DECK D'ÉVÉNEMENTS — 3e pilier du brouillard.
//  Inconnu de l'organisateur (ni ordre ni contenu visibles). Tiré par le moteur.
//  Chaque effet est une fonction pure (menaces, rng, cfg) → nouvelles menaces,
//  toujours clampée par l'appelant. Majorité négatifs + quelques positifs.
// ----------------------------------------------------------------------------
const cl = (v) => Math.max(0, Math.min(100, v))

export const DECK_EVENEMENTS = [
  {
    id: 'surtension',
    libelle: 'Surtension : une menace grimpe brutalement.',
    effet: (menaces, rng, cfg) => {
      const i = Math.floor(rng() * menaces.length)
      return menaces.map((m, k) => (k === i ? { ...m, niveau: cl(m.niveau + cfg.evenementAmplitude) } : m))
    },
  },
  {
    id: 'cascade',
    libelle: 'Cascade : la menace la plus haute entraîne les autres.',
    effet: (menaces, _rng, cfg) => {
      const max = Math.max(...menaces.map((m) => m.niveau))
      return menaces.map((m) =>
        m.niveau === max ? m : { ...m, niveau: cl(m.niveau + Math.round(cfg.evenementAmplitude / 2)) },
      )
    },
  },
  {
    id: 'contagion-ciblee',
    libelle: 'Contagion ciblée : deux menaces liées montent.',
    effet: (menaces, rng, cfg) => {
      const i = Math.floor(rng() * menaces.length)
      const j = (i + 1) % menaces.length
      return menaces.map((m, k) =>
        k === i || k === j ? { ...m, niveau: cl(m.niveau + cfg.evenementAmplitude) } : m,
      )
    },
  },
  {
    id: 'mutation',
    libelle: 'Mutation : une menace accélère durablement.',
    effet: (menaces, rng, cfg) => {
      const i = Math.floor(rng() * menaces.length)
      return menaces.map((m, k) => (k === i ? { ...m, vitesse: m.vitesse + cfg.evenementAmplitude / 3 } : m))
    },
  },
  {
    id: 'repit',
    libelle: 'Répit : une menace se calme un instant.',
    effet: (menaces, rng, cfg) => {
      const i = Math.floor(rng() * menaces.length)
      return menaces.map((m, k) => (k === i ? { ...m, niveau: cl(m.niveau - cfg.evenementAmplitude) } : m))
    },
  },
]
