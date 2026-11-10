'use client'
// Pieces shared by the Toques player and the Criar editor.
import { useMemo } from 'react'
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
const DENSE = { '--seq-row-h-compact': '34px', '--seq-ruler-h-compact': '30px' }

export function Sequencer({ p, bars, spb, compact, dense, onToggleStep, cellWidth }) {
  const tracks = useMemo(() => p.tracks.map((t) => ({ ...t, levels: t.steps.map(level) })), [p.tracks])
  const total = bars * spb
  // Stopped, the playhead sits at pos (seek, stop). While playing the engine sets --ph on the playhead itself:
  // changing it here, on an ancestor, would restyle all grid cells every step.
  const style = { ...HEADS, ...(dense && DENSE), ...(!p.playing && { '--ph': p.pos / total }) }
  return (
    <div ref={p.phRef} style={style}>
      <StepSequencer compact={compact} tracks={tracks} bars={bars} stepsPerBar={spb} stepsPerBeat={4}
        playhead={p.pos} playing={p.playing} minCellWidth={cellWidth ?? (compact ? 18 : 16)}
        onToggleStep={onToggleStep || ((id, i) => p.audition(id, i))} onMuteToggle={p.toggleMute} onSoloToggle={p.toggleSolo} onSeek={p.seek} />
    </div>
  )
}
