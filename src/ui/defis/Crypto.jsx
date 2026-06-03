import { useMemo, useState } from 'react'
import { mulberry32 } from '../../engine/rng.js'
import { genererCrypto, verifier } from './crypto.js'
import { enregistrerDefi } from './registre.js'

const N = 5

// Défi Crypto : déchiffrer des paliers de difficulté croissante. Auto-vérifié.
// `paliersInitiaux` permet d'injecter un jeu déterministe en test.
export default function Crypto({ paliersInitiaux, onTermine }) {
  const paliers = useMemo(
    () => paliersInitiaux ?? genererCrypto(mulberry32((Math.random() * 1e9) | 0), N),
    [paliersInitiaux],
  )
  const [index, setIndex] = useState(0)
  const [resolus, setResolus] = useState(0)
  const [saisie, setSaisie] = useState('')
  const [erreur, setErreur] = useState(false)

  const n = paliers.length
  const fini = index >= n
  const courant = paliers[index]

  const verifierSaisie = () => {
    if (verifier(saisie, courant.clair)) {
      const nb = resolus + 1
      setResolus(nb)
      onTermine(nb, n)
      setIndex(index + 1)
      setSaisie('')
      setErreur(false)
    } else {
      setErreur(true)
    }
  }

  const passer = () => {
    setIndex(index + 1)
    setSaisie('')
    setErreur(false)
    onTermine(resolus, n)
  }

  if (fini) {
    return <div className="crypto crypto--fini">Crypto terminée : {resolus}/{n} paliers résolus.</div>
  }

  return (
    <div className="crypto">
      <div className="crypto__progress">Palier {index + 1}/{n} · {resolus} résolus</div>
      <div className="crypto__champ">💡 Tous les mots partagent un même <strong>champ lexical</strong> (non précisé) — devinez-le pour aller plus vite.</div>
      <div className="crypto__alphabet" data-testid="crypto-alphabet">
        {Array.from({ length: 26 }, (_, k) => (
          <span key={k} className="crypto__lettre">
            <b>{String.fromCharCode(65 + k)}</b>
            <i>{k + 1}</i>
          </span>
        ))}
      </div>
      <div className="crypto__chiffre">{courant.chiffre}</div>
      <div className="crypto__aide">
        <span className="crypto__famille">{courant.famille}</span>
        <span className="crypto__crib">
          1ʳᵉ lettre du mot : <strong data-testid="crypto-crib">{courant.crib}</strong>
        </span>
      </div>
      <input
        data-testid="crypto-saisie"
        value={saisie}
        placeholder="texte en clair…"
        onChange={(e) => setSaisie(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && verifierSaisie()}
      />
      <button onClick={verifierSaisie}>Vérifier</button>
      <button onClick={passer}>Passer</button>
      {erreur && <span className="crypto__erreur">Pas encore…</span>}
    </div>
  )
}

// Branche le défi sur la menace « crypto ».
enregistrerDefi('crypto', { Composant: Crypto, n: N })
