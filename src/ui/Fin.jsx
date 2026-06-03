// Écran de fin : issue de la partie + récap final + rejouer.
const MESSAGES = {
  purge: { titre: 'Purge réussie', texte: 'Toutes les menaces sont sous le seuil. ARGOS est neutralisé.', ton: 'victoire' },
  survie: { titre: 'Système préservé', texte: 'L’intégrité a tenu jusqu’au bout.', ton: 'victoire' },
  argos: { titre: 'ARGOS l’emporte', texte: 'L’intégrité système s’est effondrée.', ton: 'defaite' },
}

export default function Fin({ issue, recap, onRejouer }) {
  const m = MESSAGES[issue] ?? { titre: 'Fin de partie', texte: '', ton: 'neutre' }
  return (
    <div className={`fin fin--${m.ton}`} data-testid="ecran-fin">
      <h1>{m.titre}</h1>
      <p>{m.texte}</p>

      {recap && (
        <div className="fin__recap">
          <p>
            Tour atteint : <strong>{recap.tour}</strong> · Intégrité finale :{' '}
            <strong>{recap.integrite}</strong>
          </p>
          <ul className="fin__menaces">
            {recap.menaces.map((mz) => (
              <li key={mz.id}>
                <span>{mz.nom}</span> — <strong>{mz.niveau}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={onRejouer}>Rejouer</button>
    </div>
  )
}
