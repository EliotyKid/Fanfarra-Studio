'use client'
// Shared playback engine: samples, look-ahead Web Audio scheduler, volume, mute/solo.
// Used by the Toques player and the Criar editor.
import { useEffect, useMemo, useRef, useState } from 'react'
import * as A from './audio'

export const MAX_BPM = 240
export const bpmOptions = (orig) =>
  [...new Set([...Array.from({ length: (MAX_BPM - 60) / 10 + 1 }, (_, i) => 60 + i * 10), orig])]
    .sort((a, b) => a - b)
    .map((v) => ({ value: v, label: v + ' BPM' }))

// rawTracks: [{ id, inst, name, color, steps: (null | [[key, vel], ...])[] }]
// perBeat: grid steps per beat (4 = 16ths, 3 = triplets, 8 = 32nds...); bpm counts beats.
// range: [startStep, endStep) to play/loop only part of the toque (null = whole toque).
// metro: click on every beat (accent on beat 1). countIn: one bar of clicks before playback starts.
export function useEngine({ rawTracks, total, bpm, perBeat = 4, loop, instrumentos, range = null, metro = false, countIn = false, beatsPerBar = 4 }) {
  const [mix, setMix] = useState({}) // row id -> { muted, soloed }
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [muted, setMuted] = useState(false)
  const [pos, setPos] = useState(0) // whole step: React re-renders once per step, not every frame
  const [counting, setCounting] = useState(false) // count-in clicks before the toque starts
  const phRef = useRef(null) // grid wrapper; its playhead is animated on the compositor while playing
  const [status, setStatus] = useState('loading')

  const tracks = useMemo(() => {
    const anySolo = rawTracks.some((t) => mix[t.id]?.soloed)
    return rawTracks.map((t) => {
      const m = mix[t.id] || {}
      return { ...t, muted: !!m.muted, soloed: !!m.soloed, silenced: anySolo && !m.soloed }
    })
  }, [rawTracks, mix])

  // The engine counts in "virtual" steps from the start of the range: step = rs + (v mod len).
  const rs = range ? range[0] : 0
  const len = (range ? range[1] : total) - rs
  const live = useRef({})
  live.current = { tracks, total, loop, pos, rs, len, metro, perBeat, spb: beatsPerBar * perBeat }
  const eng = useRef({ anchorPos: 0, anchorTime: 0, stepDur: 60 / bpm / perBeat, nextAbs: 0 })
  const posAt = (t) => eng.current.anchorPos + (t - eng.current.anchorTime) / eng.current.stepDur
  const restartAtRange = () => { const e = eng.current; e.anchorPos = 0; e.anchorTime = A.now() + 0.05; e.nextAbs = 0 }

  useEffect(() => {
    A.load(instrumentos).then(() => setStatus('ready'), (e) => { console.error(e); setStatus('error') })
  }, [instrumentos])

  // Tempo or grid change: re-anchor at the current point. Positions are counted in steps, so a new grid
  // (perBeat) rescales them to keep the same musical point.
  const prevPerBeat = useRef(perBeat)
  useEffect(() => {
    const e = eng.current, t = A.now(), k = perBeat / prevPerBeat.current
    if (playing) {
      e.anchorPos = posAt(t) * k; e.anchorTime = t
      if (k !== 1) e.nextAbs = Math.ceil(e.anchorPos - 1e-6)
    }
    e.stepDur = 60 / bpm / perBeat
    prevPerBeat.current = perBeat
  }, [bpm, perBeat]) // eslint-disable-line react-hooks/exhaustive-deps

  // New range: playing restarts at its start; stopped, the playhead moves into it.
  useEffect(() => {
    if (playing) restartAtRange()
    else if (pos < rs || pos >= rs + len) { live.current.pos = rs; setPos(rs) }
  }, [rs, len]) // eslint-disable-line react-hooks/exhaustive-deps

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
    const e = eng.current, k = Math.floor(Math.max(0, posAt(A.now())) / len) * len
    e.anchorPos -= k; e.nextAbs -= k
  }, [loop]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!playing) return
    A.resume()
    const e = eng.current, L0 = live.current, now0 = A.now()
    const p0 = L0.pos >= L0.rs && L0.pos < L0.rs + L0.len ? L0.pos - L0.rs : 0
    // Count-in: one bar of clicks first, then the toque starts on the next downbeat.
    const beat = e.stepDur * L0.perBeat, lead = countIn ? (L0.spb / L0.perBeat) * beat : 0
    for (let k = 0; countIn && k < L0.spb / L0.perBeat; k++) A.click(k === 0, now0 + 0.05 + k * beat)
    e.anchorTime = now0 + 0.05 + lead; e.anchorPos = p0; e.nextAbs = Math.ceil(p0 - 1e-6)
    const sched = () => {
      const now = A.now(), L = live.current
      for (;;) {
        const tt = e.anchorTime + (e.nextAbs - e.anchorPos) * e.stepDur
        // 200 ms look-ahead: notes are already queued in the audio thread when the page stalls briefly.
        if (tt > now + 0.2 || (!L.loop && e.nextAbs >= L.len)) break
        const st = L.rs + (((e.nextAbs % L.len) + L.len) % L.len)
        if (tt >= now - 0.03) {
          if (L.metro && st % L.perBeat === 0) A.click(st % L.spb === 0, tt)
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
    let raf, anim = null, animKey = ''
    // Playhead: a linear Web Animation across the range runs on the compositor, so moving it costs the
    // main thread nothing (moving it from JS every frame made the browser re-layer the whole grid).
    // Each frame only checks it against the audio clock and corrects drift, tempo, seek or range changes.
    const syncPlayhead = (p, L) => {
      const el = phRef.current?.querySelector('.fs-seq__playhead')
      if (!el) return
      const dur = L.len * e.stepDur * 1000, at = (Math.max(0, p) % L.len) * e.stepDur * 1000
      const key = L.rs + '/' + L.len + '/' + L.total
      if (!anim || anim.effect.target !== el || animKey !== key) {
        anim?.cancel()
        const x = (s) => ({ transform: `translateX(${(s / L.total) * 100}%)` })
        anim = el.animate([x(L.rs), x(L.rs + L.len)], { duration: dur, iterations: Infinity, easing: 'linear' })
        animKey = key
        anim.currentTime = at
      } else if (anim.effect.getTiming().duration !== dur) {
        anim.effect.updateTiming({ duration: dur })
        anim.currentTime = at
      } else if (Math.abs(((anim.currentTime % dur) + dur) % dur - at) > 30 && Math.abs(Math.abs(((anim.currentTime % dur) + dur) % dur - at) - dur) > 30) {
        anim.currentTime = at
      }
      if (p < 0) anim.pause() // counting in: the playhead waits at the start
      else if (anim.playState === 'paused') anim.play()
    }
    const tick = () => {
      const L = live.current, p = posAt(A.now())
      if (!L.loop && p >= L.len) { setPlaying(false); setCounting(false); setPos(L.rs); return }
      syncPlayhead(p, L)
      setCounting(p < 0)
      setPos(L.rs + Math.floor(Math.max(0, p) % L.len)) // same value: React skips the render
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { clearInterval(iv); cancelAnimationFrame(raf); anim?.cancel(); setCounting(false) }
  }, [playing]) // eslint-disable-line react-hooks/exhaustive-deps

  const setMixFor = (id, patch) => setMix((m) => ({ ...m, [id]: { ...m[id], ...patch } }))

  return {
    tracks, playing, pos, status, volume, muted, phRef, perBeat, counting,
    setVolume, setMuted,
    setPlaying: (p) => { A.resume(); setPlaying(p) },
    togglePlay: () => { A.resume(); setPlaying((p) => !p) },
    // Jump to a step (kept inside the range); while playing, scheduling restarts from there right away.
    seek: (step) => {
      const s = Math.max(rs, Math.min(rs + len - 1, step))
      if (playing) {
        const e = eng.current
        e.anchorPos = s - rs; e.anchorTime = A.now() + 0.02; e.nextAbs = s - rs
      }
      live.current.pos = s
      setPos(s)
    },
    resetPos: () => {
      restartAtRange()
      setPos(rs); live.current.pos = rs
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
