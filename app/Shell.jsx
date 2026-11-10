'use client'
// App frame: desktop sidebar or mobile header + drawer, around every page.
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { NavItem } from '@ds/components/navigation/NavItem.jsx'
import { Icon } from '@ds/components/icons/Icon.jsx'
import { IconButton } from '@ds/components/actions/IconButton.jsx'
import logoStacked from '@ds/assets/brand/logo-stacked-transparent.png'
import logoHorizontal from '@ds/assets/brand/logo-horizontal-transparent.png'
import { useFullscreen } from '@/lib/media'

const NAV = [
  { href: '/', icon: 'music', label: 'Toques' },
  { href: '/criar/', icon: 'plus', label: 'Criar' },
  { href: '/sobre/', icon: 'info', label: 'Sobre' },
  { href: '/contato/', icon: 'mail', label: 'Contato' },
]
const TAGLINE = 'Aprenda. Toque. Evolua.'

function Nav({ inset, onNavigate }) {
  const path = usePathname().replace(/\/$/, '')
  const router = useRouter()
  return (
    <nav aria-label="Principal" style={{ display: 'grid', gap: inset ? 6 : 8, paddingRight: inset ? 0 : 16 }}>
      {NAV.map((n) => (
        <NavItem key={n.href} inset={inset} icon={n.icon} label={n.label} href={n.href}
          active={path === n.href.replace(/\/$/, '')}
          onClick={(e) => { e.preventDefault(); router.push(n.href); onNavigate && onNavigate() }} />
      ))}
    </nav>
  )
}

// One structure for every screen size; CSS (globals.css, .shell) decides sidebar vs header + drawer,
// so phones get the right layout on first paint instead of switching after hydration.
export default function Shell({ children }) {
  const fs = useFullscreen()
  const [menu, setMenu] = useState(false)
  return (
    <div className="shell" data-fs={fs}>
      <header className="shell__top">
        <img src={logoHorizontal.src} alt="Fanfarra Studio" className="shell__logo" />
        <IconButton icon="menu" label="Abrir menu" size="lg" iconSize={24} onClick={() => setMenu(true)} style={{ color: 'var(--fg-1)' }} />
      </header>
      <div className="shell__frame">
        <aside className="shell__side">
          <div style={{ display: 'grid', placeItems: 'center', padding: '28px 0 40px' }}>
            <img src={logoStacked.src} alt="Fanfarra Studio" style={{ width: 104, height: 'auto', display: 'block' }} />
          </div>
          <Nav />
          <div style={{ marginTop: 'auto', padding: '0 20px 28px' }}>
            <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 20, display: 'grid', justifyItems: 'center', gap: 10, color: 'var(--fg-3)' }}>
              <Icon name="chart-no-axes-column" size={18} />
              <span style={{ font: '400 12px/1.2 var(--font-body)', color: 'var(--fg-2)', whiteSpace: 'nowrap' }}>{TAGLINE}</span>
            </div>
          </div>
        </aside>
        <main className="shell__main">{children}</main>
      </div>

      <div className="shell__scrim" data-open={menu} onClick={() => setMenu(false)} />
      <aside className="shell__drawer" data-open={menu} inert={!menu} aria-label="Menu">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <IconButton icon="x" label="Fechar menu" onClick={() => setMenu(false)} />
        </div>
        <Nav inset onNavigate={() => setMenu(false)} />
        <div style={{ marginTop: 'auto', textAlign: 'center', font: '400 12px/1.2 var(--font-body)', color: 'var(--fg-2)' }}>{TAGLINE}</div>
      </aside>
    </div>
  )
}
