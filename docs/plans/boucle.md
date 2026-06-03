# Plan: Boucle de jeu (U3)

**Spec :** [docs/specs/boucle.md](../specs/boucle.md)

### Task 1 — `noteArtefact(reduction)` (helper pur)
Libellé de qualité selon la réduction (éradiqué → effort gâché). Tests seuils.

### Task 2 — Reducer : `demarrer` + entrée de tour
`demarrer` → partie + montée tour 1, phase `menace`. Test.

### Task 3 — Reducer : transitions menace → événement → assignation
`continuer` enchaîne ; événement tiré dès tour ≥2. Tests.

### Task 4 — Reducer : `validerAssignation` + `validerResultats` + scores
Enregistre assignation, applique `appliquerScore` par menace, note par défi. Tests.

### Task 5 — Reducer : `score → finDeTour` + `rejouer`
Fin de partie ou tour suivant ; reset. Tests des 2 issues.

### Task 6 — App : routeur de phase temporaire
Affiche le Plateau + un panneau par phase (placeholders) + bouton continuer. Smoke test + build.
