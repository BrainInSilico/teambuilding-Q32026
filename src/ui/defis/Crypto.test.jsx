import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Crypto from './Crypto.jsx'

const paliers = [
  { clair: 'SOLEIL', chiffre: 'VROHLO', indice: 'César 3' },
  { clair: 'LUNE', chiffre: 'ENUL', indice: '' },
]

describe('Crypto (composant)', () => {
  it('affiche le chiffré du palier courant', () => {
    render(<Crypto paliersInitiaux={paliers} onTermine={() => {}} />)
    expect(screen.getByText('VROHLO')).toBeInTheDocument()
  })

  it('une bonne réponse fait progresser et rapporte le score', () => {
    const onTermine = vi.fn()
    render(<Crypto paliersInitiaux={paliers} onTermine={onTermine} />)
    fireEvent.change(screen.getByTestId('crypto-saisie'), { target: { value: 'soleil' } })
    fireEvent.click(screen.getByRole('button', { name: /vérifier/i }))
    expect(onTermine).toHaveBeenCalledWith(1, 2)
    // passe au palier suivant
    expect(screen.getByText('ENUL')).toBeInTheDocument()
  })

  it('une mauvaise réponse n’avance pas', () => {
    const onTermine = vi.fn()
    render(<Crypto paliersInitiaux={paliers} onTermine={onTermine} />)
    fireEvent.change(screen.getByTestId('crypto-saisie'), { target: { value: 'faux' } })
    fireEvent.click(screen.getByRole('button', { name: /vérifier/i }))
    expect(screen.getByText('VROHLO')).toBeInTheDocument()
    expect(onTermine).not.toHaveBeenCalledWith(1, 2)
  })
})
