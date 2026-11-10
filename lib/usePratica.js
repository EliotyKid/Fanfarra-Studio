'use client'
// Practice options shared by the player and the editor: loop part of the toque (trecho), metronome, count-in.
import { useState } from 'react'

export function usePratica() {
  const [trecho, setTrecho] = useState(null) // [firstBar, lastBar] (0-based) or null = whole toque
  const [metro, setMetro] = useState(false)
  const [countIn, setCountIn] = useState(false)
  return { trecho, setTrecho, metro, setMetro, countIn, setCountIn }
}

// Engine range in steps, clamped to the toque's current length (bars can be removed in the editor).
export function rangeOf(trecho, spb, bars) {
  if (!trecho) return null
  const b0 = Math.min(trecho[0], bars - 1), b1 = Math.min(trecho[1], bars - 1)
  return [b0 * spb, (b1 + 1) * spb]
}
