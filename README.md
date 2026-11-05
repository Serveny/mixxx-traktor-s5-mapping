# 📀 Mixxx Traktor Kontrol S5 Mapping

[Mixxx](https://mixxx.org/) controller mapping for the Native Instruments Traktor Kontrol S5, written in
TypeScript. It follows the original [S5 manual](docs/traktor_kontrol_s5_manual_english.md) as closely as
Mixxx allows.

## 🎧 Usage

- Copy `dist/Traktor-Kontrol-S5.js` and `mapping/Traktor Kontrol S5.hid.xml` into
  **Preferences → Controllers → Open User Mapping Folder**
- Connect the S5, restart Mixxx, then select _Traktor Kontrol S5_ in **Preferences → Controllers**,
  choose the mapping and click **Enabled → Apply**.
- Displays require a patched Mixxx: see [screens/README.md](screens/README.md).

## 🗿 Status

Work in progress, but usable for DJing:

- ✅ Mixer: faders, EQ, filter, gain, cue, FX assign, crossfader, VU meters, MAIN clip LEDs, AUX
- ✅ Decks A–D: transport, sync with phase meter, touch strip (seek, nudge, scratch), loop encoder, FLUX
- ✅ Pad modes: HOTCUE (pages, stored loops), FREEZE with slicer, REMIX on samplers, stem control
- ✅ FX units in Group and Single mode, beatgrid editing, BPM/KEY pop-ups
- ✅ Displays: deck view, pop-ups and a track browser — needs a patched Mixxx, see below

## ⏳ Waiting on Mixxx

- **S5 display registration** (one line in `src/controllers/bulk/bulksupported.h`, not upstream yet): without
  it Mixxx does not detect the displays at all. With only this line, the displays show decks A and B.
- **Shared data between controllers** ([mixxxdj/mixxx#16129](https://github.com/mixxxdj/mixxx/pull/16129)):
  the HID mapping uses it to tell the displays about deck focus, pop-ups and the browser. Until it is merged
  the displays stay on decks A/B without pop-ups or browser; with it applied locally everything works.
- **Library access for controller screens** (no PR yet; related:
  [mixxxdj/mixxx#4594](https://github.com/mixxxdj/mixxx/pull/4594)): Mixxx's QML library offers only the
  full track collection and is not thread-safe from controller screens, so the display browser has no
  playlists/crates and reads the track list when it opens.

The HID mapping also works with an unpatched Mixxx. The browser then uses Mixxx's on-screen library
instead of the display, which needs the Mixxx window to be focused.

## 👩‍💻 Development

Developed against Mixxx `main` (2.7-alpha).

```bash
git clone https://github.com/mixxxdj/mixxx.git ../mixxx   # type definitions (and the screens' Mixxx build)
npm install
ln -s ~/.mixxx/controllers attic/mappings/controllers      # where builds get copied to
npm run dev                                                # watch build; or: npm run build
npm run start                                              # ../mixxx/build/mixxx --controller-debug --developer
```

`tsconfig.json` takes the Mixxx API types from `../mixxx/res/controllers`; adjust the paths if your
checkout lives elsewhere.

| Command                    |                                                                               |
| -------------------------- | ----------------------------------------------------------------------------- |
| `npm run check`            | type-check                                                                    |
| `npm run test:run`         | Vitest suite (components, HID input/LED output, manual scenarios)             |
| `npm run test:mixxx-smoke` | starts `../mixxx/build/mixxx` with the mapping and fails on controller errors |
| `npm run build`            | type-check, build and copy JS + XML to `attic/mappings/controllers`           |

## 📚 More

- [docs/hid-reports.md](docs/hid-reports.md): reverse-engineered HID input/output reports
- [screens/README.md](screens/README.md): display preset, Mixxx patches, display protocol
- [tests/spec/manual-coverage.json](tests/spec/manual-coverage.json): manual sections covered by tests
- `attic/`: reverse-engineering notes and tools
