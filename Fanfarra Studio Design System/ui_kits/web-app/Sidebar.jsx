// Desktop sidebar: stacked logo, primary nav, tagline footer.
const FS_NAV = [{ id: 'toques', icon: 'music', label: 'Toques' }, { id: 'sobre', icon: 'info', label: 'Sobre' }, { id: 'contato', icon: 'mail', label: 'Contato' }];

function Sidebar({ route, onNavigate }) {
  const { NavItem, Icon } = window.FanfarraStudioDesignSystem_fca01a;
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-app)', minHeight: 0 }}>
      <div style={{ display: 'grid', placeItems: 'center', padding: '28px 0 40px' }}>
        <img src="../../assets/brand/logo-stacked-transparent.png" alt="Fanfarra Studio" style={{ width: 104, height: 'auto', display: 'block' }} />
      </div>
      <nav aria-label="Principal" style={{ display: 'grid', gap: 8, paddingRight: 16 }}>
        {FS_NAV.map((n) => <NavItem key={n.id} icon={n.icon} label={n.label} active={route === n.id} onClick={() => onNavigate(n.id)} />)}
      </nav>
      <div style={{ marginTop: 'auto', padding: '0 20px 28px' }}>
        <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 20, display: 'grid', justifyItems: 'center', gap: 10, color: 'var(--fg-3)' }}>
          <Icon name="chart-no-axes-column" size={18} />
          <span style={{ font: '400 12px/1.2 var(--font-body)', color: 'var(--fg-2)', whiteSpace: 'nowrap' }}>Aprenda. Toque. Evolua.</span>
        </div>
      </div>
    </aside>
  );
}

function EmptyScreen({ title, icon }) {
  const { Icon, StatusMessage } = window.FanfarraStudioDesignSystem_fca01a;
  return (
    <div style={{ flex: 1, display: 'grid', alignContent: 'start', gap: 24, padding: '36px 40px' }}>
      <h1 style={{ font: 'var(--type-title)', display: 'flex', alignItems: 'center', gap: 14 }}><Icon name={icon} size={28} />{title}</h1>
      <div style={{ maxWidth: 520 }}>
        <StatusMessage variant="banner" tone="warning" title="Tela não incluída na referência" message={'O layout de “' + title + '” ainda não foi enviado. Envie a referência para recriá-la fielmente.'} />
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, EmptyScreen, FS_NAV });
