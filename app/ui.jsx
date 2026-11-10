'use client'
// Pieces shared by the Toques player and the Criar editor.
import { useMemo, useRef } from 'react'
import { IconButton } from '@ds/components/actions/IconButton.jsx'
import { StatusMessage } from '@ds/components/feedback/StatusMessage.jsx'
import { StepSequencer } from '@ds/components/player/StepSequencer.jsx'
import { toggleFullscreen, useCanFullscreen } from '@/lib/media'

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
export function Sequencer({ p, bars, spb, compact, dense, onToggleStep, cellWidth, select }) {
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

  const barAnchor = useRef(null)
  const selectBars = (step) => {
    const bar = Math.floor(step / spb)
    if (barAnchor.current === null) {
      barAnchor.current = bar
      window.addEventListener('pointerup', () => { barAnchor.current = null }, { once: true })
    }
    sel.current?.onBars(Math.min(barAnchor.current, bar), Math.max(barAnchor.current, bar))
  }
  // Stopped, the playhead sits at pos (seek, stop). While playing the engine animates it on the compositor;
  // --ph stays put then, because changing it on this ancestor would restyle every grid cell each step.
  const style = { ...HEADS, ...(dense && DENSE), ...(!p.playing && { '--ph': p.pos / total }) }
  return (
    <div ref={p.phRef} style={style} className={select ? 'seq-select' : undefined} onPointerDown={select ? onPointerDown : undefined}>
      <StepSequencer compact={compact} tracks={tracks} bars={bars} stepsPerBar={spb} stepsPerBeat={p.perBeat}
        playhead={p.pos} playing={p.playing} minCellWidth={cellWidth ?? (compact ? 18 : 16)}
        onToggleStep={onCell} onMuteToggle={p.toggleMute} onSoloToggle={p.toggleSolo} onSeek={select ? selectBars : p.seek} />
    </div>
  )
}
