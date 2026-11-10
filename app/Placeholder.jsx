import { Icon } from '@ds/components/icons/Icon.jsx'

export default function Placeholder({ title, icon }) {
  return (
    <div style={{ flex: 1, display: 'grid', alignContent: 'start', gap: 16, padding: '36px 40px' }}>
      <h1 style={{ font: 'var(--type-title)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name={icon} size={28} />{title}
      </h1>
      <p style={{ font: 'var(--type-body)', color: 'var(--fg-2)' }}>Conteúdo em breve.</p>
    </div>
  )
}
