import { useState } from 'react'

// Répartit les joueurs sur les menaces. Un joueur est sur UNE seule menace à la
// fois (le re-cliquer ailleurs le déplace ; le re-cliquer au même endroit le
// retire). Plusieurs joueurs sur une menace = levier « +joueurs = +score ».
export default function Assignation({ menaces, joueurs, onValider }) {
  const [placement, setPlacement] = useState({}) // { joueur: menaceId }

  const placer = (menaceId, joueur) => {
    setPlacement((p) => {
      const suivant = { ...p }
      if (suivant[joueur] === menaceId) delete suivant[joueur]
      else suivant[joueur] = menaceId
      return suivant
    })
  }

  const carte = () => {
    const res = {}
    for (const [joueur, menaceId] of Object.entries(placement)) {
      ;(res[menaceId] ??= []).push(joueur)
    }
    return res
  }

  const nbAssignes = Object.keys(placement).length

  return (
    <div className="assignation">
      <h2>Assignation</h2>
      <p className="assignation__aide">
        Répartissez vos forces. Concentrer sur une menace = artefact plus solide, mais les autres montent.
      </p>
      {menaces.map((m) => (
        <div key={m.id} className="assignation__ligne" data-testid={`assign-${m.id}`}>
          <span className="assignation__menace">{m.nom}</span>
          <span className="assignation__joueurs">
            {joueurs.map((j) => {
              const actif = placement[j] === m.id
              return (
                <button
                  key={j}
                  className={actif ? 'pastille pastille--actif' : 'pastille'}
                  onClick={() => placer(m.id, j)}
                >
                  {j}
                </button>
              )
            })}
          </span>
        </div>
      ))}
      <div className="assignation__pied">
        <span data-testid="assign-compteur">{nbAssignes}/{joueurs.length} joueurs assignés</span>
        <button onClick={() => onValider(carte())}>Valider l’assignation</button>
      </div>
    </div>
  )
}
