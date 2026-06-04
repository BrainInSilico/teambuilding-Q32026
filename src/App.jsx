import { useReducer } from 'react'
import Plateau from './ui/Plateau.jsx'
import Setup from './ui/Setup.jsx'
import Assignation from './ui/Assignation.jsx'
import Realisation from './ui/Realisation.jsx'
import Score from './ui/Score.jsx'
import Fin from './ui/Fin.jsx'
import PanneauMJ from './ui/PanneauMJ.jsx'
import Fond from './ui/Fond.jsx'
import { reducer, etatInitial } from './ui/store.js'
import { vuePublique } from './engine/index.js'
import { libellePhase, niveauTension } from './ui/presentation.js'
import { IMAGES, fondPlateau } from './ui/images.js'


export default function App() {
  const [etat, dispatch] = useReducer(reducer, undefined, etatInitial)

  if (etat.phase === 'setup') {
    return (
      <>
        <Fond image={IMAGES.lethee} />
        <div className="app">
          <Setup onDemarrer={({ joueurs, seed }) => dispatch({ type: 'demarrer', seed, joueurs })} />
        </div>
      </>
    )
  }

  if (etat.phase === 'fin') {
    const vue = vuePublique(etat.partie)
    const victoire = etat.partie.issue === 'purge' || etat.partie.issue === 'survie'
    return (
      <>
        <Fond image={victoire ? IMAGES.victory : IMAGES.loss} />
        <div className="app">
          <Fin
            issue={etat.partie.issue}
            recap={{ tour: vue.tour, integrite: vue.integrite, menaces: vue.menaces }}
            onRejouer={() => dispatch({ type: 'rejouer' })}
          />
        </div>
      </>
    )
  }

  const vue = vuePublique(etat.partie)

  return (
    <div className="app">
      <Fond image={fondPlateau(niveauTension(vue.menaces))} />
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

      <PanneauMJ
        menaces={vue.menaces}
        integrite={vue.integrite}
        onAjusterMenace={(menaceId, delta) => dispatch({ type: 'mjAjusterMenace', menaceId, delta })}
        onAjusterIntegrite={(delta) => dispatch({ type: 'mjAjusterIntegrite', delta })}
      />
    </div>
  )
}
