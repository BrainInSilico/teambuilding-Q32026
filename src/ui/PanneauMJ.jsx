import { useState } from 'react'

// Panneau MJ / safeguard : l'organisateur corrige l'état VISIBLE à la main.
// Replié par défaut (on n'y touche qu'en repli ou pour ajuster). Ne révèle
// aucune valeur cachée — seulement les niveaux et l'Intégrité.
const DELTAS = [-10, -5, +5, +10]
const fmt = (d) => (d < 0 ? `−${Math.abs(d)}` : `+${d}`)

export default function PanneauMJ({ menaces, integrite, onAjusterMenace, onAjusterIntegrite }) {
  const [ouvert, setOuvert] = useState(false)

  return (
    <div className="mj">
      <button className="mj__bascule" onClick={() => setOuvert((o) => !o)}>
        ⚙ Mode MJ {ouvert ? '▲' : '▼'}
      </button>

      {ouvert && (
        <div className="mj__corps" data-testid="mj-corps">
          <p className="mj__aide">Correction manuelle (repli sans LLM). Aucun paramètre caché n’est révélé.</p>

          {menaces.map((m) => (
            <div key={m.id} className="mj__ligne" data-testid={`mj-menace-${m.id}`}>
              <span className="mj__nom">{m.nom} ({m.niveau})</span>
              <span className="mj__boutons">
                {DELTAS.map((d) => (
                  <button key={d} onClick={() => onAjusterMenace(m.id, d)}>{fmt(d)}</button>
                ))}
              </span>
            </div>
          ))}

          <div className="mj__ligne" data-testid="mj-integrite">
            <span className="mj__nom">Intégrité ({integrite})</span>
            <span className="mj__boutons">
              {DELTAS.map((d) => (
                <button key={d} onClick={() => onAjusterIntegrite(d)}>{fmt(d)}</button>
              ))}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
