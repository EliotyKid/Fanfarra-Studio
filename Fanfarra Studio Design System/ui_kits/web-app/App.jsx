// App shell: routing, fullscreen, responsive switch between desktop frame and mobile layout.
function App({ layout = 'auto' }) {
  const p = window.usePlayer();
  window.useSpaceToPlay(p.togglePlay);
  const [route, setRoute] = React.useState('toques');
  const [w, setW] = React.useState(window.innerWidth);
  const [fs, setFs] = React.useState(false);
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    const r = () => setW(window.innerWidth); const f = () => setFs(!!document.fullscreenElement);
    window.addEventListener('resize', r); document.addEventListener('fullscreenchange', f);
    return () => { window.removeEventListener('resize', r); document.removeEventListener('fullscreenchange', f); };
  }, []);
  const toggleFs = () => { try { if (document.fullscreenElement) document.exitFullscreen(); else rootRef.current && rootRef.current.requestFullscreen(); } catch (e) {} };
  const mobile = layout === 'mobile' || (layout === 'auto' && w < 760);

  if (mobile) return <div ref={rootRef} style={{ height: '100%' }}><MobileApp p={p} route={route} onNavigate={setRoute} fullscreen={fs} onFullscreen={toggleFs} /></div>;

  return (
    <div ref={rootRef} style={{ height: '100%', padding: fs ? 0 : 24, background: 'var(--bg-app)' }}>
      <div style={{ height: '100%', display: 'grid', gridTemplateColumns: 'var(--sidebar-w) minmax(0,1fr)', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: fs ? 0 : 'var(--radius-xl)', boxShadow: 'var(--shadow-panel)', overflow: 'hidden' }}>
        <Sidebar route={route} onNavigate={setRoute} />
        <main style={{ display: 'flex', minWidth: 0, minHeight: 0 }}>
          {route === 'toques'
            ? <DesktopPlayer p={p} fullscreen={fs} onFullscreen={toggleFs} />
            : <EmptyScreen title={route === 'sobre' ? 'Sobre' : 'Contato'} icon={route === 'sobre' ? 'info' : 'mail'} />}
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { App });
