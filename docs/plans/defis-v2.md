# Plan: Défis v2

**Spec :** [docs/specs/defis-v2.md](../specs/defis-v2.md)

Workflow par tâche : test-first (red) → slice-builder (green) → review → commit → MAJ Notion.

## U12 — Pages de défi dédiées (routage hash)
- **T1** `parseRoute(hash)` + hook `useHashRoute` (purs/testés).
- **T2** `PageDefi` : rend le défi du registre en plein écran + score à reporter.
- **T3** `Root` routeur (App vs PageDefi) câblé dans main.jsx.
- **T4** Realisation v3 : saisie manuelle pour tous + lien « Ouvrir le défi ↗ » pour les digitaux.

## U13 — Arcade Casse-brique
- **T1** Cœur pur : état (balle, raquette, briques), `pas()` (avance + collisions), score. Tests.
- **T2** Composant `Cassebrique` : boucle d'animation + contrôles, rapporte (x, n). Smoke.

## U14 — Crypto v2
- **T1** `genererCrypto` v2 : méthode+params aléatoires par palier, sens du décalage random, crib + famille. Tests (aléatoire, pas d'ordre, crib cohérent).
- **T2** Composant Crypto : afficher famille + crib. Ajuster tests composant.

## U15 — Codename 2 joueurs
- **T1** Flux donneur/devineur dans le composant (bascule de rôle claire). Tests.
- **T2** Assignation : exiger ≥2 joueurs sur Brouillage (blocage + message). Tests.

## Risks
- Tester une boucle d'animation : tester le cœur pur (`pas()`), pas le rAF.
- Routage hash + target=_blank : vérifier en aperçu.
