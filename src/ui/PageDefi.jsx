import { useState } from 'react'
import { defiPour } from './defis/registre.js'
import { publierScore } from './pont.js'

// Page autonome d'un défi (URL #/defi/<id>), ouvrable dans un onglet du même
// appareil. Le défi se joue seul ; on garde le MEILLEUR score, puis « Reporter »
// l'envoie automatiquement à la feuille de score (écran principal) via le pont.
export default function PageDefi({ id }) {
  const defi = defiPour(id)
  const [meilleur, setMeilleur] = useState(null) // { x, n }
  const [envoye, setEnvoye] = useState(false)

  const rapporter = (x, n) => {
    const nn = n ?? defi.n
    setMeilleur((m) => (!m || x / nn > m.x / m.n ? { x, n: nn } : m))
    setEnvoye(false)
  }

  const reporter = () => {
    if (!meilleur) return
    publierScore(id, meilleur.x, meilleur.n)
    setEnvoye(true)
  }

  return (
    <div className="page-defi">
      <header className="page-defi__entete">
        <h1>{defi.titre}</h1>
        <a href="#/" className="page-defi__retour">← écran principal</a>
      </header>

      {defi.type === 'digital' ? (
        <>
          <defi.Composant onTermine={rapporter} />
          <div className="page-defi__report">
            <span>
              Score à reporter :{' '}
              <strong data-testid="score-a-reporter">
                {meilleur ? `${meilleur.x} / ${meilleur.n}` : `– / ${defi.n}`}
              </strong>
            </span>
            <button onClick={reporter} disabled={!meilleur}>
              Reporter sur la feuille de score
            </button>
            {envoye && <span className="page-defi__envoye">✓ envoyé à l’écran principal</span>}
          </div>
        </>
      ) : (
        <p>Défi physique — pas de page de jeu. Le score se saisit à la main sur l’écran principal.</p>
      )}
    </div>
  )
}
