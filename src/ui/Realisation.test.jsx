import { describe, it, expect, vi } from 'vitest'
import { act } from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import Realisation from './Realisation.jsx'
import { enregistrerDefi } from './defis/registre.js'
import * as pont from './pont.js'

describe('Realisation v3 (pages dédiées)', () => {
  it('défi manuel assigné : saisie du score, transmis au valider', () => {
    const onValider = vi.fn()
    render(
      <Realisation
        menaces={[{ id: 'bowling', nom: 'Instabilité' }]}
        assignation={{ bowling: ['A'] }}
        onValider={onValider}
      />,
    )
    fireEvent.change(screen.getByTestId('res-x-bowling'), { target: { value: '7' } })
    fireEvent.click(screen.getByRole('button', { name: /valider les résultats/i }))
    expect(onValider.mock.calls[0][0].bowling.x).toBe(7)
  })

  it('défi digital assigné : lien vers la page dédiée + saisie du score reporté', () => {
    enregistrerDefi('arcade', { Composant: () => null, n: 5 })
    render(
      <Realisation menaces={[{ id: 'arcade', nom: 'Surcharge' }]} assignation={{ arcade: ['A'] }} onValider={() => {}} />,
    )
    const ligne = screen.getByTestId('defi-arcade')
    expect(within(ligne).getByRole('link', { name: /ouvrir le défi/i })).toHaveAttribute('href', '#/defi/arcade')
    expect(within(ligne).getByTestId('res-x-arcade')).toBeInTheDocument()
  })

  it('n’affiche QUE les défis ayant au moins un joueur assigné', () => {
    render(
      <Realisation
        menaces={[
          { id: 'bowling', nom: 'Instabilité' },
          { id: 'tour', nom: 'Effondrement' },
        ]}
        assignation={{ bowling: ['A', 'B'] }} // tour non assigné
        onValider={() => {}}
      />,
    )
    expect(screen.getByTestId('defi-bowling')).toBeInTheDocument()
    expect(screen.queryByTestId('defi-tour')).toBeNull()
  })

  it('ne transmet que les résultats des défis assignés', () => {
    const onValider = vi.fn()
    render(
      <Realisation
        menaces={[
          { id: 'bowling', nom: 'Instabilité' },
          { id: 'tour', nom: 'Effondrement' },
        ]}
        assignation={{ bowling: ['A'] }}
        onValider={onValider}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /valider les résultats/i }))
    const resultats = onValider.mock.calls[0][0]
    expect(resultats.bowling).toBeDefined()
    expect(resultats.tour).toBeUndefined()
  })

  it('remplit automatiquement le score reçu via le pont (bouton Reporter)', () => {
    let cb
    vi.spyOn(pont, 'ecouterScores').mockImplementation((fn) => {
      cb = fn
      return () => {}
    })
    enregistrerDefi('arcade', { Composant: () => null, n: 28 })
    render(<Realisation menaces={[{ id: 'arcade', nom: 'Surcharge' }]} assignation={{ arcade: ['A'] }} onValider={() => {}} />)
    act(() => cb({ menaceId: 'arcade', x: 17, n: 28 }))
    expect(screen.getByTestId('res-x-arcade')).toHaveValue(17)
    pont.ecouterScores.mockRestore()
  })

  it('aucun défi assigné : message + valider possible (rien à saisir)', () => {
    const onValider = vi.fn()
    render(
      <Realisation menaces={[{ id: 'bowling', nom: 'Instabilité' }]} assignation={{}} onValider={onValider} />,
    )
    expect(screen.getByText(/aucun défi/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /valider/i }))
    expect(onValider).toHaveBeenCalledWith({})
  })
})
