import { describe, it, expect } from 'vitest'
import { parseRoute } from './routage.js'

describe('parseRoute', () => {
  it('vide / racine → app', () => {
    expect(parseRoute('')).toEqual({ nom: 'app' })
    expect(parseRoute('#/')).toEqual({ nom: 'app' })
  })
  it('#/defi/<id> → defi avec id', () => {
    expect(parseRoute('#/defi/crypto')).toEqual({ nom: 'defi', id: 'crypto' })
    expect(parseRoute('#/defi/arcade')).toEqual({ nom: 'defi', id: 'arcade' })
  })
  it('route inconnue → app', () => {
    expect(parseRoute('#/nimporte')).toEqual({ nom: 'app' })
  })
  it('tolère un id vide', () => {
    expect(parseRoute('#/defi/')).toEqual({ nom: 'app' })
  })
})
