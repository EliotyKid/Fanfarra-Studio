On/off pill for playback modes such as Loop; pairs with Select in the player toolbar.

```jsx
<ToggleButton icon="rotate-cw" pressed={loop} onPressedChange={setLoop}>Loop</ToggleButton>
```

- Off: dark sunken pill, 1px border. On: violet-soft fill, violet border, icon turns Primary Light.
- Exposes `aria-pressed`; never change the label to signal state.
