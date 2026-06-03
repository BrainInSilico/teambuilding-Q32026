# Spec: Défis v2 — corrections de conception

Issu des retours de test. 4 chantiers.

## Objective & Success Criteria

**U12 — Pages de défi dédiées (routage hash)**
- Chaque défi digital a une URL propre `#/defi/<id>`, ouvrable sur un autre appareil/onglet.
- La page de défi est **autonome** : elle génère son contenu, se joue seule, affiche le **score à reporter** (x/n).
- L'écran principal (Réalisation) : pour chaque menace, **saisie manuelle du score** + (si digital) un lien « Ouvrir le défi ↗ ». Plus de défi joué en ligne dans le panneau.
- Routage 100 % statique (hash), aucune dépendance backend.

**U13 — Arcade = Casse-brique**
- Remplace « tape la cible ». Balle + raquette + briques. Score = briques cassées / seuil.
- Pilotable clavier + souris/tactile. Cœur logique (collisions) testable hors DOM.

**U14 — Crypto v2**
- Méthode **et** paramètres **aléatoires** à chaque palier (plus d'ordre croissant). Sens du décalage aléatoire (César +n / −n).
- Aide : **nommer la famille** de chiffrement (sans la clé) + **une lettre « crib »** déjà déchiffrée.

**U15 — Codename 2 joueurs**
- Flux explicite : 1 donneur (voit les rôles) + ≥1 devineur.
- L'assignation **exige ≥2 joueurs** sur Brouillage (blocage/avertissement).

## Stack & Commands
React + Vite, Vitest + Testing Library. `npm test` / `npm run build` / `npm run dev`.

## Boundaries
- **Always :** routage hash (statique) ; cœur logique des jeux en fonctions pures testées ; commit atomique par tâche ; le défi reste « généré, jamais auteuré ».
- **Ask first :** ajouter une dépendance (router, etc.) — viser zéro.
- **Never :** révéler les paramètres cachés ; mettre une règle de jeu dans un composant de page.

## Open questions
- Report du score : manuel sur l'écran principal (acté). Pas de sync réseau (offline).
