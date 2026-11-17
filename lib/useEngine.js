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

// rawTracks: [{ id, inst, name, color, steps: (null | [[key, vel], ...])[], gain?, pessoas? }] (gain/pessoas: mixer)
// perBeat: grid steps per beat (4 = 16ths, 3 = triplets, 8 = 32nds...); bpm counts beats.
// range: [startStep, endStep) to play/loop only part of the toque (null = whole toque).
// metro: click on every beat (accent on beat 1). countIn: one bar of clicks before playback starts.
// order: bar indices to play in this order (a play list; bars may repeat); replaces range. ordIdx = position in it.
export function useEngine({ rawTracks, total, bpm, perBeat = 4, loop, instrumentos, range = null, metro = false, countIn = false, beatsPerBar = 4, order = null }) {
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
  // With an order, virtual bar k is the toque's bar order[k].
  const spb = beatsPerBar * perBeat
  const rs = order ? 0 : range ? range[0] : 0
  const len = order ? order.length * spb : (range ? range[1] : total) - rs
  const [ordIdx, setOrdIdx] = useState(0)
  const live = useRef({})
  live.current = { tracks, total, loop, pos, rs, len, metro, perBeat, spb, order }
  // virtual step (0..len) -> toque step, and back (first time the list plays that bar; -1 if never).
  const toStep = (L, v) => (L.order ? L.order[Math.floor(v / L.spb)] * L.spb + (v % L.spb) : L.rs + v)
  const toVirt = (L, s) => {
    if (!L.order) return s >= L.rs && s < L.rs + L.len ? s - L.rs : -1
    const k = L.order.indexOf(Math.floor(s / L.spb))
    return k < 0 ? -1 : k * L.spb + (s % L.spb)
  }
  const orderKey = order ? order.join(',') : ''
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
    else if (toVirt(live.current, pos) < 0) { const s = toStep(live.current, 0); live.current.pos = s; setPos(s) }
    setOrdIdx(0)
  }, [rs, len, orderKey]) // eslint-disable-line react-hooks/exhaustive-deps

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
    const p0 = Math.max(0, toVirt(L0, L0.pos))
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
        const st = toStep(L, ((e.nextAbs % L.len) + L.len) % L.len)
        if (tt >= now - 0.03) {
          if (L.metro && st % L.perBeat === 0) A.click(st % L.spb === 0, tt)
          for (const tr of L.tracks) {
            if (tr.muted || tr.silenced || !tr.steps[st]) continue
            for (const [key, vel] of tr.steps[st]) A.play(tr.inst, key, vel, tt, tr)
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
      // A play list jumps between bars, so there each bar gets its own animation.
      const v = Math.max(0, p) % L.len, k = Math.floor(v / L.spb)
      const s0 = L.order ? L.order[k] * L.spb : L.rs, n = L.order ? L.spb : L.len
      const dur = n * e.stepDur * 1000, at = (L.order ? v % L.spb : v) * e.stepDur * 1000
      const key = s0 + '/' + n + '/' + L.total + (L.order ? '/' + k : '')
      if (!anim || anim.effect.target !== el || animKey !== key) {
        anim?.cancel()
        const x = (s) => ({ transform: `translateX(${(s / L.total) * 100}%)` })
        anim = el.animate([x(s0), x(s0 + n)], { duration: dur, iterations: Infinity, easing: 'linear' })
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
      if (!L.loop && p >= L.len) { setPlaying(false); setCounting(false); setPos(toStep(L, 0)); setOrdIdx(0); return }
      syncPlayhead(p, L)
      setCounting(p < 0)
      const v = Math.floor(Math.max(0, p) % L.len)
      setPos(toStep(L, v)) // same value: React skips the render
      setOrdIdx(Math.floor(v / L.spb))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { clearInterval(iv); cancelAnimationFrame(raf); anim?.cancel(); setCounting(false) }
  }, [playing]) // eslint-disable-line react-hooks/exhaustive-deps

  const setMixFor = (id, patch) => setMix((m) => ({ ...m, [id]: { ...m[id], ...patch } }))

  return {
    tracks, playing, pos, status, volume, muted, phRef, perBeat, counting, ordIdx,
    setVolume, setMuted,
    setPlaying: (p) => { A.resume(); setPlaying(p) },
    togglePlay: () => { A.resume(); setPlaying((p) => !p) },
    // Jump to a step (kept inside the range; with a list, to that bar's first turn, else the list start);
    // while playing, scheduling restarts from there right away.
    seek: (step) => {
      const L = live.current
      const v = order ? Math.max(0, toVirt(L, step)) : Math.max(0, Math.min(len - 1, step - rs))
      const s = toStep(L, v)
      if (playing) {
        const e = eng.current
        e.anchorPos = v; e.anchorTime = A.now() + 0.02; e.nextAbs = v
      }
      L.pos = s
      setPos(s)
      setOrdIdx(Math.floor(v / spb))
    },
    // Step under the playhead right now: while playing, the nearest step (so a key hit on the beat lands on it).
    stepNow: () => {
      if (!playing) return live.current.pos
      const p = posAt(A.now())
      return toStep(live.current, p < 0 ? 0 : Math.round(p) % len)
    },
    resetPos: () => {
      restartAtRange()
      const s = toStep(live.current, 0)
      setPos(s); live.current.pos = s; setOrdIdx(0)
    },
    // Plays the hits at step i of a row, or `hits` when given (e.g. a note just added).
    audition: (id, i, hits) => {
      const tr = tracks.find((t) => t.id === id)
      const h = hits || (tr && tr.steps[i])
      if (!tr || !h) return
      A.resume()
      for (const [key, vel] of h) A.play(tr.inst, key, vel, undefined, tr)
    },
    toggleMute: (id, m) => setMixFor(id, { muted: m }),
    toggleSolo: (id, s) => setMixFor(id, { soloed: s }),
  }
}

export function useSpaceToPlay(toggle) {
  const ref = useRef(toggle)
  ref.current = toggle
  useEffect(() => {
    // Space always plays/pauses, even with a button or grid cell focused; only typing and open lists keep it.
    const typing = (el) => el.closest?.('input:not([type=checkbox],[type=radio],[type=range],[type=button]),textarea,select,[role=listbox],[role=option],[contenteditable=true]')
    const onKey = (e) => {
      if (e.code !== 'Space' || typing(e.target)) return
      e.preventDefault() // stop page scroll and the focused button's own click
      e.stopPropagation()
      if (e.type === 'keydown' && !e.repeat) ref.current()
    }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('keyup', onKey, true) // Firefox clicks focused buttons on keyup
    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('keyup', onKey, true)
    }
  }, [])
}
