import { useMemo, useState } from 'react'
import { mulberry32 } from '../../engine/rng.js'
import { genererGrille } from './codename.js'
import { enregistrerDefi } from './registre.js'

const TAILLE = 9
const NB_ALLIES = 5

// Défi Codename — JEU À 2 RÔLES :
//  1. le DONNEUR voit les rôles et choisit un indice (mot + nombre) à l'oral ;
//  2. il « transmet » → les DEVINEURS ne voient plus les rôles et cliquent.
// Allié = point, piège = fin. Score = alliés trouvés / total.
export default function Codename({ grilleInitiale, onTermine }) {
  const grille = useMemo(
    () => grilleInitiale ?? genererGrille(mulberry32((Math.random() * 1e9) | 0), { taille: TAILLE, nbAllies: NB_ALLIES }),
    [grilleInitiale],
  )
  const nbAllies = grille.filter((c) => c.role === 'allie').length
  const [mode, setMode] = useState('donneur')
  const [indice, setIndice] = useState('')
  const [nombre, setNombre] = useState(1)
  const [reveles, setReveles] = useState(() => grille.map(() => false))
  const [trouves, setTrouves] = useState(0)
  const [fini, setFini] = useState(false)

  const cliquer = (i) => {
    if (mode !== 'devineur' || fini || reveles[i]) return
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

  const donneur = mode === 'donneur'

  return (
    <div className="codename">
      <div className="codename__barre">
        <span data-testid="codename-mode">{donneur ? 'Mode donneur (tu vois les rôles)' : `Indice : ${indice || '—'} (${nombre})`}</span>
        <span>{trouves}/{nbAllies} alliés</span>
      </div>

      {donneur && (
        <div className="codename__donneur">
          <input
            data-testid="codename-indice"
            placeholder="indice (un mot)"
            value={indice}
            onChange={(e) => setIndice(e.target.value)}
          />
          <input
            type="number"
            min={1}
            max={nbAllies}
            value={nombre}
            onChange={(e) => setNombre(Number(e.target.value))}
          />
          <button onClick={() => setMode('devineur')}>Transmettre aux devineurs ▶</button>
        </div>
      )}

      <div className="codename__grille">
        {grille.map((c, i) => (
          <button
            key={c.mot}
            className={`codename__mot ${reveles[i] ? `codename__mot--${c.role}` : ''} ${donneur ? `codename__apercu--${c.role}` : ''}`}
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
