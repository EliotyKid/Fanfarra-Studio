import React from 'react';
import { Icon } from '../icons/Icon.jsx';

export function IconButton({ icon, label, variant = 'ghost', size = 'md', shape = 'circle', pressed, iconSize, className = '', type = 'button', ...rest }) {
  const cls = ['fs-iconbtn', 'fs-iconbtn--' + variant, 'fs-iconbtn--' + size, shape === 'square' && 'fs-iconbtn--square', className].filter(Boolean).join(' ');
  const is = iconSize ?? (size === 'sm' ? 18 : size === 'lg' ? 22 : 20);
  return (
    <button type={type} className={cls} aria-label={label} title={label} aria-pressed={pressed === undefined ? undefined : !!pressed} {...rest}>
      <Icon name={icon} size={is} />
    </button>
  );
}
