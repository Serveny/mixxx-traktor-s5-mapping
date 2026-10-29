# Traktor Kontrol S5 Screens

Mixxx bulk/QML preset for the two built-in S5 displays. It is separate from the
TypeScript HID mapping: buttons, encoders, faders, pads and LEDs stay in the
HID mapping, and the displays run over USB bulk + Mixxx QML.

## Status

Working on hardware with Mixxx 2.7-alpha (upstream `main`):

- Track Deck view per S5 manual 4.2.1.3: artwork, title, artist, BPM,
  MASTER/SYNC/tempo deviation, deck letter, key (Open Key, highlighted with keylock),
  loop size (green while a loop is active), elapsed/remaining time (red in the last 30 s).
- Scrolling waveform (zoom with Display Buttons 3/4), loop range, beat grid, cue mark.
- Overview waveform with play position and hotcue markers.
- Stem decks (manual 3.8): one box per stem in the stem colour, filled to the stem volume, dimmed when muted.
- The other deck on the same side (C below A, D below B) as a slim row with title, BPM and
  progress, shown when it has a track loaded (a reduced form of the manual's Split View).
- BPM / KEY / SLICE SIZE / QUANTIZE pop-ups.

Needs Mixxx's controller shared-data API (open PRs mixxxdj/mixxx#16129 / #16778):

- Following deck switches (A/C, B/D): without it the screens stay on Deck A and B.
- Showing pop-ups: the HID mapping publishes its state through
  `src/screen-state.ts`, which does nothing until the API exists.

Not implemented: full Split View toggle, Remix Deck view, browser on the display, device settings screen.

Protocol details: `protocol/notes.md`.

## Mixxx requirements

Two local patches in the Mixxx checkout (`../mixxx`):

1. `src/controllers/bulk/bulksupported.h`: register the S5:

   ```cpp
   {{0x17cc, 0x1420}, {0x00, 255, 0x03, 0x04}}, // Traktor NI S5
   ```

2. GLES builds only (`-DQGLES2=ON`): in
   `src/controllers/rendering/controllerrenderingengine.cpp`, apply `fboImage.rgbSwap()` when
   `m_screenInfo.reversedColor` is set rather than on an endian mismatch. Without this, red and blue are swapped.

If the log shows `ControllerRenderingEngine - GLError after glReadPixels: 1282`, build Mixxx with GLES:

```bash
cmake -S ../mixxx -B ../mixxx/build -DLLD_SUPPORT=OFF -DQGLES2=ON
cmake --build ../mixxx/build --target mixxx -j "$(nproc)"
```

## Install

Symlink these into Mixxx's controller directory (here `../mixxx/res/controllers`):

```text
Traktor Kontrol S5.bulk.xml
TraktorKontrolS5Screens.qml
TraktorKontrolS5Screens/
```

Then enable `Traktor Kontrol S5 (Screens)` in the controller preferences next to the HID mapping.

## Standalone test tool

```bash
cd tools && make
S5_PRODUCT_ID=0x1420 S5_INTERFACE=4 S5_OUT_EP=0x03 ./s5_screen_test 0 0 0 480 272 f800
```

This shows a red frame on the left display. Close Mixxx first, because it holds the interface.
