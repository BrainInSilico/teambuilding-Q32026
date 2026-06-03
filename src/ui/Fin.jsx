// Écran de fin (enrichi en U8). Issue de la partie + rejouer.
const MESSAGES = {
  purge: { titre: 'Purge réussie', texte: 'Toutes les menaces sont sous le seuil. ARGOS est neutralisé.' },
  survie: { titre: 'Système préservé', texte: 'L’intégrité a tenu jusqu’au bout.' },
  argos: { titre: 'ARGOS l’emporte', texte: 'L’intégrité système s’est effondrée.' },
}

export default function Fin({ issue, onRejouer }) {
  const m = MESSAGES[issue] ?? { titre: 'Fin de partie', texte: '' }
  return (
    <div className="fin" data-testid="ecran-fin">
      <h1>{m.titre}</h1>
      <p>{m.texte}</p>
      <button onClick={onRejouer}>Rejouer</button>
    </div>
  )
}
