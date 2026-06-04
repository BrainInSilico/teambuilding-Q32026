import { describe, it, expect } from 'vitest'
import { parseRoute } from './routage.js'

describe('parseRoute', () => {
  it('vide / racine → app', () => {
    expect(parseRoute('')).toEqual({ nom: 'app' })
    expect(parseRoute('#/')).toEqual({ nom: 'app' })
  })
  it('#/defi/<id> → defi avec id (difficulté normale par défaut)', () => {
    expect(parseRoute('#/defi/crypto')).toEqual({ nom: 'defi', id: 'crypto', difficulte: 'normal' })
    expect(parseRoute('#/defi/arcade')).toEqual({ nom: 'defi', id: 'arcade', difficulte: 'normal' })
  })
  it('#/defi/<id>/<difficulté> → defi avec difficulté', () => {
    expect(parseRoute('#/defi/arcade/epique')).toEqual({ nom: 'defi', id: 'arcade', difficulte: 'epique' })
    expect(parseRoute('#/defi/crypto/entrainement')).toEqual({ nom: 'defi', id: 'crypto', difficulte: 'entrainement' })
  })
  it('route inconnue → app', () => {
    expect(parseRoute('#/nimporte')).toEqual({ nom: 'app' })
  })
  it('tolère un id vide', () => {
    expect(parseRoute('#/defi/')).toEqual({ nom: 'app' })
  })
})
