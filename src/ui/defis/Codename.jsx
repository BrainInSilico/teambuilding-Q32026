import { useEffect, useMemo, useState } from 'react'
import { mulberry32 } from '../../engine/rng.js'
import { genererGrille } from './codename.js'
import { creer, lancer, retourner, passer } from './jeuCodename.js'
import { enregistrerDefi } from './registre.js'

const TAILLE = 25
const NB_ALLIES = 8
// Difficulté : nombre d'assassins + modificateur de coups.
const DIFF = {
  entrainement: { nbPieges: 1, coupsMod: 0 },
  normal: { nbPieges: 2, coupsMod: 0 },
  epique: { nbPieges: 3, coupsMod: -1 },
}

// Défi Codename — 1 écran, BASCULE de rôle, vraie mécanique de coups :
//  • ANNONCEUR : voit les rôles + les cartes déjà testées. Donne un indice
//    (mot oral + un NOMBRE) puis lance le coup.
//  • DEVINEUR  : retourne des cartes. Le coup finit quand il a trouvé le nombre
//    annoncé d'alliés, ou dès un neutre. Assassin = game over.
// Budget = (alliés − 1) coups → il faut des indices multi-alliés.
export default function Codename({ grilleInitiale, onTermine, difficulte = 'normal' }) {
  const conf = DIFF[difficulte] ?? DIFF.normal
  const grille = useMemo(
    () =>
      grilleInitiale ??
      genererGrille(mulberry32((Math.random() * 1e9) | 0), {
        taille: TAILLE,
        nbAllies: NB_ALLIES,
        nbPieges: conf.nbPieges,
      }),
    [grilleInitiale], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const [jeu, setJeu] = useState(() => creer(grille, conf.coupsMod))
  const [vue, setVue] = useState('annonceur')
  const [mot, setMot] = useState('')
  const [nombre, setNombre] = useState(1)

  useEffect(() => {
    onTermine(jeu.trouves, jeu.nbAllies)
  }, [jeu.trouves, jeu.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const annonceur = vue === 'annonceur'
  const restants = jeu.nbAllies - jeu.trouves

  const lancerCoup = () => {
    setJeu((j) => lancer(j, Math.max(1, Math.min(nombre, restants))))
    setVue('devineur')
  }

  return (
    <div className="codename">
      <div className="codename__barre">
        <span data-testid="codename-mode">{annonceur ? 'Vue ANNONCEUR' : 'Vue DEVINEUR'}</span>
        <span>{jeu.trouves}/{jeu.nbAllies} alliés · {jeu.coupsRestants} coups restants</span>
        <button onClick={() => setVue(annonceur ? 'devineur' : 'annonceur')}>
          {annonceur ? 'Passer côté devineur ▶' : '◀ Passer côté annonceur'}
        </button>
      </div>

      {annonceur && jeu.phase === 'annonce' && (
        <div className="codename__annonce">
          <span>Indice (oral) :</span>
          <input placeholder="un mot" value={mot} onChange={(e) => setMot(e.target.value)} />
          <span>nombre d’alliés :</span>
          <input
            type="number"
            data-testid="codename-nombre"
            min={1}
            max={restants}
            value={nombre}
            onChange={(e) => setNombre(Number(e.target.value))}
          />
          <button onClick={lancerCoup}>Lancer le coup ▶</button>
        </div>
      )}

      {annonceur && jeu.phase !== 'annonce' && jeu.phase !== 'fini' && (
        <p className="codename__aide">Coup en cours côté devineur. Les ✓ ont déjà été testés.</p>
      )}

      {!annonceur && jeu.phase === 'devine' && (
        <div className="codename__indice">
          Indice : <strong>{mot || '—'}</strong> ({jeu.nombre}) · trouvés ce coup : {jeu.trouvesCeCoup}/{jeu.nombre}
          <button onClick={() => setJeu((j) => passer(j))}>Terminer le coup</button>
        </div>
      )}
      {!annonceur && jeu.phase === 'annonce' && <p className="codename__aide">En attente d’un indice (côté annonceur).</p>}

      <div className="codename__grille">
        {grille.map((c, i) => {
          const revele = jeu.reveles[i]
          const classeRole = annonceur || revele ? `codename__mot--${c.role}` : ''
          return (
            <button
              key={c.mot}
              className={`codename__mot ${classeRole} ${annonceur ? 'codename__mot--apercu' : ''}`}
              onClick={() => !annonceur && setJeu((j) => retourner(j, i))}
              disabled={annonceur || jeu.phase !== 'devine'}
            >
              {c.mot}
              {annonceur && revele && <span className="codename__teste" data-testid="codename-teste">✓</span>}
            </button>
          )
        })}
      </div>

      {jeu.phase === 'fini' && (
        <div className="codename__fin" data-testid="codename-fin">
          {jeu.issue === 'assassin' && 'Assassin retourné — game over. '}
          {jeu.issue === 'gagne' && 'Gagné ! '}
          {jeu.issue === 'perdu' && 'Terminé. '}
          {jeu.trouves}/{jeu.nbAllies} alliés trouvés.
        </div>
      )}
    </div>
  )
}

enregistrerDefi('codename', { Composant: Codename, n: NB_ALLIES })
