# Fanfarra Studio — Design System

**Fanfarra Studio** is a web-based, DAW-style beat player for *fanfarra* (Brazilian marching-band percussion). Musicians pick a **toque** (a rhythm/march), see every instrument laid out on a step grid, and play it back at any tempo — to learn, rehearse and play along. Tagline: **"Aprenda. Toque. Evolua."** (Learn. Play. Evolve.)

The product is a single responsive web app with three sections — **Toques** (the player), **Sobre** (about) and **Contato** (contact). Only the Toques player is defined in the source material.

## Sources
- `uploads/Fanfarra Studio Music App Dashboard.png` — one 1536×1024 board showing the desktop player, the mobile player (iPhone), the color palette (with hex labels), typography (Montserrat + JetBrains Mono), a component strip and a status strip. **This is the only source.** No codebase, Figma or font files were provided.
- Brief (pt-BR): "Esse será um site DAW para reprodução de beats de fanfarra. Mantenha as boas práticas de UI/UX."

## Index
- `styles.css` — entry point (imports only). Link this one file.
- `tokens/` — `fonts.css` (@font-face), `colors.css`, `typography.css`, `spacing.css` (spacing, radii, control metrics), `effects.css` (shadows, focus, motion, z), `base.css` (element defaults).
- `components/components.css` — all component styles (`fs-` prefix), shipped via `styles.css`.
- `components/` — React primitives (see list below), each with `.jsx`, `.d.ts`, `.prompt.md` and a card per folder.
- `ui_kits/web-app/` — interactive recreation of the Toques player (`index.html` desktop, `mobile.html` phone). See its README.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `assets/brand/` — logo crops (PNG). `assets/icons/` — Lucide SVGs used by the system.
- `fonts/` — Montserrat + JetBrains Mono variable woff2 (latin + latin-ext).
- `thumbnail.html` — project tile. `SKILL.md` — Agent Skill entry.

