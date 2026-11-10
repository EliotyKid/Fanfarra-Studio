// Fanfarra Studio — tiny Web Audio drum synth for the UI kit (no samples). window.FanfarraAudio
(function () {
  let ctx = null, master = null, noise = null, vol = 0.7;
  function ensure() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -10; comp.ratio.value = 4;
        master = ctx.createGain(); master.gain.value = vol;
        master.connect(comp); comp.connect(ctx.destination);
        const len = ctx.sampleRate * 1.5;
        noise = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = noise.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { ctx = null; }
    return ctx;
  }
  const env = (g, t, peak, dur) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); };
  function tone(t, type, f0, f1, sweep, peak, dur) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + sweep);
    env(g, t, peak, dur); o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  function hiss(t, ftype, freq, q, peak, dur) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; f.type = ftype; f.frequency.value = freq; f.Q.value = q;
    env(g, t, peak, dur); s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + 0.05);
  }
  const voices = {
    bumbo: (t) => { tone(t, 'sine', 130, 42, 0.22, 1.0, 0.5); hiss(t, 'lowpass', 900, 0.7, 0.25, 0.04); },
    surdo: (t) => { tone(t, 'sine', 92, 64, 0.35, 0.85, 0.75); hiss(t, 'lowpass', 500, 0.7, 0.18, 0.06); },
    tarol: (t) => { hiss(t, 'highpass', 1800, 0.6, 0.55, 0.17); hiss(t, 'bandpass', 4200, 1.2, 0.25, 0.1); tone(t, 'triangle', 240, 170, 0.06, 0.32, 0.08); },
    repique: (t) => { tone(t, 'triangle', 460, 330, 0.1, 0.55, 0.2); hiss(t, 'highpass', 3500, 0.8, 0.2, 0.03); },
    prato: (t) => { hiss(t, 'highpass', 6500, 0.5, 0.28, 1.1); hiss(t, 'bandpass', 9000, 2, 0.15, 0.6); }
  };
  window.FanfarraAudio = {
    ensure,
    now: () => (ctx ? ctx.currentTime : performance.now() / 1000),
    play(id, when) { if (!ensure() || !voices[id]) return; try { voices[id](Math.max(when ?? ctx.currentTime, ctx.currentTime)); } catch (e) {} },
    setVolume(v) { vol = v; if (master) master.gain.setTargetAtTime(v, ctx.currentTime, 0.02); }
  };
})();
