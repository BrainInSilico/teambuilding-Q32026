import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Codename from './Codename.jsx'

const grille = [
  { mot: 'ÉTOILE', role: 'allie' },
  { mot: 'VIRUS', role: 'piege' },
  { mot: 'CODE', role: 'neutre' },
  { mot: 'PHARE', role: 'allie' },
]

const versDevineur = () => fireEvent.click(screen.getByRole('button', { name: /côté devineur/i }))
const versAnnonceur = () => fireEvent.click(screen.getByRole('button', { name: /côté annonceur/i }))

describe('Codename — 1 écran, bascule de rôle', () => {
  it('démarre en vue annonceur (rôles visibles)', () => {
    render(<Codename grilleInitiale={grille} onTermine={() => {}} />)
    expect(screen.getByTestId('codename-mode')).toHaveTextContent(/annonceur/i)
  })

  it('en vue annonceur, cliquer un mot ne marque pas (indices à l’oral)', () => {
    const onTermine = vi.fn()
    render(<Codename grilleInitiale={grille} onTermine={onTermine} />)
    fireEvent.click(screen.getByRole('button', { name: /ÉTOILE/ }))
    expect(onTermine).not.toHaveBeenCalled()
  })

  it('en vue devineur, cliquer un allié marque un point', () => {
    const onTermine = vi.fn()
    render(<Codename grilleInitiale={grille} onTermine={onTermine} />)
    versDevineur()
    fireEvent.click(screen.getByRole('button', { name: /ÉTOILE/ }))
    expect(onTermine).toHaveBeenCalledWith(1, 2)
  })

  it('l’annonceur voit les cartes déjà testées par le devineur', () => {
    render(<Codename grilleInitiale={grille} onTermine={() => {}} />)
    versDevineur()
    fireEvent.click(screen.getByRole('button', { name: /ÉTOILE/ })) // devineur teste une carte
    versAnnonceur()
    expect(screen.getAllByTestId('codename-teste')).toHaveLength(1)
  })

  it('toucher le piège (vue devineur) termine le défi', () => {
    const onTermine = vi.fn()
    render(<Codename grilleInitiale={grille} onTermine={onTermine} />)
    versDevineur()
    fireEvent.click(screen.getByRole('button', { name: /VIRUS/ }))
    expect(screen.getByTestId('codename-fin')).toBeInTheDocument()
    expect(onTermine).toHaveBeenLastCalledWith(0, 2)
  })
})
