// Mobile layout (≤ 760px or inside the device frame): header + drawer, compact player.
function MobileApp({ p, route, onNavigate, fullscreen, onFullscreen }) {
  const { IconButton, Select, TransportControls, StepSequencer, VolumeSlider, NavItem } = window.FanfarraStudioDesignSystem_fca01a;
  const [menu, setMenu] = React.useState(false);
  const go = (id) => { onNavigate(id); setMenu(false); };
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)', overflow: 'hidden' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px 10px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
        <img src="../../assets/brand/logo-horizontal-transparent.png" alt="Fanfarra Studio" style={{ height: 40, width: 'auto', display: 'block' }} />
        <IconButton icon="menu" label="Abrir menu" size="lg" iconSize={24} onClick={() => setMenu(true)} style={{ color: 'var(--fg-1)' }} />
      </header>

      {route === 'toques' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '20px 16px 0 6px' }}>
            <IconButton icon="arrow-left" label="Voltar" size="lg" iconSize={24} style={{ color: 'var(--fg-1)' }} />
            <div style={{ minWidth: 0 }}>
              <h1 style={{ font: '700 20px/1.2 var(--font-display)' }}>{p.toque.title}</h1>
              <div style={{ font: '400 13px/1.3 var(--font-mono)', color: 'var(--fg-2)', marginTop: 4 }}>{p.toque.group}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, padding: '20px 16px 0' }}>
            <Select label="Andamento" icon="music-2" value={p.bpm} options={p.bpmOptions} onChange={p.setBpm} size="lg" />
            <Select label="Compasso" icon="drum" value={p.sig} options={p.sigOptions} onChange={p.setSig} size="lg" />
          </div>
          <div style={{ padding: '20px 16px 20px 24px' }}>
            <TransportControls size="sm" spread playing={p.playing} onPlayToggle={p.setPlaying} onPrev={p.prev} onNext={p.next} loop={p.loop} onLoopToggle={p.setLoop} />
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <StepSequencer compact tracks={p.tracks} bars={p.bars} stepsPerBar={p.spb} playhead={p.pos} playing={p.playing}
              onToggleStep={p.toggleStep} onMuteToggle={p.toggleMute} minCellWidth={18} />
          </div>
          <footer style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px 40px 16px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ flex: 1, minWidth: 0 }}><VolumeSlider value={p.volume} onChange={p.setVolume} muted={p.muted} onMuteToggle={p.setMuted} /></div>
            <IconButton icon={fullscreen ? 'shrink' : 'expand'} label="Tela cheia" onClick={onFullscreen} />
          </footer>
        </div>
      ) : (
        <EmptyScreen title={route === 'sobre' ? 'Sobre' : 'Contato'} icon={route === 'sobre' ? 'info' : 'mail'} />
      )}

      <div onClick={() => setMenu(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,10,.6)', backdropFilter: 'blur(2px)', opacity: menu ? 1 : 0, pointerEvents: menu ? 'auto' : 'none', transition: 'opacity var(--dur-slow) var(--ease-out)', zIndex: 80 }}></div>
      <aside aria-hidden={!menu} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '78%', maxWidth: 320, background: 'var(--surface-panel)', borderLeft: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-pop)', transform: menu ? 'none' : 'translateX(105%)', transition: 'transform var(--dur-slow) var(--ease-out)', zIndex: 81, display: 'flex', flexDirection: 'column', padding: '56px 16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <IconButton icon="x" label="Fechar menu" onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1} />
        </div>
        <nav aria-label="Principal" style={{ display: 'grid', gap: 6 }}>
          {window.FS_NAV.map((n) => <NavItem key={n.id} inset icon={n.icon} label={n.label} active={route === n.id} onClick={() => go(n.id)} tabIndex={menu ? 0 : -1} />)}
        </nav>
        <div style={{ marginTop: 'auto', textAlign: 'center', font: '400 12px/1.2 var(--font-body)', color: 'var(--fg-2)' }}>Aprenda. Toque. Evolua.</div>
      </aside>
    </div>
  );
}

Object.assign(window, { MobileApp });
