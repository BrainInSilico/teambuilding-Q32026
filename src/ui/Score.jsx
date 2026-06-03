import { phraseVerdict } from './presentation.js'

// Verdict du tour : une carte par défi (note + phrase + barre de réduction).
// Jugement instantané et lisible (le LLM, branché plus tard, ne fait qu'habiller).
export default function Score({ dernierScore, onContinuer }) {
  return (
    <div className="score">
      <h2>Verdict</h2>
      {dernierScore.length === 0 && <p>Aucun défi relevé ce tour.</p>}
      <div className="score__cartes">
        {dernierScore.map((s) => (
          <div key={s.menaceId} className="score__carte" data-testid={`verdict-${s.menaceId}`}>
            <div className="score__entete">
              <span className="score__nom">{s.nom}</span>
              <span className="score__note">{s.note}</span>
            </div>
            <div className="score__piste">
              <div
                className="score__reduction"
                data-testid={`reduction-${s.menaceId}`}
                style={{ width: `${Math.round(s.reduction)}%` }}
              />
            </div>
            <p className="score__phrase">
              {phraseVerdict(s.reduction)} <span className="score__chiffre">({s.x}/{s.n}, −{Math.round(s.reduction)})</span>
            </p>
          </div>
        ))}
      </div>
      <button onClick={onContinuer}>Continuer</button>
    </div>
  )
}
