import { useMemo, useState } from 'react'
import { mulberry32 } from '../../engine/rng.js'
import { enregistrerDefi } from './registre.js'

const N = 5
const CELLS = 9

// Suite de cibles (indices de cellule) à toucher.
export function genererCibles(rng, n, cells) {
  return Array.from({ length: n }, () => Math.floor(rng() * cells))
}

// Défi Arcade : la cible saute de case en case, touche-la avant de passer à la
// suivante. Score = cibles touchées / total. Réflexe pur, aucune réponse que
// l'organisateur détiendrait.
export default function Arcade({ ciblesInitiales, cells = CELLS, onTermine }) {
  const cibles = useMemo(
    () => ciblesInitiales ?? genererCibles(mulberry32((Math.random() * 1e9) | 0), N, cells),
    [ciblesInitiales, cells],
  )
  const [index, setIndex] = useState(0)
  const [touches, setTouches] = useState(0)
  const n = cibles.length
  const fini = index >= n
  const active = cibles[index]

  const cliquer = (cell) => {
    if (fini) return
    const reussi = cell === active
    const nb = touches + (reussi ? 1 : 0)
    setTouches(nb)
    setIndex(index + 1)
    onTermine(nb, n)
  }

  if (fini) {
    return <div className="arcade arcade--fini">Arcade terminée : {touches}/{n} cibles.</div>
  }

  return (
    <div className="arcade">
      <div className="arcade__progress">Cible {index + 1}/{n} · {touches} touchées</div>
      <div className="arcade__grille" style={{ '--cols': Math.ceil(Math.sqrt(cells)) }}>
        {Array.from({ length: cells }, (_, i) => (
          <button
            key={i}
            data-testid={`arcade-cell-${i}`}
            className={i === active ? 'arcade__cell arcade__cell--actif' : 'arcade__cell'}
            onClick={() => cliquer(i)}
          >
            {i === active ? '◎' : ''}
          </button>
        ))}
      </div>
    </div>
  )
}

enregistrerDefi('arcade', { Composant: Arcade, n: N })
