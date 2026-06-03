# Plan: Moteur de jeu ARGOS

**Spec :** [docs/specs/moteur-jeu.md](../specs/moteur-jeu.md)

Découpage en tranches comportementales. Workflow par tâche : `test-first` (red) → `slice-builder` (green) → review (re-test). Pas de checkpoint manuel — exécution autonome, validation humaine en fin de journée.

## Tasks

### Task 1 — RNG seedable
**What :** Générateur pseudo-aléatoire déterministe seedable.
**Acceptance :**
- [ ] `mulberry32(seed)` renvoie une fonction produisant des floats `[0,1)`.
- [ ] Même seed → même suite ; seeds différents → suites différentes.
- [ ] Helpers `between(rng, lo, hi)` et `clamp(v, lo, hi)` testés sur les bornes.

**Verify :** `npm test` → rng vert.
**Depends on :** none · **Files :** `rng.js`, `rng.test.js`

### Task 2 — Outillage Vitest
**What :** Câbler Vitest pour que `npm test` tourne.
**Acceptance :** vitest en devDep, script `test`=`vitest run`, un test trivial passe, exit 0.
**Verify :** `npm test` exit 0.
**Depends on :** none · **Files :** `package.json`, `vite.config.js`

### Task 3 — Constantes de chiffrage
**What :** Centraliser tout le chiffrage placeholder.
**Acceptance :** exporte 5 menaces, ranges (niveau départ, vitesse, T), X contagion, deltas Intégrité, ligne survie, tours cible/min/max ; aucune valeur magique ailleurs.
**Verify :** import sans erreur ; `npm test` vert.
**Depends on :** none · **Files :** `constantes.js`

### Task 4 — `nouvellePartie(seed)` + déterminisme
**What :** Créer l'état initial depuis un seed.
**Acceptance :** 5 menaces (niveaux dans range, vitesses+T tirés/stockés) ; même seed → état identique ; tour=1, phase=menace, Intégrité=100, fini=false.
**Verify :** `npm test` vert.
**Depends on :** T1, T3 · **Files :** `index.js`, `index.test.js`

### Task 5 — `vuePublique(etat)` anti-fuite
**What :** Sélecteur n'exposant que l'info autorisée.
**Acceptance :** renvoie tour/phase/Intégrité + par menace niveau & gelée ; ne contient jamais vitesse/seuilT/deck (test récursif) ; niveaux arrondis.
**Verify :** test anti-fuite vert.
**Depends on :** T4 · **Files :** `index.js`, `index.test.js`

### Task 6 — `phaseMenace(etat)` : montée + clamp
**What :** Montée de chaque menace selon vitesse cachée, clampée.
**Acceptance :** +vitesse (ou ralenti si Répit qui décrémente) ; jamais >100 ; fonction pure.
**Verify :** `npm test` vert + immutabilité.
**Depends on :** T4 · **Files :** `index.js`, `index.test.js`

### Task 7 — `appliquerScore(etat, menaceId, x, n)`
**What :** Réduire de `(x/n)×100`, clampée.
**Acceptance :** `max(0, niveau−réduction)` ; x=n → 0 + Répit + Intégrité+delta ; x=0 → inchangé.
**Verify :** `npm test` vert.
**Depends on :** T4 · **Files :** `index.js`, `index.test.js`

### Task 8 — `finDeTour(etat)` : malus, contagion, victoire/défaite
**What :** Résoudre fin de tour + conditions de fin.
**Acceptance :** menace à 100 → contagion (+X clampé) + Intégrité−delta ; victoire-purge si tour≥3 & toutes≤T ; tour≥cible → survie/argos selon Intégrité vs ligne sinon tour+1.
**Verify :** tests des 3 issues verts.
**Depends on :** T6, T7 · **Files :** `index.js`, `index.test.js`

### Task 9 — `appliquerEvenement(etat)` : deck caché, dès tour 2
**What :** Tirer/appliquer un événement d'un deck inconnu, à partir du tour 2.
**Acceptance :** tour 1 → rien ; tour≥2 → effet tiré via RNG appliqué clampé ; deck hors vuePublique.
**Verify :** `npm test` vert + anti-fuite deck.
**Depends on :** T5, T6 · **Files :** `index.js`, `index.test.js`, `constantes.js`

## Risks
- Pas d'optimum dominant (concentrer vs étaler) → non testable unitairement, relève du run à blanc.
- Chiffrage placeholder → tester les invariants (bornes, monotonie, issues), pas les valeurs absolues.

## Open questions
- `rejouer(seed, actions[])` : hors plan pour l'instant (déterminisme couvert par T4).
