'use client'
// Practice options shared by the player and the editor: loop part of the toque (trecho), metronome, count-in,
// tempo ramp (start slower, speed up a bit every time the toque or trecho loops).
import { useEffect, useRef, useState } from 'react'

export const RAMPA_PASSO = 5 // BPM added per loop
export const rampaInicio = (bpm) => Math.max(40, Math.round((bpm * 0.75) / 5) * 5)

export function usePratica() {
  const [trecho, setTrecho] = useState(null) // [firstBar, lastBar] (0-based) or null = whole toque
  const [metro, setMetro] = useState(false)
  const [countIn, setCountIn] = useState(false)
  const [rampa, setRampa] = useState(null) // tempo the ramp is at now, or null = off
  return { trecho, setTrecho, metro, setMetro, countIn, setCountIn, rampa, setRampa }
}

// Tempo to play at: the ramp's while it is on, else the chosen one.
export const bpmDe = (pr, bpm) => pr.rampa ?? bpm

// Call after the engine: each loop (playhead jumps back) adds RAMPA_PASSO until the chosen tempo.
// Choosing another tempo restarts the ramp from 75% of it.
export function useRampa(pr, bpm, pos, playing) {
  const prev = useRef(pos)
  useEffect(() => {
    if (pr.rampa !== null && playing && pos < prev.current) pr.setRampa((r) => (r === null ? null : Math.min(bpm, r + RAMPA_PASSO)))
    prev.current = pos
  }, [pos]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (pr.rampa !== null) pr.setRampa(rampaInicio(bpm)) }, [bpm]) // eslint-disable-line react-hooks/exhaustive-deps
}

// Engine range in steps, clamped to the toque's current length (bars can be removed in the editor).
export function rangeOf(trecho, spb, bars) {
  if (!trecho) return null
  const b0 = Math.min(trecho[0], bars - 1), b1 = Math.min(trecho[1], bars - 1)
  return [b0 * spb, (b1 + 1) * spb]
}
