# AGENTS.md

## Project Purpose

This repository contains a TypeScript-based Mixxx controller mapping for the Native Instruments Traktor Kontrol S5. The codebase models the S5 hardware layout, maps HID input and LED output reports, and connects controller interactions to Mixxx controls.

The project is still work in progress. Preserve existing behavior unless a change explicitly targets a known bug or an unmapped controller feature.

## Tech Stack

- TypeScript
- Vite library build
- Mixxx controller scripting APIs and type definitions

## Repository Layout

- `src/`: main project source
- `src/components/`: controller behavior split by hardware area and reusable base components
- `src/components/buttons/`: button-specific behavior
- `src/components/encoders/`: encoder-specific behavior
- `src/types/`: mapping and Mixxx typing helpers
- `attic/`: temporary data, reverse-engineering notes, experiments, other mappings, logs, and helper artifacts; not part of the real project surface
- `README.md`: development setup, status, HID report documentation, and known issues

## Key Architecture Notes

- `src/main.ts` boots the mapping by instantiating `S5`.
- `src/s5.ts` wires the full controller together and registers periodic Mixxx connections.
- `src/mapping.ts` is the authoritative HID/LED byte-map. Keep edits here exact and verified.
- `src/hid-report.ts` contains the low-level HID input/output report helpers.
- `src/components/` contains the higher-level controller logic for decks, mixer, pads, encoders, and buttons.
- `src/settings.ts` reads Mixxx runtime settings and exposes controller-specific configuration.
- `src/components/component.ts` and `src/components/component-container.ts` define the component binding lifecycle. Treat changes there as architecture work, not local cleanup.
- `ComponentContainer` instances are expected to register child components explicitly via the container API. Do not rely on property iteration/reflection to discover children for shift propagation, reconnects, or deck switching.
- Deck switching should use explicit `rebindGroup(...)` behavior on group-bound components. Avoid regex- or string-heuristic rewrites of `group` values during runtime.
- HID report subscriptions and Mixxx control bindings are separate concerns: changing a Mixxx `inKey`/`outKey` must not imply reconnecting HID input callbacks unless the HID report position itself changes.

## Setup And Common Commands

Run these from the repository root:

- `npm install`
- `npm run check`: TypeScript type-check
- `npm run build`: type-check and build the controller mapping
- `npm run dev`: watch build
- `npm run start`: launches Mixxx with `--controller-debug --developer`

## Environment Assumptions

- `tsconfig.json` includes Mixxx controller API files from system paths such as `/usr/share/mixxx/controllers/...`
- `tsconfig.json` also references a sibling `../mixxx` checkout for `engine-api.d.ts` and `mixxx-controls.d.ts`
- The development flow assumes a local Mixxx installation and a symlink or copy target for controller files as described in `README.md`
- `npm run build` may copy the emitted controller file through a local symlink into a Mixxx controllers directory. In sandboxed or read-only environments, the compile step may succeed while the final copy step fails for environmental reasons.

If type-checking fails, first verify that the external Mixxx type definition paths in `tsconfig.json` exist on the local machine.

## Change Guidelines

- Prefer minimal, targeted changes over broad refactors.
- Follow the existing structure and patterns already used in `src/components`, `src/hid-report.ts`, and `src/mapping.ts`.
- Do not hand-roll code when a suitable dependency already exists.
- Keep `mapping.ts` readable and stable; preserve its current formatting style, including deliberate `prettier-ignore` usage.
- Avoid touching `attic/` unless the task is explicitly about temporary reverse-engineering material or local helper data.
- Prefer explicit registration and lifecycle wiring over implicit discovery.
- Prefer local helper functions and constrained template-literal types when building Mixxx group strings.
- Prefer literal unions or `as const` objects for controller-specific report IDs, deck numbers, and modes instead of untyped `number` values.
- Keep historical experiments and disabled designs out of active source files when they stop informing the current implementation; move them to `attic/` or documentation instead of leaving large commented blocks in core classes.

## Testing And Validation

There is currently no automated test suite.

Before finishing a change:

- Run `npm run check` at minimum
- Run `npm run build` when the change affects emitted controller code
- For functional controller changes, validate behavior in Mixxx when possible
- If `npm run build` fails during the copy step in a sandboxed or read-only environment, distinguish environment failure from TypeScript or bundling failure in the final report.

Review and verification should focus on:

- Mixxx functionality
- Correct Traktor Kontrol S5 behavior
- HID input/output mapping regressions
- LED behavior and deck/mixer control correctness
- Binding lifecycle correctness after deck switching, shift state changes, or dynamic key rebinding
- Changes that may depend on Mixxx window focus, since the README and source mention focus-related issues

## Git And Delivery Rules

- Keep to one commit per feature
- Do not mix unrelated cleanup into feature work
- Respect existing uncommitted user changes in the worktree

## Communication Preferences

- Keep status updates concise and practical
- Explain only the reasoning needed to understand the change, risks, and verification

## High-Risk Areas

Use extra care in:

- `src/mapping.ts`
- `src/hid-report.ts`
- `src/settings.ts`
- anything that changes Mixxx control names, report IDs, byte offsets, bit offsets, or LED output lengths

Small numeric mistakes in these areas can silently break controller behavior.

## Project-Specific Notes

- The README documents current working features, work in progress areas, and known bugs; consult it before extending unfinished controls.
- `docs/traktor_kontrol_s5_manual_english.md` is the structured reference for the original Traktor Kontrol S5 manual. Use it when implementing or refining controller behavior so the mapping follows the device's documented functionality as closely as practical.
- When the manual and current code diverge, treat the manual as the behavioral reference unless the project already documents an intentional deviation, a known Mixxx limitation, or a deliberate work-in-progress gap.
- Some browse-related behavior is known to depend on Mixxx GUI focus.
- The codebase contains several TODO/FIXME notes around incomplete S5 behavior; extend existing work carefully instead of assuming the controller is feature-complete.
