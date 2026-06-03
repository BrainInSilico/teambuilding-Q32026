import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Realisation from './Realisation.jsx'
import { enregistrerDefi } from './defis/registre.js'

const menaces = [
  { id: 'bowling', nom: 'Instabilité' },
  { id: 'arcade', nom: 'Surcharge' },
]

describe('Realisation v2', () => {
  it('défi manuel : saisie du score, transmis au valider', () => {
    const onValider = vi.fn()
    render(<Realisation menaces={[menaces[0]]} assignation={{}} onValider={onValider} />)
    fireEvent.change(screen.getByTestId('res-x-bowling'), { target: { value: '7' } })
    fireEvent.click(screen.getByRole('button', { name: /valider les résultats/i }))
    expect(onValider.mock.calls[0][0].bowling.x).toBe(7)
  })

  it('défi digital : le composant rapporte (x, n) via onTermine', () => {
    const Faux = ({ onTermine }) => (
      <button onClick={() => onTermine(3, 5)}>jouer-arcade</button>
    )
    enregistrerDefi('arcade', { Composant: Faux, n: 5 })

    const onValider = vi.fn()
    render(<Realisation menaces={[menaces[1]]} assignation={{}} onValider={onValider} />)
    fireEvent.click(screen.getByRole('button', { name: 'jouer-arcade' }))
    fireEvent.click(screen.getByRole('button', { name: /valider les résultats/i }))
    expect(onValider.mock.calls[0][0].arcade).toEqual({ x: 3, n: 5 })
  })
})
