import React from 'react';
import { IconButton } from '../actions/IconButton.jsx';
import { PlayButton } from '../actions/PlayButton.jsx';

export function TransportControls({ playing = false, onPlayToggle, onPrev, onNext, prevDisabled, nextDisabled, loop, onLoopToggle, size = 'lg', spread = false, className = '', style }) {
  const compact = size === 'sm';
  const v = compact ? 'ghost' : 'surface';
  const st = spread ? { justifyContent: 'space-between', width: '100%', ...style } : style;
  return (
    <div className={['fs-transport', compact && 'fs-transport--compact', className].filter(Boolean).join(' ')} style={st} role="group" aria-label="Controles de reprodução">
      <IconButton icon="skip-back" label="Toque anterior" variant={v} size="lg" iconSize={compact ? 24 : 22} onClick={onPrev} disabled={prevDisabled} />
      <PlayButton playing={playing} onToggle={onPlayToggle} size={compact ? 'sm' : 'lg'} />
      <IconButton icon="skip-forward" label="Próximo toque" variant={v} size="lg" iconSize={compact ? 24 : 22} onClick={onNext} disabled={nextDisabled} />
      {onLoopToggle && <IconButton icon="rotate-cw" label="Repetir (loop)" variant="surface" size="lg" pressed={!!loop} onClick={() => onLoopToggle(!loop)} />}
    </div>
  );
}
