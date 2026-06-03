import { useReducer } from 'react'
import Plateau from './ui/Plateau.jsx'
import { reducer, etatInitial } from './ui/store.js'
import { vuePublique } from './engine/index.js'

const SEED_DEV = 42

export default function App() {
  const [etat, dispatch] = useReducer(reducer, undefined, etatInitial)

  if (etat.phase === 'setup') {
    return (
      <div className="app">
        <button onClick={() => dispatch({ type: 'demarrer', seed: SEED_DEV, joueurs: ['A', 'B', 'C', 'D'] })}>
          Démarrer une partie
        </button>
      </div>
    )
  }

  const vue = vuePublique(etat.partie)
  return (
    <div className="app">
      <Plateau vue={vue} />
      {/* Routeur de phase complet en U3·T6 — pour l'instant un simple "continuer". */}
      <div className="debug-controls">
        <span>Phase : {etat.phase}</span>{' '}
        <button onClick={() => dispatch({ type: 'continuer' })}>Continuer</button>
      </div>
    </div>
  )
}
