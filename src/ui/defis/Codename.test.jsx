import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Codename from './Codename.jsx'

// 2 alliés (0,1), 1 assassin (2), 1 neutre (3) → budget = 1 coup.
const grille = [
  { mot: 'ALLIEA', role: 'allie' },
  { mot: 'ALLIEB', role: 'allie' },
  { mot: 'TUEUR', role: 'piege' },
  { mot: 'NEUTRE', role: 'neutre' },
]

const lancer = (n) => {
  fireEvent.change(screen.getByTestId('codename-nombre'), { target: { value: String(n) } })
  fireEvent.click(screen.getByRole('button', { name: /lancer le coup/i }))
}
const versAnnonceur = () => fireEvent.click(screen.getByRole('button', { name: /côté annonceur/i }))

describe('Codename — coups (mot + nombre)', () => {
  it('démarre en vue annonceur (rôles visibles)', () => {
    render(<Codename grilleInitiale={grille} onTermine={() => {}} />)
    expect(screen.getByTestId('codename-mode')).toHaveTextContent(/annonceur/i)
  })

  it('lancer un coint à 2 puis trouver les 2 alliés = gagné', () => {
    const onTermine = vi.fn()
    render(<Codename grilleInitiale={grille} onTermine={onTermine} />)
    lancer(2)
    fireEvent.click(screen.getByRole('button', { name: /ALLIEA/ }))
    fireEvent.click(screen.getByRole('button', { name: /ALLIEB/ }))
    expect(onTermine).toHaveBeenLastCalledWith(2, 2)
    expect(screen.getByTestId('codename-fin')).toHaveTextContent(/gagn/i)
  })

  it('retourner l’assassin = game over', () => {
    const onTermine = vi.fn()
    render(<Codename grilleInitiale={grille} onTermine={onTermine} />)
    lancer(1)
    fireEvent.click(screen.getByRole('button', { name: /TUEUR/ }))
    expect(screen.getByTestId('codename-fin')).toHaveTextContent(/assassin|perdu|game over/i)
  })

  it('l’annonceur voit les cartes déjà testées par le devineur', () => {
    render(<Codename grilleInitiale={grille} onTermine={() => {}} />)
    lancer(2)
    fireEvent.click(screen.getByRole('button', { name: /ALLIEA/ })) // testée
    versAnnonceur()
    expect(screen.getAllByTestId('codename-teste').length).toBeGreaterThanOrEqual(1)
  })
})
