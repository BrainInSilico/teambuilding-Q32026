// Calque d'image en fond plein écran, derrière le contenu, avec un voile sombre
// (défini en CSS) pour garder le texte lisible. Purement décoratif.
export default function Fond({ image }) {
  if (!image) return null
  return <div className="fond" style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />
}
