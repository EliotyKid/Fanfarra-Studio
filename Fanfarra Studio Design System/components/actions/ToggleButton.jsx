import React from 'react';
import { Icon } from '../icons/Icon.jsx';

export function ToggleButton({ pressed = false, onPressedChange, icon, size = 'md', className = '', children, onClick, ...rest }) {
  const cls = ['fs-toggle', size === 'lg' && 'fs-toggle--lg', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} aria-pressed={!!pressed}
      onClick={(e) => { onClick && onClick(e); onPressedChange && onPressedChange(!pressed); }} {...rest}>
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  );
}
