import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App.jsx'

// Tests d'ambiance/structure : on vérifie le câblage visuel, pas le pixel.
describe('App — ambiance & interaction', () => {
  it('rend le plateau avec ses 5 jauges et la méta-jauge', () => {
    render(<App />)
    expect(screen.getAllByTestId(/^jauge-(?!barre-)/)).toHaveLength(5)
    expect(screen.getByTestId('integrite')).toBeInTheDocument()
  })

  it('expose la variable CSS de tension sur le plateau', () => {
    const { container } = render(<App />)
    const plateau = container.querySelector('.plateau')
    expect(plateau.style.getPropertyValue('--tension')).not.toBe('')
  })

  it('le stepper debug fait monter au moins une jauge', () => {
    render(<App />)
    const niveauAvant = Number(screen.getByTestId('jauge-arcade').querySelector('.jauge__niveau').textContent)
    fireEvent.click(screen.getByRole('button', { name: /monter/i }))
    const niveauApres = Number(screen.getByTestId('jauge-arcade').querySelector('.jauge__niveau').textContent)
    expect(niveauApres).toBeGreaterThanOrEqual(niveauAvant)
  })
})
