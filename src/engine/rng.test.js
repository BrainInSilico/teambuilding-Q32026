import { describe, it, expect } from 'vitest'
import { mulberry32, between, clamp } from './rng.js'

describe('mulberry32', () => {
  it('produit des floats dans [0,1)', () => {
    const rng = mulberry32(42)
    for (let i = 0; i < 1000; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('est déterministe : même seed → même suite', () => {
    const a = mulberry32(123)
    const b = mulberry32(123)
    const suiteA = [a(), a(), a(), a(), a()]
    const suiteB = [b(), b(), b(), b(), b()]
    expect(suiteA).toEqual(suiteB)
  })

  it('seeds différents → suites différentes', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    const suiteA = [a(), a(), a()]
    const suiteB = [b(), b(), b()]
    expect(suiteA).not.toEqual(suiteB)
  })
})

describe('clamp', () => {
  it('laisse une valeur dans les bornes inchangée', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
  it('ramène au plancher', () => {
    expect(clamp(-3, 0, 10)).toBe(0)
  })
  it('ramène au plafond', () => {
    expect(clamp(42, 0, 10)).toBe(10)
  })
})

describe('between', () => {
  it('renvoie une valeur dans [lo, hi)', () => {
    const rng = mulberry32(7)
    for (let i = 0; i < 1000; i++) {
      const v = between(rng, 10, 20)
      expect(v).toBeGreaterThanOrEqual(10)
      expect(v).toBeLessThan(20)
    }
  })
  it('est déterministe avec le même rng seedé', () => {
    expect(between(mulberry32(99), 0, 100)).toBe(between(mulberry32(99), 0, 100))
  })
})
