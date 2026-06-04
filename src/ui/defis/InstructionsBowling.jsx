import { useMemo } from 'react'
import { mulberry32 } from '../../engine/rng.js'
import { setupBowling } from './bowling.js'
import { enregistrerDefi } from './registre.js'

// Défi PHYSIQUE : la page tire et affiche une mise en place aléatoire. Le score
// (gobelets renversés / total) est annoncé puis saisi à la main.
export default function InstructionsBowling({ difficulte = 'normal' }) {
  const s = useMemo(() => setupBowling(mulberry32((Math.random() * 1e9) | 0), difficulte), [difficulte])
  return (
    <div className="instructions" data-testid="instr-bowling">
      <h2>Mise en place</h2>
      <ul className="instructions__liste">
        <li>Disposition : <strong>{s.disposition}</strong></li>
        <li>Nombre de gobelets : <strong>{s.gobelets}</strong></li>
        <li>Distance de tir minimale : <strong>{s.distance}</strong></li>
        <li>La « boule » est un <strong>dé à 6 faces (d6)</strong>.</li>
        <li><strong>{s.essais} essais</strong> : après chaque essai, on <strong>refait la figure</strong> et on recommence.</li>
        <li>On retient l’<strong>essai le plus réussi</strong> (le plus de gobelets renversés).</li>
      </ul>
      <p>Montez la pile, reculez à la distance imposée, lancez le d6.</p>
      <p className="instructions__report">
        À annoncer à l’organisateur : <strong>gobelets renversés au meilleur essai</strong> sur <strong>{s.gobelets}</strong>.
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
