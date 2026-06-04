import App from '../App.jsx'
import PageDefi from './PageDefi.jsx'
import { useHashRoute } from './routage.js'

// Routeur racine : page de défi dédiée (#/defi/<id>) ou jeu principal.
export default function Root() {
  const route = useHashRoute()
  if (route.nom === 'defi') return <PageDefi id={route.id} difficulte={route.difficulte} />
  return <App />
}
