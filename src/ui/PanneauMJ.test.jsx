import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import PanneauMJ from './PanneauMJ.jsx'

const menaces = [
  { id: 'arcade', nom: 'Surcharge', niveau: 50 },
  { id: 'tour', nom: 'Effondrement', niveau: 30 },
]

function ouvrir() {
  fireEvent.click(screen.getByRole('button', { name: /mode mj/i }))
}

describe('PanneauMJ', () => {
  it('est replié par défaut', () => {
    render(<PanneauMJ menaces={menaces} integrite={100} onAjusterMenace={() => {}} onAjusterIntegrite={() => {}} />)
    expect(screen.queryByTestId('mj-corps')).toBeNull()
  })

  it('s’ouvre et affiche un contrôle par menace + intégrité', () => {
    render(<PanneauMJ menaces={menaces} integrite={100} onAjusterMenace={() => {}} onAjusterIntegrite={() => {}} />)
    ouvrir()
    expect(screen.getByTestId('mj-menace-arcade')).toBeInTheDocument()
    expect(screen.getByTestId('mj-menace-tour')).toBeInTheDocument()
    expect(screen.getByTestId('mj-integrite')).toBeInTheDocument()
  })

  it('ajuste une menace avec un delta', () => {
    const onAjusterMenace = vi.fn()
    render(<PanneauMJ menaces={menaces} integrite={100} onAjusterMenace={onAjusterMenace} onAjusterIntegrite={() => {}} />)
    ouvrir()
    fireEvent.click(within(screen.getByTestId('mj-menace-arcade')).getByRole('button', { name: '−10' }))
    expect(onAjusterMenace).toHaveBeenCalledWith('arcade', -10)
  })

  it('ajuste l’intégrité avec un delta', () => {
    const onAjusterIntegrite = vi.fn()
    render(<PanneauMJ menaces={menaces} integrite={100} onAjusterMenace={() => {}} onAjusterIntegrite={onAjusterIntegrite} />)
    ouvrir()
    fireEvent.click(within(screen.getByTestId('mj-integrite')).getByRole('button', { name: '−10' }))
    expect(onAjusterIntegrite).toHaveBeenCalledWith(-10)
  })
})
