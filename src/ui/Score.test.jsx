import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import Score from './Score.jsx'

const dernierScore = [
  { menaceId: 'arcade', nom: 'Surcharge', x: 10, n: 10, reduction: 100, note: 'Éradiqué' },
  { menaceId: 'tour', nom: 'Effondrement', x: 0, n: 10, reduction: 0, note: 'Effort gâché' },
]

describe('Score (verdict)', () => {
  it('rend une carte par défi avec nom, note et phrase', () => {
    render(<Score dernierScore={dernierScore} onContinuer={() => {}} />)
    const carte = screen.getByTestId('verdict-arcade')
    expect(within(carte).getByText('Surcharge')).toBeInTheDocument()
    expect(within(carte).getByText(/éradiqué/i)).toBeInTheDocument()
    expect(carte.textContent.length).toBeGreaterThan(10) // phrase présente
  })

  it('affiche une barre de réduction dimensionnée', () => {
    render(<Score dernierScore={dernierScore} onContinuer={() => {}} />)
    expect(screen.getByTestId('reduction-arcade')).toHaveStyle({ width: '100%' })
  })

  it('message si aucun défi relevé', () => {
    render(<Score dernierScore={[]} onContinuer={() => {}} />)
    expect(screen.getByText(/aucun défi/i)).toBeInTheDocument()
  })

  it('le bouton Continuer déclenche le rappel', () => {
    const onContinuer = vi.fn()
    render(<Score dernierScore={dernierScore} onContinuer={onContinuer} />)
    fireEvent.click(screen.getByRole('button', { name: /continuer/i }))
    expect(onContinuer).toHaveBeenCalled()
  })
})
