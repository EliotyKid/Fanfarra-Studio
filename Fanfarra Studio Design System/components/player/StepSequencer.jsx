import React from 'react';
import { TrackHeader } from './TrackHeader.jsx';

export function StepSequencer({ tracks = [], bars = 4, stepsPerBar = 8, stepsPerBeat = 2, playhead = null, playing = false, onToggleStep, onMuteToggle, onSoloToggle, onSeek, compact = false, minCellWidth, followPlayhead = true, className = '', style }) {
  const total = bars * stepsPerBar;
  const minCell = minCellWidth ?? (compact ? 18 : 20);
  const cur = playhead == null ? -1 : Math.floor(playhead) % total;
  const scrollRef = React.useRef(null);
  const curBar = cur < 0 ? -1 : Math.floor(cur / stepsPerBar);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!followPlayhead || !el || curBar < 0 || el.scrollWidth <= el.clientWidth + 1) return;
    const barW = el.scrollWidth / bars, x = curBar * barW;
    if (x < el.scrollLeft || x + barW > el.scrollLeft + el.clientWidth) el.scrollTo({ left: x, behavior: 'smooth' });
  }, [curBar, followPlayhead, bars]);

  const cols = 'repeat(' + total + ',minmax(0,1fr))';
  // Optional seek: click or drag on the ruler moves the playhead to that step; arrows move one beat.
  const seekAt = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onSeek(Math.min(total - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * total))));
  };
  const seekProps = onSeek ? {
    'data-seek': true, role: 'slider', tabIndex: 0, 'aria-label': 'Posição no toque',
    'aria-valuemin': 1, 'aria-valuemax': bars, 'aria-valuenow': Math.max(0, cur) / stepsPerBar + 1 | 0,
    'aria-valuetext': 'compasso ' + ((Math.max(0, cur) / stepsPerBar + 1) | 0),
    onPointerDown: (e) => { e.currentTarget.setPointerCapture(e.pointerId); seekAt(e); },
    onPointerMove: (e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) seekAt(e); },
    onKeyDown: (e) => {
      const p = Math.max(0, cur), k = { ArrowLeft: -stepsPerBeat, ArrowRight: stepsPerBeat, PageUp: -stepsPerBar, PageDown: stepsPerBar }[e.key];
      if (k) { e.preventDefault(); onSeek(Math.min(total - 1, Math.max(0, p + k))); }
      else if (e.key === 'Home') { e.preventDefault(); onSeek(0); }
    },
  } : {};
  return (
    <div className={['fs-seq', compact && 'fs-seq--compact', className].filter(Boolean).join(' ')} data-density={compact ? 'compact' : undefined} style={style}>
      <div className="fs-seq__heads">
        <div className="fs-seq__corner"></div>
        {tracks.map((t) => (
          <TrackHeader key={t.id} name={t.name} color={t.color} muted={!!t.muted} compact={compact}
            soloed={!!t.soloed} silenced={!!t.silenced}
            onSoloToggle={onSoloToggle ? (s) => onSoloToggle(t.id, s) : undefined}
            onMuteToggle={onMuteToggle ? (m) => onMuteToggle(t.id, m) : null} />
        ))}
      </div>
      <div className="fs-seq__scroll" ref={scrollRef}>
        <div className="fs-seq__body" style={{ minWidth: total * minCell }}>
          <div className="fs-seq__ruler" style={{ gridTemplateColumns: 'repeat(' + bars + ',minmax(0,1fr))' }} {...seekProps}>
            {Array.from({ length: bars }, (_, b) => <div key={b} className="fs-seq__bar">{b + 1}</div>)}
          </div>
          <div className="fs-seq__lanes">
            {tracks.map((t, ti) => (
              <div key={t.id} className="fs-seq__lane" data-muted={!!(t.muted || t.silenced)} style={{ '--inst': t.color, gridTemplateColumns: cols }}>
                {Array.from({ length: total }, (_, i) => {
                  const on = !!(t.steps && t.steps[i]);
                  const lv = on && t.levels ? t.levels[i] : null; // optional hit strength 0..1, drawn as block height
                  return (
                    <button key={i} type="button" className="fs-seq__cell" aria-pressed={on} style={lv == null ? undefined : { '--level': lv }}
                      data-bar={i % stepsPerBar === 0} data-beat={i % stepsPerBeat === 0} data-hit={playing && on && cur === i}
                      aria-label={t.name + ', compasso ' + (Math.floor(i / stepsPerBar) + 1) + ', passo ' + ((i % stepsPerBar) + 1) + (lv == null ? '' : ', força ' + Math.round(lv * 100) + '%')}
                      onClick={() => onToggleStep && onToggleStep(t.id, i, !on)}>
                      <span className="fs-seq__block"></span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          {playhead != null && <div className="fs-seq__playhead" style={{ left: ((playhead % total) / total) * 100 + '%' }} aria-hidden="true"></div>}
        </div>
      </div>
    </div>
  );
}
