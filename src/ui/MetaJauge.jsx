// Méta-jauge Intégrité système [0,100] — règle publique (connue de tous).
// La fin de partie se lit ici : au-dessus de la ligne de survie = on tient.
export default function MetaJauge({ integrite, ligneSurvie }) {
  const danger = integrite < ligneSurvie
  return (
    <div className={`integrite ${danger ? 'integrite--danger' : ''}`} data-testid="integrite">
      <div className="integrite__entete">
        <span className="integrite__titre">Intégrité système</span>
        <span className="integrite__valeur">{integrite}</span>
      </div>
      <div className="integrite__piste">
        <div
          className="integrite__barre"
          data-testid="integrite-barre"
          style={{ width: `${integrite}%` }}
        />
        <div
          className="integrite__ligne"
          data-testid="integrite-ligne"
          style={{ left: `${ligneSurvie}%` }}
          title="Ligne de survie"
        />
      </div>
    </div>
  )
}
