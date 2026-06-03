import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Fin from './Fin.jsx'

const recap = {
  tour: 5,
  integrite: 70,
  menaces: [
    { id: 'arcade', nom: 'Surcharge', niveau: 12 },
    { id: 'tour', nom: 'Effondrement', niveau: 80 },
  ],
}

describe('Fin', () => {
  it('titre selon l’issue', () => {
    render(<Fin issue="purge" recap={recap} onRejouer={() => {}} />)
    expect(screen.getByText(/purge/i)).toBeInTheDocument()
  })

  it('classe victoire pour purge/survie, défaite pour argos', () => {
    const { rerender } = render(<Fin issue="survie" recap={recap} onRejouer={() => {}} />)
    expect(screen.getByTestId('ecran-fin').className).toMatch(/victoire/)
    rerender(<Fin issue="argos" recap={recap} onRejouer={() => {}} />)
    expect(screen.getByTestId('ecran-fin').className).toMatch(/defaite/)
  })

  it('affiche le récap final (tour, intégrité, menaces)', () => {
    render(<Fin issue="survie" recap={recap} onRejouer={() => {}} />)
    expect(screen.getByText(/70/)).toBeInTheDocument()
    expect(screen.getByText('Surcharge')).toBeInTheDocument()
    expect(screen.getByText('Effondrement')).toBeInTheDocument()
  })

  it('rejouer déclenche le rappel', () => {
    const onRejouer = vi.fn()
    render(<Fin issue="argos" recap={recap} onRejouer={onRejouer} />)
    fireEvent.click(screen.getByRole('button', { name: /rejouer/i }))
    expect(onRejouer).toHaveBeenCalled()
  })
})
