import { describe, it, expect } from 'vitest'
import {
  nouvellePartie,
  vuePublique,
  phaseMenace,
  appliquerScore,
  finDeTour,
  appliquerEvenement,
  ajusterMenace,
  ajusterIntegrite,
} from './index.js'
import { CONFIG } from './constantes.js'

// Parcours récursif : collecte toutes les clés présentes dans un objet.
function toutesLesCles(obj, acc = new Set()) {
  if (Array.isArray(obj)) {
    obj.forEach((v) => toutesLesCles(v, acc))
  } else if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      acc.add(k)
      toutesLesCles(obj[k], acc)
    }
  }
  return acc
}

describe('nouvellePartie', () => {
  it('crée 5 menaces avec niveaux dans le range de départ', () => {
    const etat = nouvellePartie(42)
    expect(etat.menaces).toHaveLength(5)
    for (const m of etat.menaces) {
      expect(m.niveau).toBeGreaterThanOrEqual(CONFIG.niveauDepart.lo)
      expect(m.niveau).toBeLessThanOrEqual(CONFIG.niveauDepart.hi)
    }
  })

  it('tire et stocke les valeurs cachées (vitesse par menace, seuil T)', () => {
    const etat = nouvellePartie(42)
    for (const m of etat.menaces) {
      expect(m.vitesse).toBeGreaterThanOrEqual(CONFIG.vitesse.lo)
      expect(m.vitesse).toBeLessThanOrEqual(CONFIG.vitesse.hi)
    }
    expect(etat.seuilT).toBeGreaterThanOrEqual(CONFIG.seuilT.lo)
    expect(etat.seuilT).toBeLessThanOrEqual(CONFIG.seuilT.hi)
  })

  it('initialise tour=1, phase=menace, Intégrité=100, fini=false', () => {
    const etat = nouvellePartie(42)
    expect(etat.tour).toBe(1)
    expect(etat.phase).toBe('menace')
    expect(etat.integrite).toBe(CONFIG.integriteDepart)
    expect(etat.fini).toBe(false)
    expect(etat.issue).toBeNull()
  })

  it('est déterministe : même seed → état strictement identique', () => {
    expect(nouvellePartie(777)).toEqual(nouvellePartie(777))
  })

  it('seeds différents → états différents', () => {
    expect(nouvellePartie(1)).not.toEqual(nouvellePartie(2))
  })
})

describe('vuePublique', () => {
  it('expose tour, phase, intégrité, et par menace niveau + gelée', () => {
    const vue = vuePublique(nouvellePartie(42))
    expect(vue.tour).toBe(1)
    expect(vue.phase).toBe('menace')
    expect(vue.integrite).toBe(CONFIG.integriteDepart)
    expect(vue.menaces).toHaveLength(5)
    for (const m of vue.menaces) {
      expect(m).toMatchObject({
        id: expect.any(String),
        nom: expect.any(String),
        niveau: expect.any(Number),
        gelee: expect.any(Boolean),
      })
    }
  })

  it('ne fait JAMAIS fuiter les valeurs cachées (vitesse, seuilT, seed, etape, repit)', () => {
    const cles = toutesLesCles(vuePublique(nouvellePartie(42)))
    for (const interdite of ['vitesse', 'seuilT', 'seed', 'etape', 'repit']) {
      expect(cles.has(interdite)).toBe(false)
    }
  })

  it('arrondit les niveaux affichés', () => {
    const vue = vuePublique(nouvellePartie(42))
    for (const m of vue.menaces) {
      expect(Number.isInteger(m.niveau)).toBe(true)
    }
  })
})

describe('phaseMenace', () => {
  it('fait monter chaque menace de sa vitesse cachée', () => {
    const avant = nouvellePartie(42)
    const apres = phaseMenace(avant)
    apres.menaces.forEach((m, i) => {
      const attendu = Math.min(100, avant.menaces[i].niveau + avant.menaces[i].vitesse)
      expect(m.niveau).toBeCloseTo(attendu, 6)
    })
  })

  it('ne dépasse jamais 100 (clamp)', () => {
    let etat = nouvellePartie(42)
    etat = { ...etat, menaces: etat.menaces.map((m) => ({ ...m, niveau: 99 })) }
    const apres = phaseMenace(etat)
    for (const m of apres.menaces) {
      expect(m.niveau).toBeLessThanOrEqual(100)
    }
  })

  it('applique le ralenti et décrémente le répit', () => {
    let etat = nouvellePartie(42)
    const m0 = etat.menaces[0]
    etat = { ...etat, menaces: etat.menaces.map((m, i) => (i === 0 ? { ...m, repit: 1 } : m)) }
    const apres = phaseMenace(etat)
    // monte au quart de sa vitesse, et repit retombe à 0
    expect(apres.menaces[0].niveau).toBeCloseTo(Math.min(100, m0.niveau + m0.vitesse * 0.25), 6)
    expect(apres.menaces[0].repit).toBe(0)
  })

  it('est pure : ne mute pas l’état d’entrée', () => {
    const avant = nouvellePartie(42)
    const snapshot = structuredClone(avant)
    phaseMenace(avant)
    expect(avant).toEqual(snapshot)
  })
})

