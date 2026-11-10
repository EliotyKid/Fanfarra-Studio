'use client'
// Web Audio sample player: one buffer list (velocity layers) per instrument + FPC key.
let ctx = null
let master = null
const buffers = new Map()

function ensure() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.connect(ctx.destination)
  }
  return ctx
}

export const now = () => ensure().currentTime
export const resume = () => { if (ensure().state === 'suspended') ctx.resume() }

export async function load(instrumentos) {
  ensure()
  const jobs = []
  for (const [inst, keys] of Object.entries(instrumentos)) {
    for (const [key, { samples }] of Object.entries(keys)) {
      jobs.push(Promise.all(samples.map(async (s) => {
        const r = await fetch('/' + s)
        if (!r.ok) throw new Error('Sample não encontrado: ' + s)
        return ctx.decodeAudioData(await r.arrayBuffer())
      })).then((layers) => buffers.set(inst + ':' + key, layers)))
    }
  }
  await Promise.all(jobs)
}

export function play(inst, key, vel, when) {
  const layers = buffers.get(inst + ':' + key)
  if (!ctx || !layers || !layers.length) return
  // shortcut: assumes the FPC splits velocity evenly across layers, softest first; read the real ranges from the FPC blob if accents sound off
  const buf = layers[Math.min(layers.length - 1, Math.floor((vel / 128) * layers.length))]
  const src = ctx.createBufferSource()
  const g = ctx.createGain()
  src.buffer = buf
  g.gain.value = vel / 127
  src.connect(g)
  g.connect(master)
  src.start(Math.max(when ?? 0, ctx.currentTime))
}

export function setVolume(v) {
  ensure()
  master.gain.setTargetAtTime(v, ctx.currentTime, 0.02)
}

// Metronome click, synthesized (no sample): short sine blip, higher and louder on beat 1.
export function click(accent, when) {
  if (!ctx) return
  const t = Math.max(when ?? 0, ctx.currentTime)
  const o = ctx.createOscillator(), g = ctx.createGain()
  o.frequency.value = accent ? 1760 : 1320
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(accent ? 0.6 : 0.35, t + 0.002)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
  o.connect(g)
  g.connect(master)
  o.start(t)
  o.stop(t + 0.06)
}
