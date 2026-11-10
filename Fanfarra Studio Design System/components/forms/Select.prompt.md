Pill dropdown for picking a musical parameter (BPM, compasso/time signature); keyboard-accessible listbox.

```jsx
<Select label="Andamento" icon="music-2" value={bpm} onChange={setBpm}
  options={[90,100,110,120,130].map(v => ({ value: v, label: v + ' BPM' }))} />
<Select label="Compasso" icon="drum" value="4/4" options={['2/4','3/4','4/4']} onChange={setSig} />
```

- Trigger: 42px sunken pill, 1px border, mono value, chevron rotates when open.
- Menu: Surface card, 12px radius, pop shadow; selected option in Primary Light with check.
- Keys: ↑/↓ open & move, Enter/Space pick, Esc close.
