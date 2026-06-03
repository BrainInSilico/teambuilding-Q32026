import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Root from './Root.jsx'

beforeEach(() => {
  window.location.hash = ''
})

describe('Root (routeur)', () => {
  it('hash vide → écran principal (Setup ARGOS)', () => {
    render(<Root />)
    expect(screen.getByRole('heading', { name: 'ARGOS' })).toBeInTheDocument()
  })

  it('#/defi/crypto → page de défi', () => {
    window.location.hash = '#/defi/crypto'
    render(<Root />)
    expect(screen.getByRole('link', { name: /écran principal/i })).toBeInTheDocument() // PageDefi
  })
})
