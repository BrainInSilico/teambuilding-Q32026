import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Jauge from './Jauge.jsx'

const menace = { id: 'arcade', nom: 'Surcharge', registre: 'réflexe', niveau: 65, gelee: false }

describe('Jauge', () => {
  it('affiche le nom et le niveau', () => {
    render(<Jauge menace={menace} />)
    expect(screen.getByText('Surcharge')).toBeInTheDocument()
    expect(screen.getByText(/65/)).toBeInTheDocument()
  })

  it('dimensionne la barre à niveau %', () => {
    render(<Jauge menace={menace} />)
    const barre = screen.getByTestId('jauge-barre-arcade')
    expect(barre).toHaveStyle({ width: '65%' })
  })

  it('applique la classe de palette (tension à 65)', () => {
    render(<Jauge menace={menace} />)
    expect(screen.getByTestId('jauge-arcade').className).toMatch(/tension/)
  })

  it('marque visuellement une menace gelée', () => {
    render(<Jauge menace={{ ...menace, gelee: true }} />)
    expect(screen.getByText(/gel/i)).toBeInTheDocument()
  })
})
