import { paletteMenace } from './presentation.js'

// Une jauge de menace : nom, niveau, barre proportionnelle, état gelé.
// Données issues de vuePublique (aucune valeur cachée).
export default function Jauge({ menace }) {
  const { id, nom, niveau, gelee } = menace
  const palette = paletteMenace(niveau)
  return (
    <div className={`jauge jauge--${palette}`} data-testid={`jauge-${id}`}>
      <div className="jauge__entete">
        <span className="jauge__nom">{nom}</span>
        <span className="jauge__niveau">{niveau}</span>
      </div>
      <div className="jauge__piste">
        <div
          className="jauge__barre"
          data-testid={`jauge-barre-${id}`}
          style={{ width: `${niveau}%` }}
        />
      </div>
      {gelee && <span className="jauge__gel">❄ gelée</span>}
    </div>
  )
}
