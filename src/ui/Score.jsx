// Verdict du tour : note + réduction par défi (enrichi en U6).
export default function Score({ dernierScore, onContinuer }) {
  return (
    <div className="score">
      <h2>Verdict</h2>
      {dernierScore.length === 0 && <p>Aucun défi relevé ce tour.</p>}
      <ul>
        {dernierScore.map((s) => (
          <li key={s.menaceId} data-testid={`verdict-${s.menaceId}`}>
            <strong>{s.note}</strong> — {s.menaceId} ({s.x}/{s.n}, −{Math.round(s.reduction)})
          </li>
        ))}
      </ul>
      <button onClick={onContinuer}>Continuer</button>
    </div>
  )
}
