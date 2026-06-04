import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PageDefi from './PageDefi.jsx'
import { enregistrerDefi, defiPour } from './defis/registre.js'
import * as pont from './pont.js'

describe('PageDefi', () => {
  it('rend le défi digital et garde le MEILLEUR score', () => {
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
    expect(screen.getByTestId('score-a-reporter')).toHaveTextContent('4')
  })

  it('le bouton Reporter publie le meilleur score sur le pont', () => {
    const spy = vi.spyOn(pont, 'publierScore').mockReturnValue(true)
    const Faux = ({ onTermine }) => <button onClick={() => onTermine(5, 6)}>jouer</button>
    enregistrerDefi('arcade', { Composant: Faux, n: 6 })
    render(<PageDefi id="arcade" />)
    fireEvent.click(screen.getByRole('button', { name: 'jouer' }))
    fireEvent.click(screen.getByRole('button', { name: /reporter/i }))
    expect(spy).toHaveBeenCalledWith('arcade', 5, 6)
    spy.mockRestore()
  })

  it('défi manuel/inconnu → message « pas de page »', () => {
    render(<PageDefi id="bowling" />)
    expect(screen.getByText(/physique|pas de page|manuel/i)).toBeInTheDocument()
  })
})
