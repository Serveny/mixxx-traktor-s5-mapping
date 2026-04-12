# Roadmap: Mixxx Traktor S5 Mapping

Features ordered by importance (user impact, prerequisite depth, and implementation effort).

---

## Phase 1 — Core Playback & Navigation

These features are expected to work on any DJ controller and block basic usability.

### Display Pop-up System
**Prerequisite for BPM, Key, Quantize, Slice Size pop-ups.**
- [ ] Pop-up state management (active pop-up, dismiss on timeout/button release)
- [ ] Display area synchronisation with pop-up content
- [ ] BPM pop-up (Display Button 1) — tempo adjust via BROWSE encoder
- [ ] KEY pop-up (Display Button 2) — key display + adjust via BROWSE encoder
- [ ] Keylock activation and key adjustment while Keylock is active
- [ ] SLICE SIZE pop-up (Shift + LOOP Touch)
- [ ] QUANTIZE pop-up (Display Button 2 in Remix Mode)

### Loop Encoder — Missing Functions
- [ ] Fixed loop size preset list (1/32, 1/16, 1/8, 1/4, 1/2, 1, 2, 4, 8, 16, 32 beats)
- [ ] Beatjump navigation with Shift + Rotation
- [ ] Loop Save on Pad (store active loop to Hotcue slot)
- [ ] Loop Delete with Shift + Pad

### Hotcue Mode — Page Switching
- [ ] `onShortPress()` cycles through Hotcue pages 1 / 2 / 3 ([hotcue-mode-button.ts:42](src/components/buttons/hotcue-mode-button.ts#L42))
- [ ] Page 1: Hotcues 1–8 (current behavior)
- [ ] Page 2: Hotcues 5–12 (offset mapping)
- [ ] Page 3: Hotcues 13–20 (offset mapping)
- [ ] Button color reflects active page

### Deck Button Color Output
- [ ] Blue LED = Deck A/B active
- [ ] White LED = Deck C/D active

### Settings Button
- [ ] Map SETTINGS button to Mixxx preferences or a sensible fallback action

---

## Phase 2 — Performance Features

These are the features DJs actively use during a set.

### Flux Mode
- [ ] Flux button toggles `[ChannelN] slip_enabled`
- [ ] Pad behavior: Release returns playhead to slip position instead of cue point
- [ ] 2-Beat Backspin via Hold Shift + fast swipe on Touch Strip
- [ ] Freeze Mode + Flux combination
- [ ] LED indicator on Flux button

### Slicer Mode (extension of Freeze Mode)
- [ ] Slicer Mode activation (separate from Freeze)
- [ ] Pads trigger individual slices
- [ ] Hold Pad = loop that slice
- [ ] Live Slice Size adjustment during Slicer Mode
- [ ] Waveform display shows slice numbers 1–8

### Multi-Page Pad Modes
- [ ] Beatloop Roll Mode (Pads = loop sizes, release returns to playback)
- [ ] Sampler Mode (Pads trigger Mixxx sampler slots 1–8)
- [ ] Keyboard Mode (Pads play track at different pitches/keys)

### Touch Strip — Advanced Features
- [ ] 2-Beat Backspin (fast backward swipe) with Flux Mode integration
- [ ] Motor Mode: hold touch strip to tempo-adjust while playing
- [ ] Touch to Scratch preference gates scratch behavior correctly

### Tempo Encoder Refinements
- [ ] Whole-step mode with Shift + Rotation
- [ ] Center-snap on release
- [ ] Soft-takeover LED color feedback (low/high indicator)

---

## Phase 3 — Mixer & FX Completeness

### Shift + Mixer Column → Aux / Mic Input
- [ ] Wire `mixerControlsMixAuxOnShift` setting into Shift handler ([s5-mixer-column.ts:115](src/components/s5-mixer-column.ts#L115))
- [ ] `updateGroup()` called on Shift press/release to switch target group
- [ ] Aux Input toggle per channel
- [ ] Mic Input with preamp control

### FX Unit — Effect Selection & Routing
- [ ] Shift + FX Button 1 opens FX Unit menu
- [ ] Group FX vs. Single FX mode selection
- [ ] Effect slot exchange
- [ ] FX Snapshot save/load
- [ ] FX Routing: Insert / Post-Fader / Send

### Quantize Controls
- [ ] Quantize pop-up with selectable quantize values
- [ ] Visual feedback in display
- [ ] Quantize applied to sample triggering in Remix Mode

---

## Phase 4 — Remix Deck

Requires understanding of Mixxx's sampler infrastructure. Large but self-contained.

### Remix Deck (Deck C/D as Remix Deck)
- [ ] Load Remix Deck (`[Sampler1]`–`[SamplerN]` groups)
- [ ] Sample triggering via Pads (8 pads × 8 pages = 64 slots)
- [ ] Page navigation via LOOP encoder
- [ ] Remix Slot Muting: Shift + Pad
- [ ] Capture Mode: capture playing audio to Remix slot via Touch Strip
- [ ] Quantize for sample triggering
- [ ] Per-slot loop length indicator in display

---

## Phase 5 — Stem Deck

Requires `.stem.mp4` support in Mixxx (currently limited). Implement when Mixxx adds proper stem support.

### Stem Deck
- [ ] Load Stem files
- [ ] Separate Stem-Part control (Drums, Percussion, Synths, Vocals)
- [ ] Stem-specific EQ / FX assignment
- [ ] Stem level meters
- [ ] Per-stem fader control via Pads

---

## Phase 6 — Motorized Wheel / Turntable Emulation

Uncomment and complete the existing stub code. Low priority as the Touch Strip covers most use cases.

- [ ] Motor Mode wheel control (`wheelModes.motor`)
- [ ] Wheel LED output for play position
- [ ] RPM emulation for 33⅓ and 45 RPM ([s5-deck.ts:327](src/components/s5-deck.ts#L327))

---

## Known Bugs / Technical Debt

- [ ] Library focus workaround for Mixxx Bug [mixxxdj/mixxx#11285](https://github.com/mixxxdj/mixxx/issues/11285) — revisit when upstream is fixed ([browser-encoder.ts:46](src/components/encoders/browser-encoder.ts#L46))
- [ ] Preview Deck: LOOP encoder beatjump (+/- 16 beats) is commented out ([browser-encoder.ts:41](src/components/encoders/browser-encoder.ts#L41))
