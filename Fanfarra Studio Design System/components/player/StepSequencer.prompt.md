The fanfarra beat grid — instruments as rows, compassos as columns, colored blocks as hits, violet playhead.

```jsx
<StepSequencer
  tracks={[{ id: 'bumbo', name: 'Bumbo', color: 'var(--inst-bumbo)', steps: [...] }, …]}
  bars={4} stepsPerBar={8} playhead={pos} playing={playing}
  onToggleStep={(id, i, on) => …} onMuteToggle={(id, m) => …} />
```

- Row order is always Bumbo, Prato, Tarol, Surdo, Repique (low → high, reference order).
- Gridlines: bar = `--grid-line-bar`, beat = 6% white, step = 3% white.
- Hover an empty cell → 22% ghost block in the instrument color; active hit flashes brighter.
- `compact` for ≤ 480px; grid scrolls horizontally and follows the playhead.
