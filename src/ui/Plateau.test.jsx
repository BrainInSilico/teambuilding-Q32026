import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Plateau from './Plateau.jsx'
import { nouvellePartie, vuePublique } from '../engine/index.js'

const vue = vuePublique(nouvellePartie(42))

describe('Plateau', () => {
  it('rend exactement 5 jauges de menace', () => {
    render(<Plateau vue={vue} />)
    // exclut les testid internes "jauge-barre-*"
    expect(screen.getAllByTestId(/^jauge-(?!barre-)/)).toHaveLength(5)
  })

  it('affiche le tour et la phase', () => {
    render(<Plateau vue={vue} />)
    expect(screen.getByText(/tour/i)).toBeInTheDocument()
    expect(screen.getByText(/montée des menaces/i)).toBeInTheDocument()
  })

  it('affiche la méta-jauge Intégrité', () => {
    render(<Plateau vue={vue} />)
    expect(screen.getByTestId('integrite')).toBeInTheDocument()
  })

  it('montre le bandeau événement seulement si présent', () => {
    const { rerender } = render(<Plateau vue={vue} />)
    expect(screen.queryByTestId('bandeau-evenement')).toBeNull()
    rerender(<Plateau vue={{ ...vue, evenement: { id: 'surtension', libelle: 'Surtension !' } }} />)
    expect(screen.getByTestId('bandeau-evenement')).toHaveTextContent('Surtension !')
  })

  it('ne laisse fuiter aucune valeur cachée dans le DOM', () => {
    const { container } = render(<Plateau vue={vue} />)
    const html = container.innerHTML
    for (const interdit of ['vitesse', 'seuilT', 'seed', 'etape']) {
      expect(html).not.toContain(interdit)
    }
  })
})
