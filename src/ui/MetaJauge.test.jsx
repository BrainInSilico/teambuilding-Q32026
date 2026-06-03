import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MetaJauge from './MetaJauge.jsx'

describe('MetaJauge (Intégrité système)', () => {
  it('affiche la valeur', () => {
    render(<MetaJauge integrite={72} ligneSurvie={50} />)
    expect(screen.getByText(/72/)).toBeInTheDocument()
  })

  it('dimensionne la barre à la valeur %', () => {
    render(<MetaJauge integrite={72} ligneSurvie={50} />)
    expect(screen.getByTestId('integrite-barre')).toHaveStyle({ width: '72%' })
  })

  it('place un repère de ligne de survie', () => {
    render(<MetaJauge integrite={72} ligneSurvie={50} />)
    expect(screen.getByTestId('integrite-ligne')).toHaveStyle({ left: '50%' })
  })

  it('marque le danger sous la ligne de survie', () => {
    render(<MetaJauge integrite={30} ligneSurvie={50} />)
    expect(screen.getByTestId('integrite').className).toMatch(/danger/)
  })

  it('pas de danger au-dessus de la ligne', () => {
    render(<MetaJauge integrite={80} ligneSurvie={50} />)
    expect(screen.getByTestId('integrite').className).not.toMatch(/danger/)
  })
})
