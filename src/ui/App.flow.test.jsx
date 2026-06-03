import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App.jsx'

describe('App — tour complet via l’UI', () => {
  it('enchaîne setup → menace → assignation → realisation → score → tour 2', () => {
    render(<App />)

    // setup
    fireEvent.click(screen.getByRole('button', { name: /démarrer/i }))
    expect(screen.getByText(/phase : menace/i)).toBeInTheDocument()

    // menace → assignation
    fireEvent.click(screen.getByRole('button', { name: /continuer/i }))
    fireEvent.click(screen.getByRole('button', { name: /valider l’assignation/i }))

    // realisation → score (valeurs par défaut, indépendant du type de défi)
    fireEvent.click(screen.getByRole('button', { name: /valider les résultats/i }))
    expect(screen.getByText(/verdict/i)).toBeInTheDocument()

    // score → tour suivant
    fireEvent.click(screen.getByRole('button', { name: /continuer/i }))
    expect(screen.getByText(/phase : menace/i)).toBeInTheDocument()
  })
})
