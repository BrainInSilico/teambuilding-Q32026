import { useState } from 'react'

// Répartit les joueurs sur les menaces (enrichi en U5). Toggle par joueur/menace.
export default function Assignation({ menaces, joueurs, onValider }) {
  const [carte, setCarte] = useState({}) // { menaceId: string[] }

  const toggle = (menaceId, joueur) => {
    setCarte((c) => {
      const actuels = c[menaceId] ?? []
      const presents = actuels.includes(joueur)
      return { ...c, [menaceId]: presents ? actuels.filter((j) => j !== joueur) : [...actuels, joueur] }
    })
  }

  return (
    <div className="assignation">
      <h2>Assignation</h2>
      {menaces.map((m) => (
        <div key={m.id} className="assignation__ligne" data-testid={`assign-${m.id}`}>
          <span className="assignation__menace">{m.nom}</span>
          <span className="assignation__joueurs">
            {joueurs.map((j) => {
              const actif = (carte[m.id] ?? []).includes(j)
              return (
                <button
                  key={j}
                  className={actif ? 'pastille pastille--actif' : 'pastille'}
                  onClick={() => toggle(m.id, j)}
                >
                  {j}
                </button>
              )
            })}
          </span>
        </div>
      ))}
      <button onClick={() => onValider(carte)}>Valider l’assignation</button>
    </div>
  )
}
