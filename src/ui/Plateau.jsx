import Jauge from './Jauge.jsx'
import MetaJauge from './MetaJauge.jsx'
import { libellePhase, niveauTension, evenementTon } from './presentation.js'
import { CONFIG } from '../engine/constantes.js'

// Écran central d'ambiance. Lit UNIQUEMENT la vue publique du moteur.
// La ligne de survie est une règle publique (connue de tous).
export default function Plateau({ vue }) {
  const tension = niveauTension(vue.menaces)
  return (
    <div className="plateau" style={{ '--tension-globale': tension }}>
      <header className="plateau__entete">
        <span className="plateau__tour">Tour {vue.tour}</span>
        <span className="plateau__phase">{libellePhase(vue.phase)}</span>
      </header>

      {vue.evenement && (
        <div
          className={`plateau__evenement plateau__evenement--${evenementTon(vue.evenement.id)}`}
          data-testid="bandeau-evenement"
        >
          {vue.evenement.libelle}
        </div>
      )}

      <div className="plateau__menaces">
        {vue.menaces.map((m) => (
          <Jauge key={m.id} menace={m} />
        ))}
      </div>

      <MetaJauge integrite={vue.integrite} ligneSurvie={CONFIG.ligneSurvie} />
    </div>
  )
}
