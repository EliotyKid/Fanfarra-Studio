// Build-time loader: public/toques/manifest.json + MIDI files -> step grids for the player.
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { Midi } from '@tonejs/midi'
import { rowMeta, sortRows } from './kit'

const PUBLIC = path.join(process.cwd(), 'public')
const STEPS_PER_BEAT = 4 // semicolcheias

export async function loadInstrumentos() {
  return JSON.parse(await readFile(path.join(PUBLIC, 'toques/manifest.json'), 'utf8')).instrumentos
}

export async function loadToques() {
  const manifest = JSON.parse(await readFile(path.join(PUBLIC, 'toques/manifest.json'), 'utf8'))
  const toques = await Promise.all(manifest.toques.map(async (t) => {
    const midi = new Midi(await readFile(path.join(PUBLIC, t.arquivo)))
    const [num, den] = t.compasso.split('/').map(Number)
    const stepTicks = midi.header.ppq / STEPS_PER_BEAT
    const spb = (num * STEPS_PER_BEAT * 4) / den
    const total = t.compassos * spb
    const tracks = midi.tracks.filter((tr) => tr.notes.length).flatMap((tr) => {
      const pads = manifest.instrumentos[tr.name] || {}
      // An instrument with several pads (Tarol: pele + aro) gets one row per pad, so students see where to hit.
      const used = [...new Set(tr.notes.map((n) => n.midi))].sort((a, b) => b - a)
      const rows = used.length > 1 ? used : [null]
      return rows.map((key) => {
        const steps = Array(total).fill(null) // step -> [[key, velocity], ...] or null
        for (const n of tr.notes) {
          if (key !== null && n.midi !== key) continue
          // shortcut: snaps to the 16th grid; switch to tick-based timing if toques ever use triplets
          const i = Math.round(n.ticks / stepTicks)
          if (i < total) (steps[i] ??= []).push([n.midi, Math.round(n.velocity * 127)])
        }
        return { ...rowMeta(tr.name, key, pads), steps }
      })
    })
    return { ...t, spb, stepsPerBeat: (STEPS_PER_BEAT * 4) / den, tracks: sortRows(tracks) }
  }))
  return { toques, instrumentos: manifest.instrumentos }
}
