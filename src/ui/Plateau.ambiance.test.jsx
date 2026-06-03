import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App.jsx'

// Démarre une partie puis renvoie l'écran rendu.
function demarrer() {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: /démarrer/i }))
}

describe('App — ambiance & interaction', () => {
  it('après démarrage, rend le plateau avec ses 5 jauges et la méta-jauge', () => {
    demarrer()
    expect(screen.getAllByTestId(/^jauge-(?!barre-)/)).toHaveLength(5)
    expect(screen.getByTestId('integrite')).toBeInTheDocument()
  })

  it('expose la variable CSS de tension sur le plateau', () => {
    demarrer()
    const plateau = document.querySelector('.plateau')
    expect(plateau.style.getPropertyValue('--tension-globale')).not.toBe('')
  })

  it('le bouton Continuer fait avancer la phase', () => {
    demarrer()
    expect(screen.getByText(/phase : menace/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /continuer/i }))
    expect(screen.getByText(/phase : assignation/i)).toBeInTheDocument()
  })
})
