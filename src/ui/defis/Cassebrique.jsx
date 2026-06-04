import { useEffect, useRef, useState } from 'react'
import { nouveauTerrain, pas, MAX_BRIQUES } from './cassebrique.js'
import { enregistrerDefi } from './registre.js'

// Défi Arcade = Casse-brique. La balle accélère implicitement par la densité ;
// score = briques cassées / total. Aucune « bonne réponse » détenue par le MJ.
export default function Cassebrique({ onTermine }) {
  const [etat, setEtat] = useState(nouveauTerrain)
  const etatRef = useRef(etat)
  etatRef.current = etat
  const aireRef = useRef(null)

  const fini = etat.perdu || etat.cassees >= etat.total

  // Boucle de jeu (setInterval : sûr en test, pas de rAF requis).
  useEffect(() => {
    if (fini) return
    const id = setInterval(() => setEtat((e) => pas(e)), 16)
    return () => clearInterval(id)
  }, [fini])

  // Rapporte le score à chaque évolution.
  useEffect(() => {
    onTermine(etat.cassees, MAX_BRIQUES)
  }, [etat.cassees, etat.perdu]) // eslint-disable-line react-hooks/exhaustive-deps

  // Déplacement de la raquette à la souris / au doigt.
  const bouger = (clientX) => {
    const aire = aireRef.current
    if (!aire) return
    const rect = aire.getBoundingClientRect()
    const px = ((clientX - rect.left) / rect.width) * 100
    setEtat((e) => ({
      ...e,
      raquette: { ...e.raquette, x: Math.max(0, Math.min(100 - e.raquette.largeur, px - e.raquette.largeur / 2)) },
    }))
  }

  const rejouer = () => setEtat(nouveauTerrain())

  return (
    <div className="cb">
      <div className="cb__hud">
        <span data-testid="cb-score">{etat.cassees}/{etat.total} briques · score {etat.cassees}/{MAX_BRIQUES}</span>
        {fini && <button onClick={rejouer}>Rejouer</button>}
      </div>
      <div
        className="cb__aire"
        data-testid="cb-aire"
        ref={aireRef}
        onMouseMove={(e) => bouger(e.clientX)}
        onTouchMove={(e) => bouger(e.touches[0].clientX)}
      >
        {etat.briques.map((b, i) =>
          b.vivante ? (
            <div
              key={i}
              data-testid={`cb-brique-${i}`}
              className="cb__brique"
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
            />
          ) : null,
        )}
        <div className="cb__balle" style={{ left: `${etat.balle.x}%`, top: `${etat.balle.y}%` }} />
        <div
          className="cb__raquette"
          style={{ left: `${etat.raquette.x}%`, top: `${etat.raquette.y}%`, width: `${etat.raquette.largeur}%` }}
        />
        {fini && <div className="cb__fin">{etat.perdu ? 'Balle perdue' : 'Mur détruit !'} — score {etat.cassees}/{MAX_BRIQUES}</div>}
      </div>
      <p className="cb__aide">Bougez la raquette à la souris / au doigt. Cassez un maximum de briques.</p>
    </div>
  )
}

enregistrerDefi('arcade', { Composant: Cassebrique, n: MAX_BRIQUES })
