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
    expect(screen.getByRole('button', { name: /valider l’assignation/i })).toBeInTheDocument()

    // assignation → realisation
    fireEvent.click(screen.getByRole('button', { name: /valider l’assignation/i }))

    // saisir un résultat parfait sur arcade
    fireEvent.change(screen.getByTestId('res-x-arcade'), { target: { value: '10' } })
    fireEvent.change(screen.getByTestId('res-n-arcade'), { target: { value: '10' } })
    fireEvent.click(screen.getByRole('button', { name: /valider les résultats/i }))

    // score : la note apparaît
    expect(screen.getByText(/éradiqué/i)).toBeInTheDocument()

    // score → tour suivant
    fireEvent.click(screen.getByRole('button', { name: /continuer/i }))
    expect(screen.getByText(/phase : menace/i)).toBeInTheDocument()
  })
})
