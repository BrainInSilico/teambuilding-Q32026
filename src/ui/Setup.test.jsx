import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Setup from './Setup.jsx'

describe('Setup', () => {
  it('propose 4 champs de joueurs préremplis', () => {
    render(<Setup onDemarrer={() => {}} />)
    expect(screen.getAllByTestId(/^joueur-/)).toHaveLength(4)
  })

  it('affiche un résumé des règles', () => {
    render(<Setup onDemarrer={() => {}} />)
    expect(screen.getByText(/coop/i)).toBeInTheDocument()
  })

  it('transmet les noms édités au démarrage', () => {
    const onDemarrer = vi.fn()
    render(<Setup onDemarrer={onDemarrer} />)
    fireEvent.change(screen.getByTestId('joueur-0'), { target: { value: 'Nico' } })
    fireEvent.click(screen.getByRole('button', { name: /démarrer/i }))
    expect(onDemarrer).toHaveBeenCalledWith(expect.objectContaining({ joueurs: expect.arrayContaining(['Nico']) }))
  })

  it('transmet une graine numérique si saisie', () => {
    const onDemarrer = vi.fn()
    render(<Setup onDemarrer={onDemarrer} />)
    fireEvent.change(screen.getByTestId('graine'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /démarrer/i }))
    expect(onDemarrer).toHaveBeenCalledWith(expect.objectContaining({ seed: 123 }))
  })

  it('graine vide → seed undefined (aléatoire)', () => {
    const onDemarrer = vi.fn()
    render(<Setup onDemarrer={onDemarrer} />)
    fireEvent.click(screen.getByRole('button', { name: /démarrer/i }))
    expect(onDemarrer.mock.calls[0][0].seed).toBeUndefined()
  })
})
