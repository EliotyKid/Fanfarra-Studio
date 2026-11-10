import React from 'react';
import { Icon } from '../icons/Icon.jsx';

const norm = (o) => (typeof o === 'object' && o !== null ? o : { value: o, label: String(o) });

export function Select({ value, options = [], onChange, icon, label, size = 'md', block = false, disabled = false, renderValue, className = '', id }) {
  const opts = options.map(norm);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const rootRef = React.useRef(null);
  const btnRef = React.useRef(null);
  const listRef = React.useRef(null);
  const autoId = React.useId();
  const uid = id || 'fs-sel-' + autoId.replace(/:/g, '');
  const selIdx = Math.max(0, opts.findIndex((o) => o.value === value));
  const sel = opts[selIdx];

  React.useEffect(() => {
    if (!open) return;
    setActive(selIdx);
    const onDoc = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', onDoc);
    requestAnimationFrame(() => listRef.current && listRef.current.focus());
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [open]);

  React.useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[active];
    if (el) { const l = listRef.current; if (el.offsetTop < l.scrollTop) l.scrollTop = el.offsetTop; else if (el.offsetTop + el.offsetHeight > l.scrollTop + l.clientHeight) l.scrollTop = el.offsetTop + el.offsetHeight - l.clientHeight; }
  }, [active, open]);

  const close = (focus = true) => { setOpen(false); if (focus) btnRef.current && btnRef.current.focus(); };
  const pick = (i) => { const o = opts[i]; if (o && onChange) onChange(o.value); close(); };

  const onListKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(opts.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(opts.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(active); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') { close(false); }
  };
  const onBtnKey = (e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); } };

  const cls = ['fs-select', size === 'lg' && 'fs-select--lg', block && 'fs-select--block', className].filter(Boolean).join(' ');
  return (
    <div className={cls} ref={rootRef}>
      <button ref={btnRef} type="button" className="fs-select__trigger" disabled={disabled}
        aria-haspopup="listbox" aria-expanded={open} aria-controls={uid + '-list'} aria-label={label ? label + ': ' + (sel ? sel.label : '') : undefined}
        onClick={() => setOpen((o) => !o)} onKeyDown={onBtnKey}>
        {icon && <Icon name={icon} size={20} />}
        <span className="fs-select__value">{renderValue ? renderValue(sel) : sel ? sel.label : ''}</span>
        <Icon name="chevron-down" size={16} className="fs-select__chev" />
      </button>
      {open && (
        <ul ref={listRef} id={uid + '-list'} className="fs-select__menu" role="listbox" tabIndex={-1} aria-label={label}
          aria-activedescendant={uid + '-o' + active} onKeyDown={onListKey}>
          {opts.map((o, i) => (
            <li key={String(o.value)} id={uid + '-o' + i} role="option" className="fs-select__option"
              aria-selected={i === selIdx} data-active={i === active}
              onPointerEnter={() => setActive(i)} onClick={() => pick(i)}>
              <span>{o.label}</span>
              {i === selIdx && <Icon name="check" size={16} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
