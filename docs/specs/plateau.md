# Spec: Plateau de jeu (écran d'ambiance)

## Objective & Success Criteria
Écran central React qui affiche en temps réel l'état d'une partie lu via `vuePublique(etat)` : 5 jauges de menace, méta-jauge Intégrité système, tour/phase, bandeau d'événement. Lecture seule des données du moteur (le moteur reste la source de vérité) ; un pas de simulation minimal permet de **voir** les jauges bouger.

**Done when:**
- Le Plateau rend exactement **5 jauges** (une par menace) avec nom + niveau, largeur de barre = niveau %.
- Une jauge **change de palette** selon le niveau (calme / tension / critique) via une fonction pure testée.
- La **méta-jauge Intégrité** s'affiche avec la ligne de survie repérée.
- L'entête montre **tour** et **phase** ; un **bandeau événement** apparaît si `evenement` est non nul, rien sinon.
- Le Plateau ne consomme **que** `vuePublique` (jamais l'état brut) — aucune valeur cachée n'est lisible dans le DOM (test).
- Un store React (`useReducer` enveloppant le moteur) expose une action pour avancer la phase menace ; déclencher l'action **fait monter les jauges** (test du reducer).

## Stack & Commands
- React 18 + Vite 6, JS ESM.
- Test : **Vitest** + **@testing-library/react** + **jsdom**.
- Build : `npm run build` · Test : `npm test` · Dev : `npm run dev`

## Project Structure
```
src/engine/        # moteur (déjà livré, inchangé)
src/ui/
  presentation.js       # helpers purs (palette, tension, libellés)
  Jauge.jsx             # une jauge de menace
  MetaJauge.jsx         # Intégrité système
  Plateau.jsx           # composition, lit vuePublique
  store.js              # useReducer + actions moteur
  *.test.js(x)          # tests co-localisés
src/App.jsx        # monte le Plateau sur une partie
```

## Code Style & Testing
```jsx
// Composants présentationnels, données via props issues de vuePublique.
// Logique d'affichage extraite en fonctions pures testables.
export function paletteMenace(niveau) {
  if (niveau >= 80) return 'critique'
  if (niveau >= 50) return 'tension'
  return 'calme'
}
```
- Framework : Vitest + Testing Library (`jsdom`). Tests co-localisés.
- Couverture : helpers de présentation, reducer, et rendu (nb de jauges, anti-fuite DOM).

## Boundaries
- **Always :** lire l'état via `vuePublique` ; garder la logique d'affichage en fonctions pures ; lancer les tests avant commit ; commit atomique par tâche.
- **Ask first :** ajouter une dépendance hors testing-library/jsdom ; introduire les contrôles de jeu réels (assignation/score) — unités séparées.
- **Never :** muter l'état du moteur dans l'UI ; afficher une valeur cachée (vitesse, seuil T, deck) ; mettre de la logique de règles dans un composant.

## Open questions
- Le « pas de simulation » (stepper) est-il un bouton de debug temporaire (retiré quand les vraies phases arriveront) ? → oui par défaut.
