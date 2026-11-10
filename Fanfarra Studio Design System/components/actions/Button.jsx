import React from 'react';
import { Icon } from '../icons/Icon.jsx';

export function Button({ variant = 'primary', size = 'lg', icon, iconRight, block = false, className = '', type = 'button', children, ...rest }) {
  const cls = ['fs-btn', 'fs-btn--' + variant, size !== 'lg' && 'fs-btn--' + size, block && 'fs-btn--block', className].filter(Boolean).join(' ');
  const is = size === 'sm' ? 16 : 18;
  return (
    <button type={type} className={cls} {...rest}>
      {icon && <Icon name={icon} size={is} />}
      {children}
      {iconRight && <Icon name={iconRight} size={is} />}
    </button>
  );
}
