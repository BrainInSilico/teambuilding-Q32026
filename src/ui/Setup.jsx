import { useState } from 'react'

// Écran d'entrée : noms des 4 joueurs + graine optionnelle (run à blanc) + règles.
const NOMS_DEFAUT = ['Joueur 1', 'Joueur 2', 'Joueur 3', 'Joueur 4']
const DIFFICULTES = [
  { cle: 'entrainement', label: 'Entraînement' },
  { cle: 'normal', label: 'Normal' },
  { cle: 'epique', label: 'Épique' },
]

export default function Setup({ onDemarrer }) {
  const [joueurs, setJoueurs] = useState(NOMS_DEFAUT)
  const [graine, setGraine] = useState('')
  const [difficulte, setDifficulte] = useState('normal')

  const setNom = (i, v) => setJoueurs((js) => js.map((j, k) => (k === i ? v : j)))

  const demarrer = () => {
    const seed = graine.trim() === '' ? undefined : Number(graine)
    onDemarrer({ joueurs, seed, difficulte })
  }

  return (
    <div className="setup">
      <h1>ARGOS</h1>
      <p className="setup__pitch">
        Jeu <strong>coopératif</strong> à 4 joueurs. Cinq menaces montent toutes seules ;
        relevez des défis pour les contenir. On gagne — ou on perd — ensemble.
      </p>

      <h2>Joueurs</h2>
      <div className="setup__joueurs">
        {joueurs.map((nom, i) => (
          <input
            key={i}
            data-testid={`joueur-${i}`}
            value={nom}
            onChange={(e) => setNom(i, e.target.value)}
          />
        ))}
      </div>

      <label className="setup__graine">
        Graine (optionnel — pour rejouer la même partie)
        <input
          data-testid="graine"
          value={graine}
          inputMode="numeric"
          placeholder="aléatoire"
          onChange={(e) => setGraine(e.target.value)}
        />
      </label>

      <h2>Difficulté</h2>
      <div className="setup__difficulte">
        {DIFFICULTES.map((d) => (
          <button
            key={d.cle}
            className={difficulte === d.cle ? 'pastille pastille--actif' : 'pastille'}
            onClick={() => setDifficulte(d.cle)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div>
        <button onClick={demarrer}>Démarrer une partie</button>
      </div>
    </div>
  )
}
