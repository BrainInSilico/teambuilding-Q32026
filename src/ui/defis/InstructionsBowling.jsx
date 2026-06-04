import { useMemo } from 'react'
import { mulberry32 } from '../../engine/rng.js'
import { setupBowling } from './bowling.js'
import { enregistrerDefi } from './registre.js'

// Défi PHYSIQUE : la page tire et affiche une mise en place aléatoire. Le score
// (gobelets renversés / total) est annoncé puis saisi à la main.
export default function InstructionsBowling() {
  const s = useMemo(() => setupBowling(mulberry32((Math.random() * 1e9) | 0)), [])
  return (
    <div className="instructions" data-testid="instr-bowling">
      <h2>Mise en place</h2>
      <ul className="instructions__liste">
        <li>Disposition : <strong>{s.disposition}</strong></li>
        <li>Nombre de gobelets : <strong>{s.gobelets}</strong></li>
        <li>Distance de tir minimale : <strong>{s.distance}</strong></li>
      </ul>
      <p>Montez la pile, reculez à la distance imposée, lancez votre « boule » de fortune.</p>
      <p className="instructions__report">
        À annoncer à l’organisateur : <strong>gobelets renversés</strong> sur <strong>{s.gobelets}</strong>.
      </p>
    </div>
  )
}

enregistrerDefi('bowling', {
  Composant: InstructionsBowling,
  type: 'physique',
  nVariable: true,
  n: 10,
  labelX: 'gobelets renversés',
})
