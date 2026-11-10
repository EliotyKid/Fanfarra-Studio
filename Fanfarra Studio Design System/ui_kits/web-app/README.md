# Fanfarra Studio — Web app UI kit

Recreation of the **Toques** (beat player) screen from `uploads/Fanfarra Studio Music App Dashboard.png`, desktop and mobile.

- `index.html` — desktop shell (sidebar + player). Below 760px it switches to the mobile layout automatically.
- `mobile.html` — the mobile layout inside an iPhone frame (`ios-frame.jsx` starter).
- `App.jsx` — routing (Toques / Sobre / Contato), fullscreen, responsive switch.
- `Sidebar.jsx` — stacked logo, `NavItem` list, tagline footer; also `EmptyScreen` for routes not in the reference.
- `DesktopPlayer.jsx` — `PlayerHeader` (title + BPM/compasso `Select` + Loop `ToggleButton`), `TransportControls`, `StepSequencer`, `PlayerFooter` (info + `VolumeSlider` + fullscreen).
- `MobileApp.jsx` — header with logo + menu drawer, compact player.
- `usePlayer.jsx` — state + look-ahead Web Audio scheduler; `useSpaceToPlay`.
- `audio.js` — tiny synthesized drum kit (bumbo, prato, tarol, surdo, repique). No samples.
- `data.js` — instruments + 4 sample toques (only "Marcha de Entrada" comes from the reference; the others are sample content).

Interactions: play/pause (button or space bar), prev/next toque, click grid cells to add/remove hits (auditions the sound), mute per instrument, BPM and compasso selects (compasso re-maps the pattern), loop on/off, master volume + mute, fullscreen, mobile drawer.

**Not in the reference:** Sobre and Contato screens are intentionally blank with a disclaimer; the mobile back arrow is visual only (no list screen exists in the source).
