import React from 'react';

export function Panel({ title, flush = false, as = 'section', className = '', children, ...rest }) {
  const Tag = as;
  const cls = ['fs-panel', flush && 'fs-panel--flush', className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} {...rest}>
      {title && <h2 className="fs-panel__title">{title}</h2>}
      {children}
    </Tag>
  );
}
