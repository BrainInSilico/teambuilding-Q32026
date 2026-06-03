# Spec: Moteur de jeu ARGOS

## Objective & Success Criteria
Module JS pur (sans React/DOM) qui tient l'état déterministe d'une partie coopérative à 4 joueurs : 5 menaces, tours, Intégrité système. Il fait **autorité** (tire et cache les paramètres, clampe toute valeur) et reste 100% fonctionnel LLM débranché.

**Done when:**
- `nouvellePartie(seed)` → deux appels avec le **même seed** produisent un état **strictement identique** (déterminisme).
- `vuePublique(etat)` n'expose **jamais** : vitesses de montée, seuil T, contenu/ordre du deck d'événements (test qui échoue si une clé cachée fuit).
- Les 5 menaces sont des jauges **toujours dans `[0,100]`** après n'importe quelle opération (montée, score, contagion).
- `appliquerScore` réduit de `(x/n)×100` puis clampe à `max(0, niveau−réduction)` ; `x=n` → menace à 0.
- Menace ramenée à 0 → **Répit** (1 tour ralenti) + Intégrité augmentée. Menace à 100 en fin de tour → **contagion** sur les autres + Intégrité diminuée.
- **Victoire-purge** détectée seulement à partir du tour 3 quand `toutes ≤ T`. **Fin de partie** (tour ≥ cible) → issue `survie` si Intégrité ≥ ligne, sinon `argos`. Aucune mort subite.
- Partie **élastique** : se résout proprement à n'importe quel tour entre 4 et 6.
- Tout le chiffrage vit dans **un seul fichier de constantes** nommées.

## Stack & Commands
- Langage : JavaScript (ES modules), Node 26, navigateur moderne.
- Framework : React + Vite (UI hors périmètre ici) — `vite@^6`.
- Test : **Vitest** (`vitest@^2`).
- Build : `npm run build` · Test : `npm test` (= `vitest run`) · Dev : `npm run dev`

## Project Structure
```
src/engine/
  index.js        # API publique : nouvellePartie, phaseMenace, appliquerScore, finDeTour, appliquerEvenement, vuePublique
  rng.js          # mulberry32 seedable
  constantes.js   # TOUT le chiffrage (placeholders à caler au run à blanc)
  *.test.js       # tests Vitest co-localisés
```
État = objet **immuable** sérialisable ; chaque fonction prend un état et en renvoie un nouveau. Valeurs cachées dans l'objet, filtrées par `vuePublique()`.

## Code Style & Testing
```js
// Fonctions pures, état immuable, clamp systématique.
export function appliquerScore(etat, menaceId, x, n) {
  const reduction = (clamp(x, 0, n) / n) * 100
  return majMenace(etat, menaceId, (m) => ({ ...m, niveau: clamp(m.niveau - reduction, 0, 100) }))
}
```
- Framework : Vitest. Tests co-localisés `src/engine/<module>.test.js`.
- Couverture : **toute logique de moteur** + chaque condition victoire/défaite + le test anti-fuite de `vuePublique`.

## Boundaries
- **Always :** clamp toute jauge à `[0,100]` ; garder les valeurs cachées hors de `vuePublique` ; lancer les tests avant de commit ; chiffrage uniquement dans `constantes.js`.
- **Ask first :** ajouter une dépendance ; figer des valeurs de chiffrage « définitives » ; toucher à la forme de l'état une fois l'UI branchée.
- **Never :** faire gouverner l'état par le LLM ; mettre du React/DOM dans `src/engine/` ; exposer un fichier de config lisible contenant les vitesses/T.

## Open questions
- Valeurs de chiffrage : placeholders, calées au **run à blanc**.
- `rejouer(seed, actions[])` : à décider (maintenant ou plus tard).
