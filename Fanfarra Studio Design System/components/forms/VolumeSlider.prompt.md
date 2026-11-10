Master/track volume control: speaker glyph + violet slider; glyph doubles as mute toggle.

```jsx
<VolumeSlider value={vol} onChange={setVol} muted={muted} onMuteToggle={setMuted} width={150} />
```

- Glyph auto-switches: volume-x (muted/0), volume-1 (<50), volume-2.
- Dragging while muted un-mutes.
- Footer of the player uses `width={150}`; mobile uses full width.
