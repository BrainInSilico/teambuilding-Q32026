import { useMemo, useState } from 'react'
import { mulberry32 } from '../../engine/rng.js'
import { genererGrille } from './codename.js'
import { enregistrerDefi } from './registre.js'

const TAILLE = 9
const NB_ALLIES = 5

// Défi Codename : un joueur voit les rôles (bouton « voir », à tenir loin des
// autres) et donne des indices ; l'équipe clique les mots. Allié = point,
// piège = fin du défi. Score = alliés trouvés / total.
export default function Codename({ grilleInitiale, onTermine }) {
  const grille = useMemo(
    () => grilleInitiale ?? genererGrille(mulberry32((Math.random() * 1e9) | 0), { taille: TAILLE, nbAllies: NB_ALLIES }),
    [grilleInitiale],
  )
  const nbAllies = grille.filter((c) => c.role === 'allie').length
  const [reveles, setReveles] = useState(() => grille.map(() => false))
  const [trouves, setTrouves] = useState(0)
  const [fini, setFini] = useState(false)
  const [voirRoles, setVoirRoles] = useState(false)

  const cliquer = (i) => {
    if (fini || reveles[i]) return
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
        <span>{trouves}/{nbAllies} alliés</span>
        <button onClick={() => setVoirRoles((v) => !v)}>{voirRoles ? 'cacher' : 'voir (donneur)'}</button>
      </div>
      <div className="codename__grille">
        {grille.map((c, i) => (
          <button
            key={c.mot}
            className={`codename__mot ${reveles[i] ? `codename__mot--${c.role}` : ''} ${voirRoles ? `codename__apercu--${c.role}` : ''}`}
            onClick={() => cliquer(i)}
            disabled={fini}
          >
            {c.mot}
          </button>
        ))}
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
