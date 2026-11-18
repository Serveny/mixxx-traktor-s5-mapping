# Traktor Kontrol S5 Screens

Mixxx bulk/QML preset for the two built-in S5 displays. It is separate from the
TypeScript HID mapping: buttons, encoders, faders, pads and LEDs stay in the
HID mapping, and the displays run over USB bulk + Mixxx QML.

## Status

Working on hardware with Mixxx 2.7-alpha (upstream `main`):

- Track Deck view per S5 manual 4.2.1.3, laid out like TRAKTOR: a compact header with artwork,
  title, artist, loop size (circle, green while a loop is active), key (Open Key, highlighted with
  keylock), remaining/elapsed time (red in the last 30 s), BPM, MASTER/SYNC/tempo deviation and deck
  letter; the rest of the screen is the waveform.
- Scrolling waveform in TRAKTOR-like blue tones (zoom with Display Buttons 3/4), beat grid, cue mark,
  red play head. Normalized to the track's peak and unaffected by EQ knobs and pregain. An active loop
  turns the waveform green on a dark green background, with green ▲ markers at loop in/out (Mixxx patch 4).
- Normalized overview waveform with play position, hotcue markers and green ▲ loop in/out markers.
- Stem decks (manual 3.8): one box per stem in the stem colour, filled to the stem volume, dimmed when muted.
- The other deck on the same side (C below A, D below B) as a slim row with title, BPM and
  progress, shown when it has a track loaded (a reduced form of the manual's Split View).
- BPM / KEY / SLICE SIZE / QUANTIZE pop-ups.
- Browser (manual 2.1, `S5/BrowserView.qml`): BROWSE opens it, turning scrolls (SHIFT: 8 rows),
  pressing loads; BACK/VIEW close it. SORT BY (TITLE, ARTIST, BPM, KEY) and PREVIEW via the
  Performance Mode buttons and the LOOP encoder. Only the full track collection is listed:
  Mixxx's QML library has no playlists/crates yet, and IMPORT DATE / # are not exposed as columns.

Needs Mixxx's controller shared-data API (open PR mixxxdj/mixxx#16129, see below):

- Following deck switches (A/C, B/D): without it the screens stay on Deck A and B.
- Showing pop-ups and the browser: the HID mapping publishes its state through `src/screen-state.ts`
  (one shared value per screen entity `leftdeck` / `rightdeck`).
- Both mapping XMLs need `sharedDataNamespace="S5"` on their `<controller>` element. The bulk XML here
  has it; add it to `Traktor Kontrol S5.hid.xml` as well.

Screen QML runs in its own render thread: Qt aborts when a view's delegates are created there for a
model (`Illegal attempt to connect ... in a different thread`). Use fixed `Repeater { model: N }` rows
instead of `ListView` or dynamic models, and copy GUI-thread data (like the library) into JS values.

Not implemented: full Split View toggle, Remix Deck view, device settings screen.

Protocol details: `protocol/notes.md`.

## Mixxx requirements

All patches below are ready to build on the branch
[`Serveny/mixxx@s5-display-screens`](https://github.com/Serveny/mixxx/tree/s5-display-screens)
(rebased onto Mixxx `main` from time to time, so expect force-pushes):

```bash
git clone -b s5-display-screens https://github.com/Serveny/mixxx.git ../mixxx
cmake -S ../mixxx -B ../mixxx/build -DLLD_SUPPORT=OFF   # add -DQGLES2=ON for GLES, see below
cmake --build ../mixxx/build --target mixxx -j "$(nproc)"
```

What the branch changes, to apply by hand on another Mixxx checkout. Patches 1 and 4 alone are enough
for the deck views (decks A/B, no deck switching, pop-ups or browser); patch 3 adds the rest:

1. `src/controllers/bulk/bulksupported.h`: register the S5:

   ```cpp
   {{0x17cc, 0x1420}, {0x00, 255, 0x03, 0x04}}, // Traktor NI S5
   ```

2. GLES builds only (`-DQGLES2=ON`): in
   `src/controllers/rendering/controllerrenderingengine.cpp`, apply `fboImage.rgbSwap()` when
   `m_screenInfo.reversedColor` is set rather than on an endian mismatch. Without this, red and blue are swapped.

3. Shared data: apply PR mixxxdj/mixxx#16129 (`gh pr diff 16129 -R mixxxdj/mixxx | git apply --3way`),
   then on current `main`:
   - `src/controllers/controllermanager.cpp`: also call `pController->setSharedData(m_pSharedData)` before
     `pController->open(...)` in the startup path (`slotSetUpDevices`), not only in `openController()`;
     otherwise controllers opened at startup report "No shared data available".
   - same file: `m_pSharedData->moveToThread(m_pThread.get())` after `moveToThread(m_pThread.get())`;
     otherwise the per-controller namespace objects end up without a parent and crash on first use.
   - `src/test/controllershareddata_test.cpp`: add `#include <QElapsedTimer>` to build the tests.

4. Waveform `ignoreEq` / `normalized` properties for the QML signal renderers and loop colors
   (`loopLowColor` / `loopMidColor` / `loopHighColor`) for the RGB renderer (commits
   [`ab9051aa83`](https://github.com/Serveny/mixxx/commit/ab9051aa83) and
   [`d4c236e3b3`](https://github.com/Serveny/mixxx/commit/d4c236e3b3) on the branch). Without them, the screens fail
   to load because `DeckScreen.qml` sets these properties.

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
