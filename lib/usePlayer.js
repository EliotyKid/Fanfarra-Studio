'use client'
// Toques player state: which official toque, tempo and loop, on top of the shared engine.
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { encodeToque } from './link'
import { fromOfficial } from './meusToques'
import { bpmOptions, useEngine } from './useEngine'
import { bpmDe, rangeOf, usePratica, useRampa } from './usePratica'

export { useSpaceToPlay } from './useEngine'

export function usePlayer(toques, instrumentos) {
  const router = useRouter()
  const [idx, setIdx] = useState(0)
  const toque = toques[idx]
  const [bpm, setBpm] = useState(toque.bpm)
  const [loop, setLoop] = useState(true)
  const total = toque.compassos * toque.spb
  const pr = usePratica()
  const e = useEngine({
    rawTracks: toque.tracks, total, bpm: bpmDe(pr, bpm), perBeat: toque.stepsPerBeat, loop, instrumentos,
    range: rangeOf(pr.trecho, toque.spb, toque.compassos), metro: pr.metro, countIn: pr.countIn,
    beatsPerBar: toque.spb / toque.stepsPerBeat,
  })
  useRampa(pr, bpm, e.pos, e.playing)

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
    // Opens a copy of this official toque in the editor (same path as a shared link: #t=...).
    criarCopia: async () => router.push('/criar/#t=' + (await encodeToque(fromOfficial(toque, instrumentos)))),
    prev: () => loadToque(idx - 1),
    next: () => loadToque(idx + 1),
  }
}
