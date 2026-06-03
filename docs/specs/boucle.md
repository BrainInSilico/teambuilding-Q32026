# Spec: Boucle de jeu & navigation de phases (U3)

## Objective & Success Criteria
Étendre le store (`useReducer`) pour piloter une partie complète via une machine
à phases, en appelant les fonctions du moteur (source de vérité). Remplace le
stepper debug.

**Done when:**
- Phases : `setup → menace → (evenement si tour≥2) → assignation → realisation → score → menace…` jusqu'à `fin`.
- `demarrer({seed, joueurs})` crée la partie et applique la montée du tour 1 (phase `menace`).
- `validerAssignation({assignation})` enregistre la répartition et passe à `realisation`.
- `validerResultats({resultats})` applique `appliquerScore` par menace, calcule une note par défi, passe à `score`.
- Depuis `score`, `continuer` applique `finDeTour` : si fini → `fin` ; sinon tour suivant (montée appliquée) → `menace`.
- `rejouer` réinitialise en `setup`.
- Tout testé au niveau reducer ; aucune valeur cachée exposée à l'UI.

## Stack & Commands
React + Vite, Vitest. `npm test` / `npm run build` / `npm run dev`.

## Project Structure
```
src/ui/store.js          # machine à phases + reducer (étendu)
src/ui/presentation.js   # + noteArtefact(reduction) → libellé
src/App.jsx              # routeur de phase temporaire (placeholders) + bouton continuer
```

## Code Style & Testing
Reducer pur, immutable. Le moteur reste seul à muter l'état de jeu.
- Tests reducer co-localisés `store.test.js`.

## Boundaries
- **Always :** passer par le moteur pour toute règle ; clamp dans le moteur ; commit par tâche.
- **Ask first :** changer la forme de l'état partagé une fois les écrans branchés.
- **Never :** dupliquer une règle de jeu dans le store ; exposer une valeur cachée.

## Open questions
- Montée appliquée à chaque entrée de tour (y compris tour 1) — acté, calage au run à blanc.
