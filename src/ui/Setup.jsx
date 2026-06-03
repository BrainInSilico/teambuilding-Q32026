// Écran d'entrée minimal (enrichi en U4). Lance une partie.
const JOUEURS_DEFAUT = ['Joueur 1', 'Joueur 2', 'Joueur 3', 'Joueur 4']

export default function Setup({ onDemarrer }) {
  return (
    <div className="setup">
      <h1>ARGOS</h1>
      <p>Coopératif · 4 joueurs · contenez la menace.</p>
      <button onClick={() => onDemarrer({ joueurs: JOUEURS_DEFAUT })}>Démarrer une partie</button>
    </div>
  )
}
