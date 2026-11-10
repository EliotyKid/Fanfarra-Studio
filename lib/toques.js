// Build-time loader: public/toques/manifest.json + MIDI files -> step grids for the player.
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { Midi } from '@tonejs/midi'
import { rowMeta, sortRows } from './kit.js'

const PUBLIC = path.join(process.cwd(), 'public')
// Grid per quarter note, first one that fits every note exactly: 16ths, then triplets, sextuplets,
// 32nds, triplets + 16ths together, 64ths, sextuplets + 32nds. Nothing fits: 16ths, snapping.
const GRADES = [4, 3, 6, 8, 12, 16, 24]

export async function loadInstrumentos() {
  return JSON.parse(await readFile(path.join(PUBLIC, 'toques/manifest.json'), 'utf8')).instrumentos
}

export async function loadToques() {
  const manifest = JSON.parse(await readFile(path.join(PUBLIC, 'toques/manifest.json'), 'utf8'))
  const toques = await Promise.all(manifest.toques.map(async (t) => {
    const midi = new Midi(await readFile(path.join(PUBLIC, t.arquivo)))
    const [num, den] = t.compasso.split('/').map(Number)
    const ppq = midi.header.ppq
    const ticks = midi.tracks.flatMap((tr) => tr.notes.map((n) => n.ticks))
    const grade = GRADES.find((g) => ppq % g === 0 && ticks.every((tk) => tk % (ppq / g) === 0)) ?? 4
    const stepTicks = ppq / grade
    const spb = (num * grade * 4) / den
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
          // Only snaps when no grade fitted (notes off any musical grid).
          const i = Math.round(n.ticks / stepTicks)
          if (i < total) (steps[i] ??= []).push([n.midi, Math.round(n.velocity * 127)])
        }
        return { ...rowMeta(tr.name, key, pads), steps }
      })
    })
    return { ...t, spb, stepsPerBeat: (grade * 4) / den, tracks: sortRows(tracks) }
  }))
  return { toques, instrumentos: manifest.instrumentos }
}
