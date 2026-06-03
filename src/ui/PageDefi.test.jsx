import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PageDefi from './PageDefi.jsx'
import { enregistrerDefi, defiPour } from './defis/registre.js'

describe('PageDefi', () => {
  it('rend le défi digital et affiche le score à reporter', () => {
    const Faux = ({ onTermine }) => <button onClick={() => onTermine(4, 6)}>jouer</button>
    enregistrerDefi('arcade', { Composant: Faux, n: 6 })

    render(<PageDefi id="arcade" />)
    expect(screen.getByText(defiPour('arcade').titre)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'jouer' }))
    expect(screen.getByTestId('score-a-reporter')).toHaveTextContent('4')
    expect(screen.getByTestId('score-a-reporter')).toHaveTextContent('6')
  })

  it('défi manuel/inconnu → message « pas de page »', () => {
    render(<PageDefi id="bowling" />)
    expect(screen.getByText(/physique|pas de page|manuel/i)).toBeInTheDocument()
  })
})
