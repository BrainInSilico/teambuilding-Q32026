import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Arcade, { genererCibles } from './Arcade.jsx'
import { mulberry32 } from '../../engine/rng.js'

describe('genererCibles', () => {
  it('produit n indices dans [0, cells)', () => {
    const cibles = genererCibles(mulberry32(42), 5, 9)
    expect(cibles).toHaveLength(5)
    cibles.forEach((c) => {
      expect(c).toBeGreaterThanOrEqual(0)
      expect(c).toBeLessThan(9)
    })
  })
  it('déterministe pour un même seed', () => {
    expect(genererCibles(mulberry32(1), 5, 9)).toEqual(genererCibles(mulberry32(1), 5, 9))
  })
})

describe('Arcade (composant)', () => {
  it('toucher la cible active marque un point et avance', () => {
    const onTermine = vi.fn()
    render(<Arcade ciblesInitiales={[0, 1]} cells={9} onTermine={onTermine} />)
    fireEvent.click(screen.getByTestId('arcade-cell-0')) // cible active = 0
    expect(onTermine).toHaveBeenCalledWith(1, 2)
    fireEvent.click(screen.getByTestId('arcade-cell-1')) // cible active = 1
    expect(onTermine).toHaveBeenCalledWith(2, 2)
  })

  it('cliquer à côté = raté, on avance sans marquer', () => {
    const onTermine = vi.fn()
    render(<Arcade ciblesInitiales={[0, 1]} cells={9} onTermine={onTermine} />)
    fireEvent.click(screen.getByTestId('arcade-cell-5')) // cible active = 0 → raté
    expect(onTermine).toHaveBeenCalledWith(0, 2)
  })
})
