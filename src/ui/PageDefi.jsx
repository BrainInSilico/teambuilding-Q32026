import { useState } from 'react'
import { defiPour } from './defis/registre.js'

// Page autonome d'un défi (URL #/defi/<id>), ouvrable sur un autre appareil.
// Le défi se joue seul ; le score final est À REPORTER À LA MAIN sur l'écran
// principal (pas de synchro réseau — offline).
export default function PageDefi({ id }) {
  const defi = defiPour(id)
  const [score, setScore] = useState(null)

  return (
    <div className="page-defi">
      <header className="page-defi__entete">
        <h1>{defi.titre}</h1>
        <a href="#/" className="page-defi__retour">← écran principal</a>
      </header>

      {defi.type === 'digital' ? (
        <>
          <defi.Composant onTermine={(x, n) => setScore({ x, n: n ?? defi.n })} />
          <div className="page-defi__report">
            Score à reporter :{' '}
            <strong data-testid="score-a-reporter">
              {score ? `${score.x} / ${score.n}` : `– / ${defi.n}`}
            </strong>
          </div>
        </>
      ) : (
        <p>Défi physique — pas de page de jeu. Le score se saisit à la main sur l’écran principal.</p>
      )}
    </div>
  )
}
