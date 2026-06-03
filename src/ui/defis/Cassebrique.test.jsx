import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Cassebrique from './Cassebrique.jsx'
import { NB_BRIQUES } from './cassebrique.js'

describe('Cassebrique (composant)', () => {
  it('rend l’aire de jeu et le score initial', () => {
    render(<Cassebrique onTermine={() => {}} />)
    expect(screen.getByTestId('cb-aire')).toBeInTheDocument()
    expect(screen.getByTestId('cb-score')).toHaveTextContent(`0/${NB_BRIQUES}`)
  })

  it('dessine les briques vivantes', () => {
    render(<Cassebrique onTermine={() => {}} />)
    expect(screen.getAllByTestId(/^cb-brique-/)).toHaveLength(NB_BRIQUES)
  })
})
