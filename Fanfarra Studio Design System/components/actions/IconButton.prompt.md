Icon-only button for transport, mute, fullscreen, menu and back actions — always pass a Portuguese `label`.

```jsx
<IconButton icon="skip-back" label="Toque anterior" variant="surface" size="lg" />
<IconButton icon="expand" label="Tela cheia" />
<IconButton icon="rotate-cw" label="Repetir" variant="surface" pressed={loop} onClick={toggle} />
```

- `variant`: ghost (default, muted glyph → white on hover), surface (dark filled circle used for prev/next), outline.
- `size`: sm 32 / md 40 / lg 52.
- `pressed` turns it into a toggle with violet tint.