describe('appliquerScore', () => {
  const fixerNiveau = (etat, id, niveau) => ({
    ...etat,
    menaces: etat.menaces.map((m) => (m.id === id ? { ...m, niveau } : m)),
  })

  it('réduit de (x/n)×100 clampé à 0', () => {
    let etat = fixerNiveau(nouvellePartie(42), 'arcade', 80)
    etat = appliquerScore(etat, 'arcade', 5, 10) // réduction 50
    expect(etat.menaces.find((m) => m.id === 'arcade').niveau).toBe(30)
  })

  it('x=n → menace à 0, arme un Répit et augmente l’Intégrité', () => {
    let etat = fixerNiveau(nouvellePartie(42), 'crypto', 70)
    etat = { ...etat, integrite: 80 } // sous le plafond pour observer le gain
    const integriteAvant = etat.integrite
    etat = appliquerScore(etat, 'crypto', 10, 10)
    const m = etat.menaces.find((mm) => mm.id === 'crypto')
    expect(m.niveau).toBe(0)
    expect(m.repit).toBeGreaterThan(0)
    expect(etat.integrite).toBeGreaterThan(integriteAvant)
  })

  it('x=0 → niveau inchangé', () => {
    let etat = fixerNiveau(nouvellePartie(42), 'tour', 55)
    etat = appliquerScore(etat, 'tour', 0, 10)
    expect(etat.menaces.find((m) => m.id === 'tour').niveau).toBe(55)
  })

  it('ne descend jamais sous 0', () => {
    let etat = fixerNiveau(nouvellePartie(42), 'bowling', 10)
    etat = appliquerScore(etat, 'bowling', 10, 10)
    expect(etat.menaces.find((m) => m.id === 'bowling').niveau).toBe(0)
  })

  it('est pure : ne mute pas l’état d’entrée', () => {
    const avant = nouvellePartie(42)
    const snapshot = structuredClone(avant)
    appliquerScore(avant, 'arcade', 5, 10)
    expect(avant).toEqual(snapshot)
  })
})

describe('finDeTour', () => {
  // Force tous les niveaux et le tour/seuil pour scénariser les issues.
  const scenario = (over) => {
    const base = nouvellePartie(42)
    return {
      ...base,
      ...over,
      menaces: base.menaces.map((m, i) => ({
        ...m,
        niveau: over.niveaux ? over.niveaux[i] : m.niveau,
      })),
    }
  }

  it('menace saturée (100) → contagion sur les autres + Intégrité diminuée', () => {
    const etat = scenario({ tour: 1, niveaux: [100, 40, 40, 40, 40], integrite: 100 })
    const apres = finDeTour(etat)
    expect(apres.integrite).toBeLessThan(100)
    // les non-saturées ont pris la contagion
    apres.menaces.slice(1).forEach((m) => expect(m.niveau).toBeGreaterThan(40))
  })

  it('victoire-purge : tour ≥ 3 et toutes ≤ T → fini, issue=purge', () => {
    const etat = scenario({ tour: 3, seuilT: 25, niveaux: [10, 10, 10, 10, 10] })
    const apres = finDeTour(etat)
    expect(apres.fini).toBe(true)
    expect(apres.issue).toBe('purge')
  })

  it('pas de purge avant le tour 3 même si toutes ≤ T', () => {
    const etat = scenario({ tour: 2, seuilT: 25, niveaux: [10, 10, 10, 10, 10] })
    const apres = finDeTour(etat)
    expect(apres.issue).not.toBe('purge')
    expect(apres.tour).toBe(3)
  })

  it('fin de partie (tour cible) → survie si Intégrité ≥ ligne', () => {
    const etat = scenario({ tour: 5, seuilT: 5, niveaux: [50, 50, 50, 50, 50], integrite: 80 })
    const apres = finDeTour(etat)
    expect(apres.fini).toBe(true)
    expect(apres.issue).toBe('survie')
  })

  it('fin de partie (tour cible) → argos si Intégrité < ligne', () => {
    const etat = scenario({ tour: 5, seuilT: 5, niveaux: [50, 50, 50, 50, 50], integrite: 20 })
    const apres = finDeTour(etat)
    expect(apres.fini).toBe(true)
    expect(apres.issue).toBe('argos')
  })

  it('sinon, incrémente le tour et ne termine pas', () => {
    const etat = scenario({ tour: 2, seuilT: 5, niveaux: [50, 50, 50, 50, 50] })
    const apres = finDeTour(etat)
    expect(apres.fini).toBe(false)
    expect(apres.tour).toBe(3)
  })

  it('est pure : ne mute pas l’état d’entrée', () => {
    const etat = scenario({ tour: 1, niveaux: [100, 40, 40, 40, 40] })
    const snapshot = structuredClone(etat)
    finDeTour(etat)
    expect(etat).toEqual(snapshot)
  })
})

