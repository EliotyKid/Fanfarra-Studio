'use client'
// Shared playback engine: samples, look-ahead Web Audio scheduler, volume, mute/solo.
// Used by the Toques player and the Criar editor. Steps are 16th notes.
import { useEffect, useRef, useState } from 'react'
import * as A from './audio'

export const MAX_BPM = 240
export const bpmOptions = (orig) =>
  [...new Set([...Array.from({ length: (MAX_BPM - 60) / 10 + 1 }, (_, i) => 60 + i * 10), orig])]
    .sort((a, b) => a - b)
    .map((v) => ({ value: v, label: v + ' BPM' }))

// rawTracks: [{ id, inst, name, color, steps: (null | [[key, vel], ...])[] }]
export function useEngine({ rawTracks, total, bpm, loop, instrumentos }) {
  const [mix, setMix] = useState({}) // row id -> { muted, soloed }
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [muted, setMuted] = useState(false)
  const [pos, setPos] = useState(0)
  const [status, setStatus] = useState('loading')

  const anySolo = rawTracks.some((t) => mix[t.id]?.soloed)
  const tracks = rawTracks.map((t) => {
    const m = mix[t.id] || {}
    return { ...t, muted: !!m.muted, soloed: !!m.soloed, silenced: anySolo && !m.soloed }
  })

  const live = useRef({})
  live.current = { tracks, total, loop, pos }
  const eng = useRef({ anchorPos: 0, anchorTime: 0, stepDur: 60 / bpm / 4, nextAbs: 0 })
  const posAt = (t) => eng.current.anchorPos + (t - eng.current.anchorTime) / eng.current.stepDur

  useEffect(() => {
    A.load(instrumentos).then(() => setStatus('ready'), (e) => { console.error(e); setStatus('error') })
  }, [instrumentos])

  useEffect(() => {
    const e = eng.current, t = A.now()
    if (playing) { e.anchorPos = posAt(t); e.anchorTime = t }
    e.stepDur = 60 / bpm / 4
  }, [bpm]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { A.setVolume(muted ? 0 : volume / 100) }, [volume, muted])

  // Keep the phone screen on while a toque plays (practice without touching the phone). HTTPS-only API.
  useEffect(() => {
    if (!playing || !navigator.wakeLock) return
    let lock = null, done = false
    navigator.wakeLock.request('screen').then((l) => { if (done) l.release(); else lock = l }, () => {})
    return () => { done = true; lock?.release() }
  }, [playing])

  useEffect(() => {
    if (!playing || loop) return
    const e = eng.current, k = Math.floor(posAt(A.now()) / total) * total
    e.anchorPos -= k; e.nextAbs -= k
  }, [loop]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!playing) return
    A.resume()
    const e = eng.current
    e.anchorTime = A.now() + 0.05; e.anchorPos = live.current.pos; e.nextAbs = Math.ceil(e.anchorPos - 1e-6)
    const sched = () => {
      const now = A.now(), L = live.current
      for (;;) {
        const tt = e.anchorTime + (e.nextAbs - e.anchorPos) * e.stepDur
        if (tt > now + 0.12 || (!L.loop && e.nextAbs >= L.total)) break
        const st = e.nextAbs % L.total
        if (tt >= now - 0.03) {
          for (const tr of L.tracks) {
            if (tr.muted || tr.silenced || !tr.steps[st]) continue
            for (const [key, vel] of tr.steps[st]) A.play(tr.inst, key, vel, tt)
          }
        }
        e.nextAbs++
      }
    }
    sched()
    const iv = setInterval(sched, 25)
    let raf
    const tick = () => {
      const L = live.current, p = Math.max(0, posAt(A.now()))
      if (!L.loop && p >= L.total) { setPlaying(false); setPos(0); return }
      setPos(p % L.total)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { clearInterval(iv); cancelAnimationFrame(raf) }
  }, [playing]) // eslint-disable-line react-hooks/exhaustive-deps

  const setMixFor = (id, patch) => setMix((m) => ({ ...m, [id]: { ...m[id], ...patch } }))

  return {
    tracks, playing, pos, status, volume, muted,
    setVolume, setMuted,
    setPlaying: (p) => { A.resume(); setPlaying(p) },
    togglePlay: () => { A.resume(); setPlaying((p) => !p) },
    // Jump to a step; while playing, scheduling restarts from there right away.
    seek: (step) => {
      const s = Math.max(0, Math.min(total - 1, step))
      if (playing) {
        const e = eng.current
        e.anchorPos = s; e.anchorTime = A.now() + 0.02; e.nextAbs = s
      }
      live.current.pos = s
      setPos(s)
    },
    resetPos: () => {
      const e = eng.current
      e.anchorPos = 0; e.anchorTime = A.now() + 0.05; e.nextAbs = 0
      setPos(0); live.current.pos = 0
    },
    // Plays the hits at step i of a row, or `hits` when given (e.g. a note just added).
    audition: (id, i, hits) => {
      const tr = tracks.find((t) => t.id === id)
      const h = hits || (tr && tr.steps[i])
      if (!tr || !h) return
      A.resume()
      for (const [key, vel] of h) A.play(tr.inst, key, vel)
    },
    toggleMute: (id, m) => setMixFor(id, { muted: m }),
    toggleSolo: (id, s) => setMixFor(id, { soloed: s }),
  }
}

export function useSpaceToPlay(toggle) {
  const ref = useRef(toggle)
  ref.current = toggle
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' || e.repeat) return
      const el = e.target
      if (el.closest && el.closest('input,textarea,select,button,a,[role=slider],[role=listbox],[contenteditable=true]')) return
      e.preventDefault()
      ref.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
