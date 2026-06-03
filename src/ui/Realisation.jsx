import { useState } from 'react'
import { defiPour } from './defis/registre.js'

// Phase réalisation : chaque menace est traitée via SON défi.
//  - défi digital  → composant jouable qui rapporte (x, n) par onTermine.
//  - défi manuel   → saisie du score par l'organisateur (physique / repli).
// Tous les défis tournent en parallèle ; on valide quand l'équipe a fini.
export default function Realisation({ menaces, assignation, onValider }) {
  const init = Object.fromEntries(menaces.map((m) => [m.id, { x: 0, n: defiPour(m.id).n }]))
  const [resultats, setResultats] = useState(init)

  const poser = (id, x, n) => setResultats((r) => ({ ...r, [id]: { x, n } }))

  return (
    <div className="realisation">
      <h2>Réalisation — relevez les défis</h2>
      {menaces.map((m) => {
        const defi = defiPour(m.id)
        const res = resultats[m.id]
        const affecte = (assignation[m.id] ?? []).join(', ')
        return (
          <div key={m.id} className="realisation__ligne" data-testid={`defi-${m.id}`}>
            <span className="realisation__titre">
              {m.nom} — {defi.titre}
              {affecte && <em className="realisation__affecte"> ({affecte})</em>}
            </span>

            {defi.type === 'digital' ? (
              <span className="realisation__digital">
                <defi.Composant menace={m} onTermine={(x, n) => poser(m.id, x, n ?? defi.n)} />
                <span className="realisation__score">{res.x}/{res.n}</span>
              </span>
            ) : (
              <label className="realisation__manuel">
                {defi.labelX}
                <input
                  type="number"
                  data-testid={`res-x-${m.id}`}
                  value={res.x}
                  min={0}
                  max={defi.n}
                  onChange={(e) => poser(m.id, Number(e.target.value), defi.n)}
                />
                / {defi.n}
              </label>
            )}
          </div>
        )
      })}
      <button onClick={() => onValider(resultats)}>Valider les résultats</button>
    </div>
  )
}
