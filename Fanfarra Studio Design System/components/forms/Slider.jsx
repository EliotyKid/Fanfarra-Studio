import React from 'react';

export function Slider({ value = 0, min = 0, max = 100, step = 1, onChange, label = 'Valor', disabled = false, valueText, className = '', style }) {
  const ref = React.useRef(null);
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const clamp = (v) => Math.min(max, Math.max(min, Math.round(v / step) * step));
  const fromX = (clientX) => { const r = ref.current.getBoundingClientRect(); return clamp(min + ((clientX - r.left) / r.width) * (max - min)); };
  const onDown = (e) => {
    if (disabled) return;
    e.preventDefault(); ref.current.focus(); ref.current.setPointerCapture(e.pointerId);
    onChange && onChange(fromX(e.clientX));
  };
  const onMove = (e) => { if (!disabled && ref.current.hasPointerCapture(e.pointerId)) onChange && onChange(fromX(e.clientX)); };
  const onKey = (e) => {
    if (disabled) return;
    const big = (max - min) / 10; let v = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v = value + step * 5;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v = value - step * 5;
    else if (e.key === 'PageUp') v = value + big; else if (e.key === 'PageDown') v = value - big;
    else if (e.key === 'Home') v = min; else if (e.key === 'End') v = max;
    if (v !== null) { e.preventDefault(); onChange && onChange(clamp(v)); }
  };
  return (
    <div ref={ref} className={('fs-slider ' + className).trim()} style={style} role="slider" tabIndex={disabled ? -1 : 0}
      aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={valueText} aria-disabled={disabled || undefined}
      onPointerDown={onDown} onPointerMove={onMove} onKeyDown={onKey}>
      <div className="fs-slider__track"><div className="fs-slider__fill" style={{ width: pct + '%' }}></div></div>
      <div className="fs-slider__thumb" style={{ left: pct + '%' }}></div>
    </div>
  );
}
