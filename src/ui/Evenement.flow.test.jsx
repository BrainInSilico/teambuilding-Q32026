import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App.jsx'

// Joue un tour complet pour atteindre le tour 2, où un événement est tiré.
function jouerUnTour() {
  fireEvent.click(screen.getByRole('button', { name: /continuer/i })) // menace → assignation
  fireEvent.click(screen.getByRole('button', { name: /valider l’assignation/i }))
  fireEvent.click(screen.getByRole('button', { name: /valider les résultats/i }))
  fireEvent.click(screen.getByRole('button', { name: /continuer/i })) // score → tour suivant
}

describe('Événement — surgit à partir du tour 2', () => {
  it('aucun bandeau au tour 1, un bandeau au tour 2', () => {
    render(<App />)
    fireEvent.change(screen.getByTestId('graine'), { target: { value: '7' } })
    fireEvent.click(screen.getByRole('button', { name: /démarrer/i }))

    expect(screen.queryByTestId('bandeau-evenement')).toBeNull()
    jouerUnTour()
    expect(screen.getByTestId('bandeau-evenement')).toBeInTheDocument()
  })
})
