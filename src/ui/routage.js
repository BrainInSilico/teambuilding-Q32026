import { useEffect, useState } from 'react'

// Routage par hash (100 % statique, offline) : #/defi/<id> ou app par défaut.
export function parseRoute(hash) {
  const m = /^#\/defi\/([^/]+)$/.exec(hash ?? '')
  if (m && m[1]) return { nom: 'defi', id: m[1] }
  return { nom: 'app' }
}

// Hook : route courante, réactif aux changements de hash.
export function useHashRoute() {
  const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''))
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return parseRoute(hash)
}
