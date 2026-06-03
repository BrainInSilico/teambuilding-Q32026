import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('outillage UI', () => {
  it('rend un composant React dans jsdom', () => {
    render(<div>plateau</div>)
    expect(screen.getByText('plateau')).toBeDefined()
  })
})
