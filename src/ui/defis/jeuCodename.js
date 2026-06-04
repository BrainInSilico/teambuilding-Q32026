// Logique PURE du défi Codename (testable hors DOM).
// Coopératif : l'annonceur donne un indice « mot + nombre » ; les devineurs
// retournent des cartes. Un COUP finit quand ils ont trouvé le nombre annoncé
// d'alliés, ou dès qu'ils retournent un neutre. L'assassin = game over.
// Budget = (nb d'alliés − 1) coups → il FAUT des indices multi-alliés pour
// tout trouver.

export function creer(grille, coupsMod = 0) {
  const nbAllies = grille.filter((c) => c.role === 'allie').length
  return {
    grille,
    reveles: grille.map(() => false),
    nbAllies,
    coupsRestants: Math.max(1, nbAllies - 1 + coupsMod),
    nombre: null, // nombre annoncé du coup courant
    trouvesCeCoup: 0,
    trouves: 0,
    phase: 'annonce', // annonce | devine | fini
    issue: null, // gagne | perdu | assassin
  }
}

function finCoup(state) {
  const coupsRestants = state.coupsRestants - 1
  if (coupsRestants <= 0) {
    return { ...state, coupsRestants: 0, phase: 'fini', issue: state.trouves >= state.nbAllies ? 'gagne' : 'perdu' }
  }
  return { ...state, coupsRestants, phase: 'annonce', nombre: null, trouvesCeCoup: 0 }
}

export function lancer(state, nombre) {
  if (state.phase !== 'annonce') return state
  return { ...state, nombre, trouvesCeCoup: 0, phase: 'devine' }
}

export function retourner(state, i) {
  if (state.phase !== 'devine' || state.reveles[i]) return state
  const reveles = state.reveles.map((v, k) => (k === i ? true : v))
  const role = state.grille[i].role
  const base = { ...state, reveles }

  if (role === 'piege') return { ...base, phase: 'fini', issue: 'assassin' }

  if (role === 'neutre') return finCoup(base)

  // allié
  const trouves = base.trouves + 1
  const trouvesCeCoup = base.trouvesCeCoup + 1
  const avance = { ...base, trouves, trouvesCeCoup }
  if (trouves >= base.nbAllies) return { ...avance, phase: 'fini', issue: 'gagne' }
  if (trouvesCeCoup >= base.nombre) return finCoup(avance)
  return avance
}

export function passer(state) {
  if (state.phase !== 'devine') return state
  return finCoup(state)
}
