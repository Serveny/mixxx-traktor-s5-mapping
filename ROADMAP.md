# Roadmap: Mixxx Traktor S5 Mapping

What is still missing compared to the [S5 manual](docs/traktor_kontrol_s5_manual_english.md), ordered by
user impact. Section numbers refer to the manual.

## Done

- Browser on the deck display: scroll, load, preview, SORT BY, touch to open (2.1)
- Deck focus A–D, waveform zoom, VIEW button (2.5, 2.6)
- HOTCUE mode with three pages, stored loops, delete with SHIFT (2.7, 3.2.3)
- BPM and KEY pop-ups, keylock, tempo encoder (2.8, 2.9, 4.4.2.4)
- Touch strip: seek (SHIFT), nudge, scratch while stopped, phase meter LEDs (3.1, 4.2.5)
- Loops: size presets, beatjump / loop move with SHIFT, loop LED, FLUX loop roll (3.2, 4.2.8)
- FREEZE mode with slice size pop-up and Slicer mode (3.3)
- FLUX mode incl. hotcues and Freeze (3.4)
- REMIX mode on samplers: trigger, stop, mute, page scroll, capture from the track (3.5, 3.6)
- FX units in Group and Single mode, deck assignment, parameter pop-up on knob touch (3.7.1, 3.7.2, 4.3)
- Stem decks: mute, select, volume and filter per stem (3.8)
- Beatgrid mode: OFFSET / BPM / FINE / SCAN, LOCK, TAP, RST (3.9)
- Mixer: channels, EQ, filter, CUE, crossfader, VU meters, MAIN clip LEDs, AUX, Quantize (4.4)

## Open

### Touch strip
- [ ] Backspin: SHIFT + fast swipe from right to left, stops when SHIFT is released (3.1.3)
- [ ] 2-beat backspin in FLUX mode (3.4)
- [ ] Remix decks: tempo bend, backspin and hold of the samples (3.5.5)

### Remix
- [ ] Apply the QUANTIZE pop-up size to sample triggering; today it is only shown (3.5.3)
- [ ] Per-slot loop length / Remix Deck view on the display (3.5, screens)

### FX
- [ ] FX Unit menu (SHIFT + FX Button 1): today it only toggles Group / Single mode (3.7.2)
- [ ] Exchange effects in a Group FX via the menu and BROWSE (3.7.3)
- [ ] Snapshot: store effect parameters as default (3.7.4)
- [ ] FX routing Insert / Post Fader / Send, if Mixxx gets an equivalent (3.7.5)
- [ ] Single Mode: show the focused effect while SHIFT + long press on an FX button is active; leaving
      the focus is not mapped yet

### Displays and buttons
- [ ] Slice numbers 1–8 in the waveform during Freeze / Slicer mode (3.3)
- [ ] Settings button: opens the device settings screen; today it toggles the maximized library (4.2.1.1)
- [ ] Snap button (S) in the GLOBAL section: in the HID map but not mapped; Mixxx has no Snap mode (4.4.2.6)
- [ ] Full Split View toggle (screens)

### Waiting on Mixxx
- [ ] Display browser with playlists and crates: needs library access for controller screens
      ([mixxxdj/mixxx#4594](https://github.com/mixxxdj/mixxx/pull/4594))
- [ ] Display deck switching, pop-ups and browser without local patches: needs
      [mixxxdj/mixxx#16129](https://github.com/mixxxdj/mixxx/pull/16129)
- [ ] Browsing without a focused Mixxx window ([mixxxdj/mixxx#11285](https://github.com/mixxxdj/mixxx/issues/11285))

## Technical debt

- [ ] SHIFT + FLUX "loop move mode" (LOOP encoder moves the loop by a fixed sample distance) is a leftover
      from the S4 MK3 mapping and not in the S5 manual; SHIFT + LOOP turn already moves an active loop
      (3.2.2). Remove it together with its two preferences, or document it.
- [ ] `tests/spec/manual-coverage.json`: two entries are still `planned` (2.2.2, 2.3.2)
