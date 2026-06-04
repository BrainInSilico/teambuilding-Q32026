import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PageDefi from './PageDefi.jsx'
import { enregistrerDefi, defiPour } from './defis/registre.js'

describe('PageDefi', () => {
  it('rend le défi digital et garde le MEILLEUR score (à annoncer à l’organisateur)', () => {
    const Faux = ({ onTermine }) => (
      <div>
        <button onClick={() => onTermine(4, 6)}>quatre</button>
        <button onClick={() => onTermine(2, 6)}>deux</button>
      </div>
    )
    enregistrerDefi('arcade', { Composant: Faux, n: 6 })
    render(<PageDefi id="arcade" />)
    expect(screen.getByText(defiPour('arcade').titre)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'quatre' }))
    fireEvent.click(screen.getByRole('button', { name: 'deux' })) // moins bon → ignoré
    expect(screen.getByTestId('score-final')).toHaveTextContent('4')
  })

  it('défi physique : rend la page d’instructions, sans bloc de score', () => {
    enregistrerDefi('bowling', { Composant: () => <div>INSTRUCTIONS BOWLING</div>, type: 'physique', nVariable: true, n: 10 })
    render(<PageDefi id="bowling" />)
    expect(screen.getByText('INSTRUCTIONS BOWLING')).toBeInTheDocument()
    expect(screen.queryByTestId('score-final')).toBeNull()
  })

  it('défi sans page → message « pas de page »', () => {
    render(<PageDefi id="tour" />)
    expect(screen.getByText(/physique|pas de page|manuel/i)).toBeInTheDocument()
  })
})
