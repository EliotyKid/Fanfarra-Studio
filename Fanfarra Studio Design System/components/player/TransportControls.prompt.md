Playback cluster — previous toque, play/pause, next toque (and Loop on mobile).

```jsx
<TransportControls playing={playing} onPlayToggle={setPlaying} onPrev={prev} onNext={next} />
<TransportControls size="sm" spread loop={loop} onLoopToggle={setLoop} playing={playing} onPlayToggle={setPlaying} />
```

- Desktop (`lg`): 52px surface circles flank a 58px violet PlayButton, centered under the title.
- Mobile (`sm`): bare 24px glyphs, 48px play, Loop as a surface circle at the far right; use `spread`.
