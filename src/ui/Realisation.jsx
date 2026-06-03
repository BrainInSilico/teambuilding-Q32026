import { useState } from 'react'

// Saisie du résultat de chaque défi (x réussite / n max). Sert aussi de mode
// MJ manuel (U9) tant que les défis digitaux (U10) ne sont pas branchés.
export default function Realisation({ menaces, assignation, onValider }) {
  const [valeurs, setValeurs] = useState(
    Object.fromEntries(menaces.map((m) => [m.id, { x: 0, n: 10 }])),
  )

  const set = (id, champ, v) =>
    setValeurs((s) => ({ ...s, [id]: { ...s[id], [champ]: Number(v) } }))

  const valider = () => {
    const resultats = {}
    for (const m of menaces) {
      const { x, n } = valeurs[m.id]
      if (n > 0) resultats[m.id] = { x, n }
    }
    onValider(resultats)
  }

  return (
    <div className="realisation">
      <h2>Réalisation — saisie des résultats</h2>
      {menaces.map((m) => (
        <div key={m.id} className="realisation__ligne">
          <span>{m.nom}</span>
          <span className="realisation__affecte">{(assignation[m.id] ?? []).join(', ')}</span>
          <label>
            réussite
            <input
              type="number"
              data-testid={`res-x-${m.id}`}
              value={valeurs[m.id].x}
              min={0}
              onChange={(e) => set(m.id, 'x', e.target.value)}
            />
          </label>
          <label>
            / max
            <input
              type="number"
              data-testid={`res-n-${m.id}`}
              value={valeurs[m.id].n}
              min={1}
              onChange={(e) => set(m.id, 'n', e.target.value)}
            />
          </label>
        </div>
      ))}
      <button onClick={valider}>Valider les résultats</button>
    </div>
  )
}
