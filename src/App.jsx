import { useReducer } from 'react'
import Plateau from './ui/Plateau.jsx'
import Setup from './ui/Setup.jsx'
import Assignation from './ui/Assignation.jsx'
import Realisation from './ui/Realisation.jsx'
import Score from './ui/Score.jsx'
import Fin from './ui/Fin.jsx'
import { reducer, etatInitial } from './ui/store.js'
import { vuePublique } from './engine/index.js'
import { libellePhase } from './ui/presentation.js'


export default function App() {
  const [etat, dispatch] = useReducer(reducer, undefined, etatInitial)

  if (etat.phase === 'setup') {
    return (
      <div className="app">
        <Setup onDemarrer={({ joueurs, seed }) => dispatch({ type: 'demarrer', seed, joueurs })} />
      </div>
    )
  }

  if (etat.phase === 'fin') {
    return (
      <div className="app">
        <Fin issue={etat.partie.issue} onRejouer={() => dispatch({ type: 'rejouer' })} />
      </div>
    )
  }

  const vue = vuePublique(etat.partie)

  return (
    <div className="app">
      <Plateau vue={vue} />

      <div className="phase-statut">
        <span className="phase-statut__libelle">{libellePhase(etat.phase)}</span>
        <span className="phase-statut__cle">Phase : {etat.phase}</span>
      </div>

      {etat.phase === 'menace' && (
        <div className="panneau">
          <button onClick={() => dispatch({ type: 'continuer' })}>Continuer</button>
        </div>
      )}

      {etat.phase === 'assignation' && (
        <Assignation
          menaces={vue.menaces}
          joueurs={etat.joueurs}
          onValider={(assignation) => dispatch({ type: 'validerAssignation', assignation })}
        />
      )}

      {etat.phase === 'realisation' && (
        <Realisation
          menaces={vue.menaces}
          assignation={etat.assignation}
          onValider={(resultats) => dispatch({ type: 'validerResultats', resultats })}
        />
      )}

      {etat.phase === 'score' && (
        <Score dernierScore={etat.dernierScore} onContinuer={() => dispatch({ type: 'continuer' })} />
      )}
    </div>
  )
}
