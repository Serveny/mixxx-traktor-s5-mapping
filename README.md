# 📀 Mixxx Traktor Kontrol S5 Mapping

[Mixxx](https://mixxx.org/) controller mapping for the Native Instruments Traktor Kontrol S5, written in
TypeScript. It follows the original [S5 manual](docs/traktor_kontrol_s5_manual_english.md) as closely as
Mixxx allows.

## 🎧 Usage

1. **Download** this repository: **Code → Download ZIP** on GitHub, then unzip it (or `git clone` it).
2. **Open the mapping folder** in Mixxx: **Preferences → Controllers → Open User Mapping Folder**.
   It is usually:

   | OS      | User mapping folder                                                                       |
   | ------- | ----------------------------------------------------------------------------------------- |
   | Linux   | `~/.mixxx/controllers`                                                                    |
   | macOS   | `~/Library/Containers/org.mixxx.mixxx/Data/Library/Application Support/Mixxx/controllers` |
   | Windows | `%LOCALAPPDATA%\Mixxx\controllers`                                                        |

3. **Copy these two files** into that folder, side by side (no subfolder):
   - `dist/Traktor-Kontrol-S5.js`
   - `mapping/Traktor Kontrol S5.hid.xml`
4. **Connect the S5 and restart Mixxx.** In **Preferences → Controllers**, select _Traktor Kontrol S5_ in the
   list, pick the _Traktor Kontrol S5_ mapping, tick **Enabled** and click **Apply**.
5. Optional: the mapping's **Settings** tab (same page) has options such as keylock on SHIFT+SYNC and
   software gain for MAIN/BOOTH/headphones.

**Updating:** download again and overwrite both files, then restart Mixxx.

**Displays:** the two screens need a patched Mixxx and a second mapping, see
[screens/README.md](screens/README.md). Without it the S5 works fully, only the displays stay dark.

**Troubleshooting:**

- _S5 not listed (Linux):_ Mixxx needs access to the USB device. Distribution packages install the udev
  rules; for self-built Mixxx copy `res/linux/mixxx-usb-uaccess.rules` to `/etc/udev/rules.d/` and replug.
- _Mapping not listed:_ both files must be directly in the user mapping folder, with unchanged file names.
- _Close Traktor_ (or any other app using the S5) before starting Mixxx.

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
  the displays stay on decks A/B without pop-ups or browser; with it applied everything works.
- **Waveform options for controller screens** (in the branch below, not upstream yet): the display
  waveform ignores the EQ knobs and is normalized to the track's peak; without it the screens don't load.
- **Library access for controller screens** (no PR yet; related:
  [mixxxdj/mixxx#4594](https://github.com/mixxxdj/mixxx/pull/4594)): Mixxx's QML library offers only the
  full track collection and is not thread-safe from controller screens, so the display browser has no
  playlists/crates and reads the track list when it opens.

All of these patches are combined on the branch
[`Serveny/mixxx@s5-display-screens`](https://github.com/Serveny/mixxx/tree/s5-display-screens);
build instructions are in [`screens/README.md`](screens/README.md#mixxx-requirements).

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

`dist/Traktor-Kontrol-S5.js` is committed so users can install without building: run `npm run build` and
commit `dist/` together with every change to `src/`.

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
