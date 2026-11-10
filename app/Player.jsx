'use client'
// Toques player: desktop and mobile layouts from the design system UI kit.
import { Select } from '@ds/components/forms/Select.jsx'
import { VolumeSlider } from '@ds/components/forms/VolumeSlider.jsx'
import { ToggleButton } from '@ds/components/actions/ToggleButton.jsx'
import { Icon } from '@ds/components/icons/Icon.jsx'
import { TransportControls } from '@ds/components/player/TransportControls.jsx'
import { usePlayer, useSpaceToPlay } from '@/lib/usePlayer'
import { useFullscreen, useLandscapePhone, useMobile } from '@/lib/media'
import { FullscreenButton, LoadError, Sequencer } from './ui'

const meta = (p) => `${p.toque.compasso} · ${p.toque.compassos} compassos`
const info = (p) => p.status === 'loading' ? 'Carregando sons…' : `${new Set(p.tracks.map((t) => t.inst)).size} instrumentos · ${meta(p)}`

function DesktopPlayer({ p, fs }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap', padding: '36px 24px 0 40px' }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ font: 'var(--type-title)', color: 'var(--fg-1)' }}>{p.toque.nome}</h1>
          <div style={{ font: 'var(--type-meta)', color: 'var(--fg-2)', marginTop: 8 }}>{meta(p)}</div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Select label="Toque" icon="list-music" value={p.idx} options={p.toqueOptions} onChange={p.setToque} />
          <Select label="Andamento" icon="music-2" value={p.bpm} options={p.bpmOptions} onChange={p.setBpm} />
          <ToggleButton icon="rotate-cw" pressed={p.loop} onPressedChange={p.setLoop}>Loop</ToggleButton>
        </div>
      </header>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
        <TransportControls playing={p.playing} onPlayToggle={p.setPlaying} onPrev={p.prev} onNext={p.next}
          prevDisabled={p.toques.length < 2} nextDisabled={p.toques.length < 2} />
      </div>
      <LoadError p={p} />
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', marginRight: 16, background: 'var(--bg-sunken)' }}>
        <Sequencer p={p} bars={p.toque.compassos} spb={p.toque.spb} />
      </div>
      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, minHeight: 72, padding: '0 24px 0 40px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--fg-2)', font: 'var(--type-body)' }}>
          <Icon name="info" size={20} />
          <span>{info(p)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <VolumeSlider value={p.volume} onChange={p.setVolume} muted={p.muted} onMuteToggle={p.setMuted} width={160} />
          <FullscreenButton fs={fs} />
        </div>
      </footer>
    </div>
  )
}

function MobilePlayer({ p, fs }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ padding: '20px 16px 0' }}>
        <h1 style={{ font: '700 20px/1.2 var(--font-display)' }}>{p.toque.nome}</h1>
        <div style={{ font: '400 13px/1.3 var(--font-mono)', color: 'var(--fg-2)', marginTop: 4 }}>{meta(p)}</div>
      </div>
      <div style={{ display: 'flex', gap: 12, padding: '20px 16px 0' }}>
        <Select label="Toque" icon="list-music" value={p.idx} options={p.toqueOptions} onChange={p.setToque} size="lg" block />
        <Select label="Andamento" icon="music-2" value={p.bpm} options={p.bpmOptions} onChange={p.setBpm} size="lg" />
      </div>
      <div style={{ padding: '20px 16px 20px 24px' }}>
        <TransportControls size="sm" spread playing={p.playing} onPlayToggle={p.setPlaying} onPrev={p.prev} onNext={p.next}
          loop={p.loop} onLoopToggle={p.setLoop} />
      </div>
      <LoadError p={p} />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <Sequencer p={p} bars={p.toque.compassos} spb={p.toque.spb} compact />
      </div>
      <footer className="safe-bottom" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px 24px 16px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <VolumeSlider value={p.volume} onChange={p.setVolume} muted={p.muted} onMuteToggle={p.setMuted} />
        </div>
        <FullscreenButton fs={fs} />
      </footer>
    </div>
  )
}

// Phone lying down: one toolbar row, the grid takes all the remaining height.
// No volume bar: the phone's own buttons do that.
function LandscapePlayer({ p, fs }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px 8px 16px' }}>
        <div style={{ minWidth: 0, flex: '1 1 0' }}>
          <h1 title={meta(p)} style={{ font: '700 17px/1.2 var(--font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.toque.nome}</h1>
        </div>
        <Select label="Toque" icon="list-music" value={p.idx} options={p.toqueOptions} onChange={p.setToque} />
        <Select label="Andamento" icon="music-2" value={p.bpm} options={p.bpmOptions} onChange={p.setBpm} />
        <TransportControls size="sm" playing={p.playing} onPlayToggle={p.setPlaying} onPrev={p.prev} onNext={p.next}
          loop={p.loop} onLoopToggle={p.setLoop} />
        <FullscreenButton fs={fs} />
      </div>
      <LoadError p={p} />
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Sequencer p={p} bars={p.toque.compassos} spb={p.toque.spb} compact dense />
      </div>
    </div>
  )
}

export default function Player({ toques, instrumentos }) {
  const p = usePlayer(toques, instrumentos)
  useSpaceToPlay(p.togglePlay)
  const fs = useFullscreen()
  const mobile = useMobile(), landscape = useLandscapePhone()
  if (mobile === null) return null // static HTML: wait for the real screen size instead of flashing the desktop layout
  if (landscape) return <LandscapePlayer p={p} fs={fs} />
  return mobile ? <MobilePlayer p={p} fs={fs} /> : <DesktopPlayer p={p} fs={fs} />
}
