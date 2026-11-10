Instrument label row (dot + name + mute) for the left column of the sequencer, or anywhere an instrument is listed.

```jsx
<TrackHeader name="Bumbo" color="var(--inst-bumbo)" muted={false} onMuteToggle={m => …} />
<TrackHeader compact name="Repique" color="var(--inst-repique)" />
```

- Muted: dot fades to 35%, name goes `--fg-3`, glyph becomes volume-x in danger pink.
- Always pair the dot with the instrument's `--inst-*` color — never reuse an instrument color for another meaning inside the grid.
