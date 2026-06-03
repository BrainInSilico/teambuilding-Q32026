import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Cassebrique from './Cassebrique.jsx'

describe('Cassebrique (composant)', () => {
  it('rend l’aire de jeu et un score initial à 0', () => {
    render(<Cassebrique onTermine={() => {}} />)
    expect(screen.getByTestId('cb-aire')).toBeInTheDocument()
    expect(screen.getByTestId('cb-score')).toHaveTextContent(/^0\/\d+/)
  })

  it('dessine des briques vivantes', () => {
    render(<Cassebrique onTermine={() => {}} />)
    expect(screen.getAllByTestId(/^cb-brique-/).length).toBeGreaterThan(0)
  })
})
