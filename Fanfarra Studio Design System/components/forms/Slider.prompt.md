Generic horizontal slider (track + violet fill + thumb); use VolumeSlider for volume specifically.

```jsx
<Slider label="Swing" value={swing} onChange={setSwing} min={0} max={60} valueText={swing + '%'} />
```

- Flexes to fill its row (`flex: 1`, min 64px). Wrap in a sized container to fix width.
- Fully keyboard operable; focus ring on the thumb.
