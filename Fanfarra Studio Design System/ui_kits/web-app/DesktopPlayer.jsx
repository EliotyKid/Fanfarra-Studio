// Desktop "Toques" player: title + toolbar, transport, sequencer, footer bar.
function PlayerHeader({ p }) {
  const { Select, ToggleButton } = window.FanfarraStudioDesignSystem_fca01a;
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap', padding: '36px 24px 0 40px' }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ font: 'var(--type-title)', color: 'var(--fg-1)' }}>{p.toque.title}</h1>
        <div style={{ font: 'var(--type-meta)', color: 'var(--fg-2)', marginTop: 8 }}>{p.toque.group}</div>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Select label="Andamento" icon="music-2" value={p.bpm} options={p.bpmOptions} onChange={p.setBpm} />
        <Select label="Compasso" icon="drum" value={p.sig} options={p.sigOptions} onChange={p.setSig} />
        <ToggleButton icon="rotate-cw" pressed={p.loop} onPressedChange={p.setLoop}>Loop</ToggleButton>
      </div>
    </header>
  );
}

function PlayerFooter({ p, fullscreen, onFullscreen }) {
  const { Icon, VolumeSlider, IconButton } = window.FanfarraStudioDesignSystem_fca01a;
  return (
    <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, minHeight: 72, padding: '0 24px 0 40px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-panel)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--fg-2)', font: 'var(--type-body)' }}>
        <Icon name="info" size={20} />
        <span>{p.tracks.length} instrumentos · {p.bars} compassos</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <VolumeSlider value={p.volume} onChange={p.setVolume} muted={p.muted} onMuteToggle={p.setMuted} width={160} />
        <IconButton icon={fullscreen ? 'shrink' : 'expand'} label={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'} onClick={onFullscreen} />
      </div>
    </footer>
  );
}

function DesktopPlayer({ p, fullscreen, onFullscreen }) {
  const { TransportControls, StepSequencer } = window.FanfarraStudioDesignSystem_fca01a;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
      <PlayerHeader p={p} />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0 20px' }}>
        <TransportControls playing={p.playing} onPlayToggle={p.setPlaying} onPrev={p.prev} onNext={p.next} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', marginRight: 16, background: 'var(--bg-sunken)' }}>
        <StepSequencer tracks={p.tracks} bars={p.bars} stepsPerBar={p.spb} playhead={p.pos} playing={p.playing}
          onToggleStep={p.toggleStep} onMuteToggle={p.toggleMute} minCellWidth={22} />
      </div>
      <PlayerFooter p={p} fullscreen={fullscreen} onFullscreen={onFullscreen} />
    </div>
  );
}

Object.assign(window, { DesktopPlayer, PlayerHeader, PlayerFooter });
