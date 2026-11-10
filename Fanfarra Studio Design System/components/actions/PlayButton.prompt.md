Circular violet play/pause control — the single most prominent action on any player screen.

```jsx
<PlayButton playing={playing} onToggle={setPlaying} />
<PlayButton size="sm" playing={false} />
```

- Only one PlayButton per view. Bind the space bar to the same toggle.
- Glyph switches play ↔ pause; aria-label switches "Tocar" ↔ "Pausar".
