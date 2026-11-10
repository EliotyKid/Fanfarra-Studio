Elevated dark container for grouping content — the player frame, info boxes, settings groups.

```jsx
<Panel title="Estados">…</Panel>
<Panel flush>{/* full-bleed sequencer */}</Panel>
```

- 24px padding, 16px radius, `--surface-panel` fill, 1px `--border-subtle`, `--shadow-panel`.
- Don't nest Panels; inside a Panel group with spacing or a 1px divider instead.