describe('appliquerEvenement', () => {
  it('aucun événement au tour 1', () => {
    const etat = { ...nouvellePartie(42), tour: 1 }
    const apres = appliquerEvenement(etat)
    expect(apres.evenement).toBeNull()
    expect(apres.menaces).toEqual(etat.menaces)
    expect(apres.etape).toBe(etat.etape)
  })

  it('tire et applique un événement à partir du tour 2', () => {
    const etat = { ...nouvellePartie(42), tour: 2 }
    const apres = appliquerEvenement(etat)
    expect(apres.evenement).not.toBeNull()
    expect(apres.evenement.libelle).toEqual(expect.any(String))
    expect(apres.etape).toBeGreaterThan(etat.etape) // RNG consommé
  })

  it('est déterministe : même état → même événement', () => {
    const etat = { ...nouvellePartie(42), tour: 2 }
    expect(appliquerEvenement(etat)).toEqual(appliquerEvenement(etat))
  })

  it('garde toutes les jauges dans [0,100]', () => {
    for (let seed = 0; seed < 50; seed++) {
      const etat = { ...nouvellePartie(seed), tour: 2 }
      const apres = appliquerEvenement(etat)
      for (const m of apres.menaces) {
        expect(m.niveau).toBeGreaterThanOrEqual(0)
        expect(m.niveau).toBeLessThanOrEqual(100)
      }
    }
  })

  it('ne fait pas fuiter le deck via vuePublique', () => {
    const etat = appliquerEvenement({ ...nouvellePartie(42), tour: 2 })
    const vue = JSON.stringify(vuePublique(etat))
    expect(vue).not.toContain('deck')
  })

  it('est pure : ne mute pas l’état d’entrée', () => {
    const etat = { ...nouvellePartie(42), tour: 2 }
    const snapshot = structuredClone(etat)
    appliquerEvenement(etat)
    expect(etat).toEqual(snapshot)
  })
})

describe('ajusteurs MJ (safeguard)', () => {
  it('ajusterMenace applique un delta clampé [0,100]', () => {
    const e0 = nouvellePartie(42)
    const niveau0 = e0.menaces[0].niveau
    const e1 = ajusterMenace(e0, e0.menaces[0].id, +10)
    expect(e1.menaces[0].niveau).toBe(Math.min(100, niveau0 + 10))
    const e2 = ajusterMenace(e0, e0.menaces[0].id, -1000)
    expect(e2.menaces[0].niveau).toBe(0)
  })

  it('ajusterMenace est pure (pas de mutation)', () => {
    const e0 = nouvellePartie(42)
    const snap = structuredClone(e0)
    ajusterMenace(e0, e0.menaces[0].id, +5)
    expect(e0).toEqual(snap)
  })

  it('ajusterIntegrite clampe [0,100]', () => {
    const e0 = nouvellePartie(42)
    expect(ajusterIntegrite(e0, +50).integrite).toBe(100)
    expect(ajusterIntegrite(e0, -1000).integrite).toBe(0)
  })

  it('ajusterMenace ne touche pas aux valeurs cachées', () => {
    const e0 = nouvellePartie(42)
    const e1 = ajusterMenace(e0, e0.menaces[0].id, +5)
    expect(e1.menaces[0].vitesse).toBe(e0.menaces[0].vitesse)
    expect(e1.seuilT).toBe(e0.seuilT)
  })
})
