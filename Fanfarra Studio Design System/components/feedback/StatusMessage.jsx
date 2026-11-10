import React from 'react';
import { Icon } from '../icons/Icon.jsx';

const BADGE = { success: 'check', danger: 'x' };
const TRAIL = { success: 'check', danger: 'x' };
const bang = (size) => <span aria-hidden="true" style={{ font: '800 ' + size + 'px/1 var(--font-display)' }}>!</span>;

export function StatusMessage({ tone = 'success', title, message, variant = 'inline', onDismiss, role, className = '' }) {
  const cls = ['fs-status', 'fs-status--' + tone, variant === 'banner' && 'fs-status--banner', className].filter(Boolean).join(' ');
  const r = role || (tone === 'danger' ? 'alert' : 'status');
  return (
    <div className={cls} role={r}>
      <span className="fs-status__badge">{BADGE[tone] ? <Icon name={BADGE[tone]} size={14} strokeWidth={3} /> : bang(13)}</span>
      <div style={{ minWidth: 0 }}>
        {title && <div className="fs-status__title">{title}</div>}
        {message && <div className="fs-status__msg">{message}</div>}
      </div>
      {onDismiss
        ? <button type="button" className="fs-status__trail" aria-label="Fechar" onClick={onDismiss}><Icon name="x" size={20} /></button>
        : <span className="fs-status__trail" aria-hidden="true">{TRAIL[tone] ? <Icon name={TRAIL[tone]} size={24} /> : bang(26)}</span>}
    </div>
  );
}
