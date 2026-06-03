// RNG pseudo-aléatoire déterministe seedable (mulberry32).
// Même seed → même suite : indispensable pour tests et rejouabilité du run à blanc.
export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Contraint v dans [lo, hi].
export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v))
}

// Float dans [lo, hi) tiré du rng fourni.
export function between(rng, lo, hi) {
  return lo + rng() * (hi - lo)
}
