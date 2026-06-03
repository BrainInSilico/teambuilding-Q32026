import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Codename from './Codename.jsx'

const grille = [
  { mot: 'ÉTOILE', role: 'allie' },
  { mot: 'VIRUS', role: 'piege' },
  { mot: 'CODE', role: 'neutre' },
  { mot: 'PHARE', role: 'allie' },
]

// Le donneur voit les rôles puis transmet l'indice aux devineurs.
function passerEnDevineur() {
  fireEvent.click(screen.getByRole('button', { name: /transmettre/i }))
}

describe('Codename (flux 2 joueurs)', () => {
  it('démarre en mode donneur : rôles visibles + saisie d’indice', () => {
    render(<Codename grilleInitiale={grille} onTermine={() => {}} />)
    expect(screen.getByTestId('codename-mode')).toHaveTextContent(/donneur/i)
    expect(screen.getByTestId('codename-indice')).toBeInTheDocument()
  })

  it('après transmission, les devineurs marquent en cliquant un allié', () => {
    const onTermine = vi.fn()
    render(<Codename grilleInitiale={grille} onTermine={onTermine} />)
    passerEnDevineur()
    fireEvent.click(screen.getByRole('button', { name: /ÉTOILE/ }))
    expect(onTermine).toHaveBeenCalledWith(1, 2)
  })

  it('toucher le piège termine le défi', () => {
    const onTermine = vi.fn()
    render(<Codename grilleInitiale={grille} onTermine={onTermine} />)
    passerEnDevineur()
    fireEvent.click(screen.getByRole('button', { name: /VIRUS/ }))
    expect(screen.getByTestId('codename-fin')).toBeInTheDocument()
    expect(onTermine).toHaveBeenLastCalledWith(0, 2)
  })

  it('en mode donneur, cliquer un mot ne marque pas (il donne l’indice à l’oral)', () => {
    const onTermine = vi.fn()
    render(<Codename grilleInitiale={grille} onTermine={onTermine} />)
    fireEvent.click(screen.getByRole('button', { name: /ÉTOILE/ }))
    expect(onTermine).not.toHaveBeenCalled()
  })
})
