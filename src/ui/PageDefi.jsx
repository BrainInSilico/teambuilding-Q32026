import { useState } from 'react'
import { defiPour } from './defis/registre.js'
import Fond from './Fond.jsx'
import { IMAGES } from './images.js'

// Page autonome d'un défi (URL #/defi/<id>), jouable sur l'appareil du joueur.
// On garde le MEILLEUR score et on l'affiche EN GRAND : le joueur l'annonce à
// l'organisateur, qui le saisit sur la feuille de score (report manuel).
export default function PageDefi({ id }) {
  const defi = defiPour(id)
  const [meilleur, setMeilleur] = useState(null) // { x, n }

  const rapporter = (x, n) => {
    const nn = n ?? defi.n
    setMeilleur((m) => (!m || x / nn > m.x / m.n ? { x, n: nn } : m))
  }

  return (
    <div className="page-defi">
      <Fond image={IMAGES[id]} />
      <header className="page-defi__entete">
        <h1>{defi.titre}</h1>
        <a href="#/" className="page-defi__retour">← écran principal</a>
      </header>

      {defi.Composant ? (
        <>
          <defi.Composant onTermine={rapporter} />
          {defi.type === 'digital' && (
            <div className="page-defi__report">
              <span className="page-defi__label">Score à annoncer à l’organisateur</span>
              <strong className="page-defi__grand" data-testid="score-final">
                {meilleur ? `${meilleur.x} / ${meilleur.n}` : `– / ${defi.n}`}
              </strong>
            </div>
          )}
        </>
      ) : (
        <p>Défi physique — pas de page de jeu. Le score se saisit à la main sur l’écran principal.</p>
      )}
    </div>
  )
}
