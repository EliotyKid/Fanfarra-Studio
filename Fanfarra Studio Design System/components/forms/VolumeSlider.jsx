import React from 'react';
import { Slider } from './Slider.jsx';
import { IconButton } from '../actions/IconButton.jsx';
import { Icon } from '../icons/Icon.jsx';

export function VolumeSlider({ value = 70, onChange, muted = false, onMuteToggle, showIcon = true, label = 'Volume', width, disabled = false, className = '' }) {
  const eff = muted ? 0 : value;
  const glyph = muted || value === 0 ? 'volume-x' : value < 50 ? 'volume-1' : 'volume-2';
  return (
    <div className={('fs-volume ' + className).trim()} style={width ? { width } : undefined}>
      {showIcon && (onMuteToggle
        ? <IconButton icon={glyph} label={muted ? 'Ativar som' : 'Silenciar'} size="sm" pressed={undefined} onClick={() => onMuteToggle(!muted)} disabled={disabled} />
        : <span style={{ color: 'var(--fg-1)', display: 'inline-grid' }}><Icon name={glyph} size={22} /></span>)}
      <Slider label={label} value={eff} onChange={(v) => { if (muted && onMuteToggle) onMuteToggle(false); onChange && onChange(v); }} valueText={eff + '%'} disabled={disabled} />
    </div>
  );
}
