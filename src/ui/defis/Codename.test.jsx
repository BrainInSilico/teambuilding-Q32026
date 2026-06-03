import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Codename from './Codename.jsx'

const grille = [
  { mot: 'ÉTOILE', role: 'allie' },
  { mot: 'VIRUS', role: 'piege' },
  { mot: 'CODE', role: 'neutre' },
  { mot: 'PHARE', role: 'allie' },
]

describe('Codename (composant)', () => {
  it('révéler un allié marque un point', () => {
    const onTermine = vi.fn()
    render(<Codename grilleInitiale={grille} onTermine={onTermine} />)
    fireEvent.click(screen.getByRole('button', { name: /ÉTOILE/ }))
    expect(onTermine).toHaveBeenCalledWith(1, 2) // 2 alliés au total
  })

  it('toucher le piège termine le défi', () => {
    const onTermine = vi.fn()
    render(<Codename grilleInitiale={grille} onTermine={onTermine} />)
    fireEvent.click(screen.getByRole('button', { name: /VIRUS/ }))
    expect(screen.getByTestId('codename-fin')).toBeInTheDocument()
    expect(onTermine).toHaveBeenLastCalledWith(0, 2)
  })

  it('un mot déjà révélé ne se reclique pas', () => {
    const onTermine = vi.fn()
    render(<Codename grilleInitiale={grille} onTermine={onTermine} />)
    const etoile = screen.getByRole('button', { name: /ÉTOILE/ })
    fireEvent.click(etoile)
    fireEvent.click(etoile)
    expect(onTermine).toHaveBeenCalledTimes(1)
  })
})
