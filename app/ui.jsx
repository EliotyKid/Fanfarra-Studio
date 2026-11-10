'use client'
// Pieces shared by the Toques player and the Criar editor.
import { useMemo, useRef } from 'react'
import { IconButton } from '@ds/components/actions/IconButton.jsx'
import { ToggleButton } from '@ds/components/actions/ToggleButton.jsx'
import { StatusMessage } from '@ds/components/feedback/StatusMessage.jsx'
import { StepSequencer } from '@ds/components/player/StepSequencer.jsx'
import { toggleFullscreen, useCanFullscreen } from '@/lib/media'
import { RAMPA_PASSO, rampaInicio } from '@/lib/usePratica'

export function FullscreenButton({ fs }) {
  if (!useCanFullscreen()) return null
  return <IconButton icon={fs ? 'shrink' : 'expand'} label={fs ? 'Sair da tela cheia' : 'Tela cheia'} onClick={toggleFullscreen} />
}

export function LoadError({ p }) {
  if (p.status !== 'error') return null
  return (
    <div style={{ padding: '0 16px 16px' }}>
      <StatusMessage variant="banner" tone="danger" title="Algo deu errado." message="Não foi possível carregar os sons. Recarregue a página." />
    </div>
  )
}

// Practice toggles (see lib/usePratica): Trecho loops some bars (picked on the ruler), Metrônomo clicks every
// beat, Contagem plays one bar of clicks before starting. icons: icon-only buttons for tight toolbars.
// bpm: the chosen tempo (the ramp starts at 75% of it and climbs back to it).
export function PraticaControls({ pr, p, spb, bpm, icons }) {
  const toggleTrecho = (on) => pr.setTrecho(on ? [Math.floor(p.pos / spb), Math.floor(p.pos / spb)] : null)
  const trechoLabel = pr.trecho ? (pr.trecho[0] === pr.trecho[1] ? `Trecho: compasso ${pr.trecho[0] + 1}` : `Trecho: ${pr.trecho[0] + 1}–${pr.trecho[1] + 1}`) : 'Trecho'
  const items = [
    { icon: 'brackets', label: trechoLabel, hint: 'Repetir só alguns compassos (escolha na régua)', on: !!pr.trecho, set: toggleTrecho },
    { icon: 'timer', label: 'Metrônomo', hint: 'Metrônomo', on: pr.metro, set: pr.setMetro },
    { icon: 'hourglass', label: 'Contagem', hint: 'Contagem de um compasso antes de começar', on: pr.countIn, set: pr.setCountIn },
    { icon: 'trending-up', label: pr.rampa !== null ? `Rampa: ${pr.rampa} BPM` : 'Rampa', hint: `Começar mais lento e acelerar ${RAMPA_PASSO} BPM a cada volta`,
      on: pr.rampa !== null, set: (on) => pr.setRampa(on ? rampaInicio(bpm) : null) },
  ]
  return (
    <div role="group" aria-label="Estudo" style={{ display: 'flex', alignItems: 'center', gap: icons ? 4 : 8, flexWrap: 'wrap' }}>
      {items.map((it) => icons
        ? <IconButton key={it.icon} icon={it.icon} label={it.on && it.label !== it.hint ? it.label : it.hint} variant="surface" pressed={it.on} onClick={() => it.set(!it.on)} />
        : <ToggleButton key={it.icon} icon={it.icon} pressed={it.on} onPressedChange={it.set} title={it.hint}>{it.label}</ToggleButton>)}
      <span aria-live="polite" style={{ font: 'var(--type-caption)', color: 'var(--fg-accent)' }}>{p.counting ? 'Contando…' : ''}</span>
    </div>
  )
}

// Wider track headers than the DS default: they hold a solo button besides mute.
const HEADS = { '--track-header-w': '260px', '--track-header-w-compact': '190px' }

// Block height shows hit strength; floor keeps soft hits visible.
const level = (hits) => (hits ? Math.max(0.35, Math.max(...hits.map(([, v]) => v)) / 127) : 0)

// p: engine state (useEngine). onToggleStep defaults to auditioning the clicked hit.
// cellWidth: minimum cell width in px; the grid scrolls sideways when it does not fit.
// dense: shorter rows and ruler, so all instruments fit a phone lying down.
const DENSE = { '--seq-row-h-compact': '32px', '--seq-ruler-h-compact': '30px' }

