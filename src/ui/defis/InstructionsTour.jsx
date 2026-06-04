import { useMemo } from 'react'
import { mulberry32 } from '../../engine/rng.js'
import { setupTour } from './tour.js'
import { enregistrerDefi } from './registre.js'

// Défi PHYSIQUE : empiler des dés de JDR selon un ORDRE imposé tiré au hasard.
// Score = étages qui tiennent 5 s, saisi à la main (total variable).
export default function InstructionsTour() {
  const s = useMemo(() => setupTour(mulberry32((Math.random() * 1e9) | 0)), [])
  return (
    <div className="instructions" data-testid="instr-tour">
      <h2>Construire la Tour</h2>
      <ul className="instructions__liste">
        <li>Matériel : dés de JDR — <strong>3 sets complets</strong> (d20, d12, d10×2, d8, d6). Le d4 est interdit.</li>
        <li>
          Ordre d’empilement <strong>imposé</strong> :{' '}
          <strong className="instructions__ordre">{s.ordre.join(' → ')}</strong>, puis on répète le cycle en montant.
        </li>
        <li>Un <strong>étage</strong> = un dé posé dans l’ordre qui tient.</li>
        <li><strong>Règle des 5 s</strong> : un étage ne compte que s’il tient <strong>5 secondes</strong> sans s’effondrer.</li>
        <li><strong>3 essais</strong> : si la tour s’effondre, on repart de zéro. On retient la <strong>meilleure tour</strong> (le plus d’étages tenus).</li>
      </ul>
      <p className="instructions__report">
        À annoncer à l’organisateur : <strong>étages tenus 5 s au meilleur essai</strong> sur le nombre d’étages tentés.
      </p>
    </div>
  )
}

enregistrerDefi('tour', {
  Composant: InstructionsTour,
  type: 'physique',
  nVariable: true,
  n: 10,
  labelX: 'étages tenus 5 s',
})
