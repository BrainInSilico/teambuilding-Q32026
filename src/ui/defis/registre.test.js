import { describe, it, expect } from 'vitest'
import { defiPour, enregistrerDefi } from './registre.js'

describe('registre des défis', () => {
  it('fournit un défi pour chacune des 5 menaces', () => {
    for (const id of ['arcade', 'codename', 'bowling', 'tour', 'crypto']) {
      const d = defiPour(id)
      expect(d.titre).toBeTruthy()
      expect(d.n).toBeGreaterThan(0)
    }
  })

  it('menace inconnue → défi manuel par défaut', () => {
    expect(defiPour('???').type).toBe('manuel')
  })

  it('enregistrerDefi bascule un défi en digital', () => {
    const Faux = () => null
    enregistrerDefi('bowling', { Composant: Faux, n: 12 })
    const d = defiPour('bowling')
    expect(d.type).toBe('digital')
    expect(d.Composant).toBe(Faux)
    expect(d.n).toBe(12)
  })
})
