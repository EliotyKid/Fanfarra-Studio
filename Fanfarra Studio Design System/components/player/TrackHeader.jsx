import React from 'react';
import { IconButton } from '../actions/IconButton.jsx';

export function TrackHeader({ name, color, muted = false, onMuteToggle, soloed = false, onSoloToggle, silenced = false, onPlay, keyHint, compact = false, className = '', style }) {
  const cls = ['fs-track', compact && 'fs-track--compact', muted && 'fs-track--muted', silenced && !muted && 'fs-track--silenced', className].filter(Boolean).join(' ');
  const label = (
    <>
      <span className="fs-track__dot" aria-hidden="true"></span>
      <span className="fs-track__name">{name}</span>
      {keyHint && <kbd className="fs-track__key" aria-hidden="true">{keyHint}</kbd>}
    </>
  );
  return (
    <div className={cls} style={{ '--inst': color, ...style }}>
      {onPlay ? (
        <button type="button" className="fs-track__play" onClick={onPlay}
          aria-label={'Tocar ' + name + (keyHint ? ' (tecla ' + keyHint + ')' : '')}>{label}</button>
      ) : label}
      {onSoloToggle && (
        <IconButton icon="headphones" size="sm" iconSize={compact ? 16 : 18}
          label={(soloed ? 'Tirar solo de ' : 'Ouvir só ') + name} pressed={soloed}
          style={soloed ? { color: 'var(--fg-accent)' } : undefined}
          onClick={() => onSoloToggle(!soloed)} />
      )}
      {onMuteToggle !== null && (
        <IconButton icon={muted ? 'volume-x' : 'volume-2'} size="sm" iconSize={compact ? 16 : 20}
          label={(muted ? 'Ativar ' : 'Silenciar ') + name} pressed={muted}
          style={muted ? { background: 'transparent', borderColor: 'transparent', color: 'var(--danger)' } : undefined}
          onClick={() => onMuteToggle && onMuteToggle(!muted)} />
      )}
    </div>
  );
}
