import React from 'react';
import { Icon } from '../icons/Icon.jsx';

export function PlayButton({ playing = false, onToggle, size = 'lg', className = '', onClick, ...rest }) {
  const cls = ['fs-play', size === 'sm' && 'fs-play--sm', className].filter(Boolean).join(' ');
  const is = size === 'sm' ? 20 : 24;
  return (
    <button type="button" className={cls} aria-label={playing ? 'Pausar' : 'Tocar'} title={playing ? 'Pausar (espaço)' : 'Tocar (espaço)'}
      onClick={(e) => { onClick && onClick(e); onToggle && onToggle(!playing); }} {...rest}>
      <Icon name={playing ? 'pause' : 'play'} size={is} className={playing ? '' : 'fs-icon--play'} />
    </button>
  );
}