// select (editor selection mode): { selected: Set<"rowId:step">, onRect(rowIds, s0, s1), onBars(b0, b1) }.
// Then dragging on the grid selects a rectangle of hits, and the ruler selects whole bars instead of seeking.
// trecho (loop part of the toque): { bars: [b0, b1] | null, onBars(b0, b1) }. While on, the ruler picks the bars.
// Ruler priority: selection, then trecho, then seek.
export function Sequencer({ p, bars, spb, compact, dense, onToggleStep, cellWidth, select, trecho }) {
  const selected = select?.selected
  const tracks = useMemo(() => {
    const byRow = new Map()
    for (const k of selected || []) {
      const c = k.lastIndexOf(':'), id = k.slice(0, c)
      if (!byRow.has(id)) byRow.set(id, new Set())
      byRow.get(id).add(Number(k.slice(c + 1)))
    }
    return p.tracks.map((t) => ({ ...t, levels: t.steps.map(level), selected: selected ? byRow.get(t.id) || new Set() : undefined }))
  }, [p.tracks, selected])
  const total = bars * spb

  const sel = useRef(select)
  sel.current = select
  const drag = useRef(null) // { from, moved, suppress } while a selection drag is in progress
  const cellAt = (x, y) => {
    const c = document.elementFromPoint(x, y)?.closest('.fs-seq__cell')
    return c && { row: c.parentElement.dataset.row, step: Number(c.dataset.step) }
  }
  const onPointerDown = (e) => {
    const from = select && cellAt(e.clientX, e.clientY)
    if (!from) return
    drag.current = { from, moved: false }
    const ids = tracks.map((t) => t.id)
    const move = (ev) => {
      const to = cellAt(ev.clientX, ev.clientY), d = drag.current
      if (!to || !d || (!d.moved && to.row === from.row && to.step === from.step)) return
      d.moved = true
      const r0 = ids.indexOf(from.row), r1 = ids.indexOf(to.row)
      sel.current?.onRect(ids.slice(Math.min(r0, r1), Math.max(r0, r1) + 1), from.step, to.step)
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      // A drag must not also count as a tap on the cell where it started (touch keeps that cell as target).
      if (drag.current?.moved) { drag.current.suppress = true; setTimeout(() => { drag.current = null }, 0) } else drag.current = null
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }
  const toggle = onToggleStep || ((id, i) => p.audition(id, i))
  const onCell = (id, i, on) => { if (!drag.current?.suppress) toggle(id, i, on) }

  // Ruler drag over bars: the first bar touched is the anchor until the pointer is released.
  const barAnchor = useRef(null)
  const tre = useRef(trecho)
  tre.current = trecho
  const barDrag = (cb) => (step) => {
    const bar = Math.floor(step / spb)
    if (barAnchor.current === null) {
      barAnchor.current = bar
      window.addEventListener('pointerup', () => { barAnchor.current = null }, { once: true })
    }
    cb(Math.min(barAnchor.current, bar), Math.max(barAnchor.current, bar))
  }
  const onRuler = select ? barDrag((a, b) => sel.current?.onBars(a, b))
    : trecho?.bars ? barDrag((a, b) => tre.current?.onBars(a, b))
    : p.seek
  const loopRange = trecho?.bars ? [trecho.bars[0] * spb, (trecho.bars[1] + 1) * spb] : undefined
  // Stopped, the playhead sits at pos (seek, stop). While playing the engine animates it on the compositor;
  // --ph stays put then, because changing it on this ancestor would restyle every grid cell each step.
  const style = { ...HEADS, ...(dense && DENSE), ...(!p.playing && { '--ph': p.pos / total }) }
  return (
    <div ref={p.phRef} style={style} className={select ? 'seq-select' : undefined} onPointerDown={select ? onPointerDown : undefined}>
      <StepSequencer compact={compact} tracks={tracks} bars={bars} stepsPerBar={spb} stepsPerBeat={p.perBeat}
        playhead={p.pos} playing={p.playing} minCellWidth={cellWidth ?? (compact ? 18 : 16)}
        onToggleStep={onCell} onMuteToggle={p.toggleMute} onSoloToggle={p.toggleSolo} onSeek={onRuler} loopRange={loopRange} />
    </div>
  )
}
