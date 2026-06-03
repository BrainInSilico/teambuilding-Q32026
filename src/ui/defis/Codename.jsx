import { useMemo, useState } from 'react'
import { mulberry32 } from '../../engine/rng.js'
import { genererGrille } from './codename.js'
import { enregistrerDefi } from './registre.js'

const TAILLE = 9
const NB_ALLIES = 5

// Défi Codename — UN SEUL écran, BASCULE de rôle :
//  • Vue ANNONCEUR : voit les rôles ET les cartes déjà testées par le devineur
//    (pour adapter ses annonces). Ne marque pas en cliquant.
//  • Vue DEVINEUR  : rôles cachés ; cliquer une carte la retourne (allié = point,
//    piège = fin). L'état est partagé entre les deux vues.
export default function Codename({ grilleInitiale, onTermine }) {
  const grille = useMemo(
    () => grilleInitiale ?? genererGrille(mulberry32((Math.random() * 1e9) | 0), { taille: TAILLE, nbAllies: NB_ALLIES }),
    [grilleInitiale],
  )
  const nbAllies = grille.filter((c) => c.role === 'allie').length
  const [vue, setVue] = useState('annonceur')
  const [reveles, setReveles] = useState(() => grille.map(() => false))
  const [trouves, setTrouves] = useState(0)
  const [fini, setFini] = useState(false)

  const annonceur = vue === 'annonceur'

  const cliquer = (i) => {
    if (annonceur || fini || reveles[i]) return // l'annonceur ne retourne pas de carte
    const role = grille[i].role
    setReveles((r) => r.map((v, k) => (k === i ? true : v)))
    if (role === 'piege') {
      setFini(true)
      onTermine(trouves, nbAllies)
    } else if (role === 'allie') {
      const nb = trouves + 1
      setTrouves(nb)
      onTermine(nb, nbAllies)
      if (nb >= nbAllies) setFini(true)
    } else {
      onTermine(trouves, nbAllies)
    }
  }

  return (
    <div className="codename">
      <div className="codename__barre">
        <span data-testid="codename-mode">
          {annonceur ? 'Vue ANNONCEUR — tu vois les rôles' : 'Vue DEVINEUR — devine les alliés'}
        </span>
        <span>{trouves}/{nbAllies} alliés</span>
        <button onClick={() => setVue(annonceur ? 'devineur' : 'annonceur')}>
          {annonceur ? 'Passer côté devineur ▶' : '◀ Passer côté annonceur'}
        </button>
      </div>

      {annonceur && (
        <p className="codename__aide">
          Donne un indice (un mot + un nombre) à l’oral. Les cases marquées ✓ ont déjà été testées par l’équipe.
        </p>
      )}

      <div className="codename__grille">
        {grille.map((c, i) => {
          const revele = reveles[i]
          // En vue annonceur on montre les rôles (aperçu) ; en vue devineur, seulement les cartes retournées.
          const classeRole = annonceur || revele ? `codename__mot--${c.role}` : ''
          return (
            <button
              key={c.mot}
              className={`codename__mot ${classeRole} ${annonceur ? 'codename__mot--apercu' : ''}`}
              onClick={() => cliquer(i)}
              disabled={fini && !annonceur}
            >
              {c.mot}
              {annonceur && revele && <span className="codename__teste" data-testid="codename-teste">✓</span>}
            </button>
          )
        })}
      </div>

      {fini && (
        <div className="codename__fin" data-testid="codename-fin">
          Terminé : {trouves}/{nbAllies} alliés trouvés.
        </div>
      )}
    </div>
  )
}

enregistrerDefi('codename', { Composant: Codename, n: NB_ALLIES })