## Components
Namespace: `window.FanfarraStudioDesignSystem_fca01a`.
- **actions/** — `Button` (primary/secondary/ghost), `IconButton`, `ToggleButton` (Loop), `PlayButton`
- **forms/** — `Select` (BPM, compasso), `Slider`, `VolumeSlider`
- **feedback/** — `StatusMessage` (Sucesso / Aviso / Erro)
- **navigation/** — `NavItem`
- **layout/** — `Panel`
- **player/** — `TransportControls`, `TrackHeader`, `StepSequencer`
- **icons/** — `Icon` (+ `ICON_PATHS`)

All map to elements visible on the reference board. **Intentional additions:** `Icon` (wrapper so every glyph comes from one Lucide set), `Slider` (generic base under `VolumeSlider`), `Panel` (the board's rounded container, formalised). `StatusMessage` gained a `banner` variant and dismiss button for real-world feedback; the `Select` menu (open state) is not shown in the source and was designed to match.

---

## CONTENT FUNDAMENTALS
- **Language:** Brazilian Portuguese (pt-BR) throughout. Instrument and section names stay in Portuguese — *Bumbo, Prato, Tarol, Surdo, Repique; Toques, Sobre, Contato; compasso(s)*.
- **Tone:** a band instructor, not a software vendor — short, warm, encouraging. Imperatives in the tagline ("Aprenda. Toque. Evolua."), plain statements elsewhere.
- **Person:** address the user implicitly or as *você*; the product never says "eu/nós" in UI. Prefer verbs without pronouns: "Toque junto", "Escolha um toque".
- **Casing:** Sentence case for everything ("Botão Primário" on the board is a specimen label; real buttons: "Salvar toque"). Never ALL CAPS. Proper titles of toques in Title Case ("Marcha de Entrada").
- **Length:** labels are 1–2 words; status messages one short sentence with a period or a single "!" for success ("Operação realizada!", "Atenção necessária.", "Algo deu errado.").
- **Numbers & units:** in JetBrains Mono — "120 BPM", "4/4", bar numbers "1 2 3 4". Use the middle dot as a separator: "5 instrumentos · 4 compassos".
- **Emoji:** never. Unicode used only for `·` separators and the `!` glyph in warning badges.
- **Vibe:** studio-dark, focused, rhythmic — the music is the color; the UI stays quiet.

## VISUAL FOUNDATIONS
- **Color:** a near-black, slightly violet-tinted ink scale (`#101018` background, `#1A1A24` surface, `#2E2E3E` border) with a single brand accent, **violet `#8B5CF6`** (light `#A78BFA`). The accent is reserved for: play button, primary button, active nav, playhead, slider fill, selected/pressed states, and "Studio" in the wordmark. Five **instrument hues** (Bumbo amber `#F59E0B`, Prato sky `#38BDF8`, Tarol green `#22C55E`, Surdo purple `#A855F7`, Repique pink `#EC4899`) belong to the grid — dots and step blocks only. Status colors reuse them (success = Tarol green, warning = Bumbo amber, danger = Repique pink).
- **Type:** Montserrat (600–800) for titles and Montserrat 400–500 for UI text; JetBrains Mono for values, BPM, time signatures, bar numbers and the toque's group subtitle. Title 32/700, section heading 20/700, body/label 15–16, caption 13.
- **Theme:** dark only. No light mode exists in the source; don't invent one.
- **Backgrounds:** flat solid ink — no photos, gradients, textures or illustrations. The step grid *is* the imagery.
- **Layering:** elevation = lighter ink step (`bg-app` → `surface-panel` → `surface-card` → `surface-raised`) + 1px subtle border; shadows are soft and dark, mostly invisible on black.
- **Corner radii:** 4 (step blocks) · 6 (track headers) · 10 (nav items, swatches) · 12 (buttons, selects, toggles) · 16 (panels) · 24 (app frame); circles for play/transport/dots.
- **Borders:** 1px `--border-subtle`/`--border-default` on panels and pills; 1.5px `--ink-600` on secondary buttons. No colored left-border accents on cards — the only edge bar is the 4px violet bar on the active nav item.
- **Shadows & glow:** panels `--shadow-panel`; popovers `--shadow-pop`; violet glow (`--shadow-accent`) only on the play button and primary button; step blocks have a faint glow in their own hue.
- **Cards/panels:** `--surface-panel` fill, 1px subtle border, 16px radius, 24px padding, title 20/700 top-left.
- **Grid motif:** rows 56px with 4px dark gaps; bar lines `#2E2E3E`, beat lines 6% white, step lines 3% white; blocks are rounded 4px pills 22px tall inset 3px in the cell. Playhead = 2px violet line with a 14px knob in the ruler.
- **Hover:** quiet — +4% white overlay on ghost controls, border steps one ink lighter on pills, violet goes lighter (`#9A70F8`) on filled buttons. Empty grid cells preview a 22% ghost block in the instrument color.
- **Press:** scale .97 (buttons) / .94 (icon buttons) / .95 (play) + darker violet `#7C3AED` on filled. Toggles go violet-soft fill + violet border.
- **Focus:** always visible on keyboard focus — 2px bg gap + 2px violet ring (`--focus-ring`).
- **Motion:** short and functional — 80/120/180/280ms, `cubic-bezier(.2,.8,.2,1)`, no bounce, no decorative loops. The only continuous motion is the playhead and the hit flash on blocks under it. `prefers-reduced-motion` disables transitions.
- **Transparency & blur:** only the mobile drawer scrim (60% ink + 2px blur) and soft accent fills (`--accent-soft` 20%).
- **Layout:** desktop = 180px sidebar + fluid main inside a 16px-radius frame with 24px page margin; player header (title left, toolbar right), centered transport, sequencer, 72px footer bar. Mobile = header with horizontal logo + menu, stacked title, selects, transport, compact grid (scrolls horizontally, follows the playhead), volume footer.
- **Imagery color vibe:** n/a — no photography in the source. If ever needed: dark, low-key, violet-tinted.
- **Accessibility:** hit targets ≥ 34px desktop / ≥ 44px touch; every icon button has a pt-BR `aria-label`; sliders and selects are keyboard operable; space bar toggles play. Note: white on `#8B5CF6` is ~4.2:1 — fine for the 16px/500 button label as used, but avoid smaller white text on violet.

## ICONOGRAPHY
- **Set:** the board's icons are thin, round-capped line icons that match **Lucide** (24px grid, 2px stroke). No icon font or SVGs were supplied, so the system uses **Lucide (lucide-static@0.460.0)** — ⚠️ a *substitution* based on visual match. SVGs are in `assets/icons/`; the same paths are embedded in the `Icon` component.
- **Style:** stroke `currentColor`, round caps/joins; transport glyphs (`play`, `pause`, `skip-back`, `skip-forward`, `square`) render **filled** like the reference.
- **Sizes:** 16 (compact/inline), 20 (default UI), 22–24 (transport, nav).
- **Mapping used:** Toques `music` · Sobre `info` · Contato `mail` · BPM `music-2` · compasso `drum` (closest to the board's odd metronome glyph) · Loop `rotate-cw` · volume `volume-1/2/x` · fullscreen `expand/shrink` · menu `menu` · back `arrow-left` · sidebar footer `chart-no-axes-column` · status `check`, `x`.
- **Emoji / unicode:** no emoji. `!` (Montserrat 800) stands in for the warning glyph, since Lucide has no bare exclamation.
- **Logo:** the drum-with-sticks mark + "Fanfarra **Studio**" wordmark exists only as pixels on the board. `assets/brand/` holds crops (`logo-stacked`, `logo-horizontal`, `logo-mark`), each also as `-transparent.png` (background keyed out). They're low-res (≈100–170px source) and **for dark backgrounds only** (white "Fanfarra"). No vector logo was provided and none was redrawn.

## Fonts
Montserrat and JetBrains Mono are both on the board by name; the woff2 files were pulled from Google Fonts (OFL) into `fonts/` and declared in `tokens/fonts.css`. These are the official families, not substitutes — but confirm they're the versions you license.
