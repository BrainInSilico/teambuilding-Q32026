import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import Realisation from './Realisation.jsx'
import { enregistrerDefi } from './defis/registre.js'

describe('Realisation v3 (pages dédiées)', () => {
  it('défi manuel : saisie du score, transmis au valider', () => {
    const onValider = vi.fn()
    render(<Realisation menaces={[{ id: 'bowling', nom: 'Instabilité' }]} assignation={{}} onValider={onValider} />)
    fireEvent.change(screen.getByTestId('res-x-bowling'), { target: { value: '7' } })
    fireEvent.click(screen.getByRole('button', { name: /valider les résultats/i }))
    expect(onValider.mock.calls[0][0].bowling.x).toBe(7)
  })

  it('défi digital : lien vers la page dédiée + saisie manuelle du score reporté', () => {
    enregistrerDefi('arcade', { Composant: () => null, n: 5 })
    render(<Realisation menaces={[{ id: 'arcade', nom: 'Surcharge' }]} assignation={{}} onValider={() => {}} />)
    const ligne = screen.getByTestId('defi-arcade')
    const lien = within(ligne).getByRole('link', { name: /ouvrir le défi/i })
    expect(lien).toHaveAttribute('href', '#/defi/arcade')
    expect(within(ligne).getByTestId('res-x-arcade')).toBeInTheDocument()
  })
})
