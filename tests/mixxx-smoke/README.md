# Mixxx Smoke Tests

`npm run test:mixxx-smoke` starts the sibling Mixxx build with an isolated settings directory.

The script is intentionally lightweight:

- it detects `../mixxx/build/mixxx` and `../../../mixxx/build/mixxx`
- it runs Mixxx with `--controller-debug --controller-abort-on-warning --developer`
- it treats warnings and exceptions as a visible warning result instead of silently passing

This is a smoke test, not a full controller E2E test.
