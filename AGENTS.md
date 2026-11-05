# AGENTS.md

TypeScript Mixxx controller mapping for the Native Instruments Traktor Kontrol S5 (HID), plus a separate
bulk/QML preset for the two displays in `screens/`. See `README.md` and `screens/README.md`.

- Behavioral reference: `docs/traktor_kontrol_s5_manual_english.md`. Follow it unless Mixxx can't, and
  cite the section in a `// -- 🚜 S5 Docs x.y` comment.
- `src/mapping.ts` is the verified HID byte map: change offsets only after testing them on hardware.
- Components register children explicitly and switch decks via `rebindGroup`; no reflection or
  string rewriting of groups.
- `attic/` is reverse-engineering scratch material, not part of the build.
- Check: `npm run check`, `npm run test:run`, `npm run build` (copies the build into Mixxx's controller
  directory via a local symlink).
- The screens need a locally patched Mixxx in `../mixxx` (see `screens/README.md`). Screen QML renders in
  its own thread: no `ListView`/dynamic models, no bindings to GUI-thread models.
