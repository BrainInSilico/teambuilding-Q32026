import { useReducer } from 'react'
import Plateau from './ui/Plateau.jsx'
import { reducer, etatInitial } from './ui/store.js'
import { vuePublique } from './engine/index.js'

// Graine fixe pour le dev ; deviendra paramétrable à l'écran Setup.
const SEED_DEV = 42

export default function App() {
  const [etat, dispatch] = useReducer(reducer, SEED_DEV, etatInitial)
  const vue = vuePublique(etat)

  return (
    <div className="app">
      <Plateau vue={vue} />
      {/* Stepper de DEBUG temporaire : sera remplacé par les vraies phases. */}
      <div className="debug-controls">
        <button onClick={() => dispatch({ type: 'phaseMenace' })}>
          ▲ Faire monter les menaces (debug)
        </button>
      </div>
    </div>
  )
}
