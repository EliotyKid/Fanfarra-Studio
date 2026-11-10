// usePlayer — sequencer state + look-ahead audio scheduler shared by desktop and mobile layouts.
const FS_SIGS = ['2/4', '3/4', '4/4'];
const FS_BPMS = [80, 90, 100, 110, 120, 130, 140, 150, 160];

function fsBuildTracks(toque) {
  const total = toque.bars * parseInt(toque.sig, 10) * 2;
  return window.FS_INSTRUMENTS.map((ins) => ({ ...ins, muted: false, steps: Array.from({ length: total }, (_, i) => (toque.pattern[ins.id] || []).includes(i)) }));
}
function fsConvertSig(tracks, bars, fromSpb, toSpb) {
  return tracks.map((t) => ({ ...t, steps: Array.from({ length: bars * toSpb }, (_, i) => { const b = Math.floor(i / toSpb), s = i % toSpb; return s < fromSpb ? !!t.steps[b * fromSpb + s] : false; }) }));
}

function usePlayer() {
  const toques = window.FS_TOQUES;
  const A = window.FanfarraAudio;
  const [idx, setIdx] = React.useState(0);
  const [tracks, setTracks] = React.useState(() => fsBuildTracks(toques[0]));
  const [bpm, setBpm] = React.useState(toques[0].bpm);
  const [sig, setSig] = React.useState(toques[0].sig);
  const [loop, setLoop] = React.useState(true);
  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(70);
  const [muted, setMuted] = React.useState(false);
  const [pos, setPos] = React.useState(0);

  const toque = toques[idx];
  const bars = toque.bars;
  const spb = parseInt(sig, 10) * 2;
  const total = bars * spb;

  const live = React.useRef({});
  live.current = { tracks, total, loop, pos };
  const eng = React.useRef({ anchorPos: 0, anchorTime: 0, stepDur: 60 / bpm / 2, nextAbs: 0 });
  const posAt = (t) => eng.current.anchorPos + (t - eng.current.anchorTime) / eng.current.stepDur;

  React.useEffect(() => {
    const e = eng.current, t = A.now();
    if (playing) { e.anchorPos = posAt(t); e.anchorTime = t; }
    e.stepDur = 60 / bpm / 2;
  }, [bpm]);

  React.useEffect(() => { A.setVolume(muted ? 0 : volume / 100); }, [volume, muted]);

  React.useEffect(() => {
    if (!playing || loop) return;
    const e = eng.current, p = posAt(A.now()), k = Math.floor(p / total) * total;
    e.anchorPos -= k; e.nextAbs -= k;
  }, [loop]);

  React.useEffect(() => {
    if (!playing) return;
    A.ensure();
    const e = eng.current;
    e.anchorTime = A.now() + 0.05; e.anchorPos = live.current.pos; e.nextAbs = Math.ceil(e.anchorPos - 1e-6);
    const sched = () => {
      const now = A.now(); const L = live.current;
      for (;;) {
        const tt = e.anchorTime + (e.nextAbs - e.anchorPos) * e.stepDur;
        if (tt > now + 0.12 || (!L.loop && e.nextAbs >= L.total)) break;
        const st = e.nextAbs % L.total;
        if (tt >= now - 0.03) L.tracks.forEach((tr) => { if (!tr.muted && tr.steps[st]) A.play(tr.id, tt); });
        e.nextAbs++;
      }
    };
    sched();
    const iv = setInterval(sched, 25);
    let raf;
    const tick = () => {
      const L = live.current; const p = Math.max(0, posAt(A.now()));
      if (!L.loop && p >= L.total) { setPlaying(false); setPos(0); return; }
      setPos(p % L.total); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { clearInterval(iv); cancelAnimationFrame(raf); };
  }, [playing]);

  const resetPos = () => { const e = eng.current; e.anchorPos = 0; e.anchorTime = A.now() + 0.05; e.nextAbs = 0; setPos(0); live.current.pos = 0; };

  const loadToque = (i) => {
    const n = (i + toques.length) % toques.length, t = toques[n];
    setIdx(n); setTracks(fsBuildTracks(t)); setBpm(t.bpm); setSig(t.sig); resetPos();
  };

  return {
    toque, toques, idx, tracks, bpm, sig, loop, playing, volume, muted, pos, bars, spb, total,
    bpmOptions: FS_BPMS.map((v) => ({ value: v, label: v + ' BPM' })),
    sigOptions: FS_SIGS,
    setBpm, setLoop, setVolume, setMuted,
    setPlaying: (p) => { if (p) A.ensure(); setPlaying(p); },
    togglePlay: () => { A.ensure(); setPlaying((p) => !p); },
    prev: () => loadToque(idx - 1),
    next: () => loadToque(idx + 1),
    setSig: (s) => { const to = parseInt(s, 10) * 2; setTracks((ts) => fsConvertSig(ts, bars, spb, to)); setSig(s); resetPos(); },
    toggleStep: (id, i, on) => { setTracks((ts) => ts.map((t) => (t.id === id ? { ...t, steps: t.steps.map((s, j) => (j === i ? on : s)) } : t))); if (on && !playing) A.play(id); },
    toggleMute: (id, m) => setTracks((ts) => ts.map((t) => (t.id === id ? { ...t, muted: m } : t)))
  };
}

function useSpaceToPlay(toggle) {
  const ref = React.useRef(toggle);
  ref.current = toggle;
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' || e.repeat) return;
      const el = e.target;
      if (el.closest && el.closest('input,textarea,select,button,a,[role=slider],[role=listbox],[contenteditable=true]')) return;
      e.preventDefault(); ref.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

Object.assign(window, { usePlayer, useSpaceToPlay });
