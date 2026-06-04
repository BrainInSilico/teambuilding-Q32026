import { useState } from 'react'
import { defiPour } from './defis/registre.js'

// Phase réalisation : chaque menace a son défi.
//  - défi digital → se joue sur sa PAGE dédiée (#/defi/<id>, ouvrable sur un
//    autre appareil). Ici : lien d'ouverture + saisie du score reporté.
//  - défi manuel  → saisie directe du score (physique).
// Tous les défis tournent en parallèle ; on valide quand l'équipe a fini.
export default function Realisation({ menaces, assignation, onValider }) {
  // On ne traite QUE les menaces sur lesquelles l'équipe a placé des joueurs ;
  // les autres montent (pas de score à saisir).
  const menacesActives = menaces.filter((m) => (assignation[m.id] ?? []).length > 0)

  const init = Object.fromEntries(menacesActives.map((m) => [m.id, { x: 0, n: defiPour(m.id).n }]))
  const [resultats, setResultats] = useState(init)

  const poser = (id, x, n) => setResultats((r) => ({ ...r, [id]: { x, n } }))

  return (
    <div className="realisation">
      <h2>Réalisation — relevez les défis</h2>
      {menacesActives.length === 0 && (
        <p className="realisation__vide">Aucun défi relevé ce tour : ces menaces vont monter.</p>
      )}
      {menacesActives.map((m) => {
        const defi = defiPour(m.id)
        const res = resultats[m.id]
        const affecte = (assignation[m.id] ?? []).join(', ')
        return (
          <div key={m.id} className="realisation__ligne" data-testid={`defi-${m.id}`}>
            <span className="realisation__titre">
              {m.nom} — {defi.titre}
              {affecte && <em className="realisation__affecte"> ({affecte})</em>}
            </span>

            {defi.Composant && (
              <a className="realisation__lien" href={`#/defi/${m.id}`} target="_blank" rel="noreferrer">
                Ouvrir le défi ↗
              </a>
            )}

            <label className="realisation__manuel">
              {defi.labelX ?? 'score'}
              <input
                type="number"
                data-testid={`res-x-${m.id}`}
                value={res.x}
                min={0}
                onChange={(e) => poser(m.id, Number(e.target.value), res.n)}
              />
              /{' '}
              {defi.nVariable ? (
                <input
                  type="number"
                  data-testid={`res-n-${m.id}`}
                  value={res.n}
                  min={1}
                  onChange={(e) => poser(m.id, res.x, Number(e.target.value))}
                />
              ) : (
                defi.n
              )}
            </label>
          </div>
        )
      })}
      <button onClick={() => onValider(resultats)}>Valider les résultats</button>
    </div>
  )
}
