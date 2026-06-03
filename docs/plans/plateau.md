# Plan: Plateau de jeu

**Spec :** [docs/specs/plateau.md](../specs/plateau.md)

Workflow par tâche : `test-first` (red) → `slice-builder` (green) → review → commit → MAJ Notion.

## Tasks

### Task 1 — Outillage tests UI
**What :** Câbler Testing Library + jsdom dans Vitest.
**Acceptance :** deps installées ; `vitest` en environnement `jsdom` ; un test de rendu trivial passe.
**Verify :** `npm test` vert, exit 0.
**Files :** `package.json`, `vite.config.js`, `src/ui/smoke.test.jsx`

### Task 2 — Helpers de présentation (purs)
**What :** `paletteMenace(niveau)`, `niveauTension(menaces)`, `libellePhase(phase)`.
**Acceptance :** palette calme/tension/critique aux bons seuils ; tension ∈ [0,1] croissante avec les niveaux ; libellés FR pour chaque phase.
**Verify :** `npm test` vert.
**Files :** `src/ui/presentation.js`, `presentation.test.js`

### Task 3 — Composant `Jauge`
**What :** Une jauge de menace (nom, niveau, barre, état gelé).
**Acceptance :** affiche le nom + niveau ; largeur de barre = niveau % ; classe de palette appliquée ; marque « gelée » si `gelee`.
**Verify :** `npm test` vert (RTL).
**Files :** `src/ui/Jauge.jsx`, `Jauge.test.jsx`

### Task 4 — Composant `MetaJauge` (Intégrité)
**What :** Méta-jauge Intégrité système avec ligne de survie.
**Acceptance :** affiche la valeur ; barre = valeur % ; repère visuel de la ligne de survie ; classe « danger » si < ligne.
**Verify :** `npm test` vert.
**Files :** `src/ui/MetaJauge.jsx`, `MetaJauge.test.jsx`

### Task 5 — Composant `Plateau`
**What :** Compose 5 Jauges + MetaJauge + entête (tour/phase) + bandeau événement, depuis `vuePublique`.
**Acceptance :** rend 5 jauges ; entête affiche tour & phase ; bandeau présent ssi `evenement` non nul ; aucune valeur cachée dans le DOM.
**Verify :** `npm test` vert.
**Files :** `src/ui/Plateau.jsx`, `Plateau.test.jsx`

### Task 6 — Store React + câblage App
**What :** `useReducer` enveloppant le moteur + action `phaseMenace`, monté dans App avec un stepper de debug.
**Acceptance :** reducer applique `phaseMenace` → niveaux montent ; App rend le Plateau sur une partie ; stepper déclenche la montée visible.
**Verify :** `npm test` vert (reducer) + `npm run dev` affiche le plateau.
**Files :** `src/ui/store.js`, `store.test.js`, `src/App.jsx`

### Task 7 — Ambiance graphique
**What :** CSS : palettes, transition animée des barres, montée de tension visuelle.
**Acceptance :** barres animées (transition CSS) ; palettes distinctes ; smoke render OK.
**Verify :** `npm test` vert + revue visuelle `npm run dev`.
**Files :** `src/ui/styles.css` (+ imports)

## Risks
- Tester l'animation CSS n'a pas de sens en unitaire → on teste la **classe/structure**, pas le rendu pixel.
- Anti-fuite DOM : vérifier qu'aucune clé cachée n'apparaît, même via attributs.

## Open questions
- Stepper = debug temporaire, retiré à l'arrivée des vraies phases.
