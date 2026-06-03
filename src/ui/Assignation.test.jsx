import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import Assignation from './Assignation.jsx'

const menaces = [
  { id: 'arcade', nom: 'Surcharge' },
  { id: 'codename', nom: 'Brouillage' },
  { id: 'tour', nom: 'Effondrement' },
]
const joueurs = ['A', 'B', 'C', 'D']

const valider = () => fireEvent.click(screen.getByRole('button', { name: /valider l’assignation/i }))

const placer = (menaceId, joueur) =>
  fireEvent.click(within(screen.getByTestId(`assign-${menaceId}`)).getByRole('button', { name: joueur }))

describe('Assignation', () => {
  it('affiche une ligne par menace avec les joueurs', () => {
    render(<Assignation menaces={menaces} joueurs={joueurs} onValider={() => {}} />)
    expect(screen.getByTestId('assign-arcade')).toBeInTheDocument()
    expect(screen.getByTestId('assign-codename')).toBeInTheDocument()
  })

  it('un joueur ne peut être que sur une seule menace à la fois', () => {
    const onValider = vi.fn()
    render(<Assignation menaces={menaces} joueurs={joueurs} onValider={onValider} />)
    placer('arcade', 'A')
    placer('tour', 'A') // déplace A de arcade vers tour (menace neutre, hors règle codename)
    valider()
    const carte = onValider.mock.calls[0][0]
    expect(carte.arcade ?? []).not.toContain('A')
    expect(carte.tour).toContain('A')
  })

  it('compte les joueurs assignés', () => {
    render(<Assignation menaces={menaces} joueurs={joueurs} onValider={() => {}} />)
    placer('arcade', 'A')
    placer('arcade', 'B')
    expect(screen.getByTestId('assign-compteur')).toHaveTextContent('2')
  })

  it('plusieurs joueurs sur une menace (levier +joueurs)', () => {
    const onValider = vi.fn()
    render(<Assignation menaces={menaces} joueurs={joueurs} onValider={onValider} />)
    placer('arcade', 'A')
    placer('arcade', 'B')
    valider()
    expect(onValider.mock.calls[0][0].arcade).toEqual(expect.arrayContaining(['A', 'B']))
  })

  it('Brouillage avec 1 seul joueur → bloqué + avertissement', () => {
    const onValider = vi.fn()
    render(<Assignation menaces={menaces} joueurs={joueurs} onValider={onValider} />)
    placer('codename', 'A')
    valider()
    expect(onValider).not.toHaveBeenCalled()
    expect(screen.getByText(/2 joueurs/i)).toBeInTheDocument()
  })

  it('Brouillage avec 0 joueur → autorisé (on peut le laisser monter)', () => {
    const onValider = vi.fn()
    render(<Assignation menaces={menaces} joueurs={joueurs} onValider={onValider} />)
    placer('arcade', 'A')
    valider()
    expect(onValider).toHaveBeenCalled()
  })

  it('Brouillage avec 2 joueurs → autorisé', () => {
    const onValider = vi.fn()
    render(<Assignation menaces={menaces} joueurs={joueurs} onValider={onValider} />)
    placer('codename', 'A')
    placer('codename', 'B')
    valider()
    expect(onValider).toHaveBeenCalled()
  })
})
