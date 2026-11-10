import React from 'react';
import { Icon } from '../icons/Icon.jsx';

export function NavItem({ icon, label, children, active = false, href, onClick, inset = false, className = '', ...rest }) {
  const cls = ['fs-nav-item', inset && 'fs-nav-item--inset', className].filter(Boolean).join(' ');
  const content = <>{icon && <Icon name={icon} size={24} strokeWidth={1.75} />}<span>{label ?? children}</span></>;
  const common = { className: cls, 'aria-current': active ? 'page' : undefined, onClick, ...rest };
  return href ? <a href={href} {...common}>{content}</a> : <button type="button" {...common}>{content}</button>;
}
