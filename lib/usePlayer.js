'use client'
// Toques player state: which official toque, tempo and loop, on top of the shared engine.
import { useState } from 'react'
import { bpmOptions, useEngine } from './useEngine'
import { rangeOf, usePratica } from './usePratica'

export { useSpaceToPlay } from './useEngine'

export function usePlayer(toques, instrumentos) {
  const [idx, setIdx] = useState(0)
  const toque = toques[idx]
  const [bpm, setBpm] = useState(toque.bpm)
  const [loop, setLoop] = useState(true)
  const total = toque.compassos * toque.spb
  const pr = usePratica()
  const e = useEngine({
    rawTracks: toque.tracks, total, bpm, perBeat: toque.stepsPerBeat, loop, instrumentos,
    range: rangeOf(pr.trecho, toque.spb, toque.compassos), metro: pr.metro, countIn: pr.countIn,
    beatsPerBar: toque.spb / toque.stepsPerBeat,
  })

  const loadToque = (i) => {
    const n = (i + toques.length) % toques.length
    setIdx(n); setBpm(toques[n].bpm); pr.setTrecho(null); e.resetPos()
  }

  return {
    ...e, pr, toque, toques, idx, bpm, loop, total,
    bpmOptions: bpmOptions(toque.bpm),
    toqueOptions: toques.map((t, i) => ({ value: i, label: t.nome })),
    setBpm, setLoop,
    setToque: loadToque,
    prev: () => loadToque(idx - 1),
    next: () => loadToque(idx + 1),
  }
}
