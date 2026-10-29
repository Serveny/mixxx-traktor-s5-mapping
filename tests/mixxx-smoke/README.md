# Mixxx Smoke Tests

`npm run test:mixxx-smoke` starts the sibling Mixxx build with an isolated settings directory and the S5 controller mapping installed.

## What it does

1. Locates `../mixxx/build/mixxx` (or `../../../mixxx/build/mixxx`)
2. Ensures `dist/Traktor-Kontrol-S5.js` exists (run `npm run build` first)
3. Copies the built JS and the HID XML mapping into a temp settings directory
4. Runs Mixxx with `--controller-debug --controller-abort-on-warning --developer`
5. Parses the output for controller-specific errors and warnings

## Prerequisites

- A built Mixxx binary at `../mixxx/build/mixxx`
- A built controller mapping at `dist/Traktor-Kontrol-S5.js` (`npm run build`)
- The HID XML mapping at `mapping/Traktor Kontrol S5.hid.xml` (in this repository)

## Exit behavior

- Exits with **1** if controller errors (script exceptions, mapping load failures) are found
- Exits with **0** on success or if prerequisites are missing (with a WARN message)

This is a smoke test, not a full controller E2E test. It verifies that the mapping loads without crashing in Mixxx's JavaScript engine.
