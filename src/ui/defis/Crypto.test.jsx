import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Crypto from './Crypto.jsx'

const paliers = [
  { clair: 'SOLEIL', chiffre: 'VROHLO', famille: 'Décalage d’alphabet (type César)', crib: 'S' },
  { clair: 'LUNE', chiffre: 'ENUL', famille: 'Texte renversé', crib: 'L' },
]

describe('Crypto (composant)', () => {
  it('affiche le chiffré du palier courant', () => {
    render(<Crypto paliersInitiaux={paliers} onTermine={() => {}} />)
    expect(screen.getByText('VROHLO')).toBeInTheDocument()
  })

  it('affiche l’aide : famille + lettre crib', () => {
    render(<Crypto paliersInitiaux={paliers} onTermine={() => {}} />)
    expect(screen.getByText(/césar/i)).toBeInTheDocument()
    expect(screen.getByTestId('crypto-crib')).toHaveTextContent('S')
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
