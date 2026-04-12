# S5 Teststruktur und Bugabsicherung Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eine gestufte Teststruktur aufbauen, die Deck-Switch-/Shift-Bugs zuverlässig absichert, die S5-Funktionen aus dem Manual systematisch abdeckt und zusätzlich einen beobachtbaren DJ-Set-Szenario-Test mit echten Audiodateien ermöglicht.

**Architecture:** Die Tests werden primär im TypeScript-Projekt aufgebaut: Unit- und Integrations-Tests laufen gegen gemockte Mixxx-Globals (`engine`, `controller`, `script`) und simulierte HID-Reports. Mixxx selbst wird nur für Smoke-/Ladetests und optional sichtbare Szenarioläufe eingebunden. Das Manual wird als Spezifikationsquelle in eine Testmatrix übersetzt, damit klar bleibt, welche S5-Funktionen bereits abgesichert sind.

**Tech Stack:** TypeScript, Vite, Vitest, Mixxx CLI, vorhandene Mixxx-Type-Definitionen aus `../mixxx`, isolierte Test-Fixtures für Mixxx globals und HID reports

---

## Phase 1

1. Vitest-Test-Harness und Mock-Umgebung für `engine`, `controller`, `script` anlegen.
2. Reusable HID-/Connection-Fixtures anlegen.
3. Kern-Unit-Tests für `component-container`, `component`-Mixins und `hid-report` hinzufügen.
4. Integrations-Tests für Deck-Switch, Shift-Button und Pad-Button ergänzen.
5. Gefundene Defekte minimal beheben.

## Phase 2

1. Weitere Integrations-Tests für `touch-strip`, `flux-button`, `sync-button`, `cue-button` ergänzen.
2. Manual in eine Coverage-Matrix unter `tests/spec/` übersetzen.
3. README um Teststrategie und neue Kommandos ergänzen.

## Phase 3

1. Mixxx-Smoke-Harness mit isoliertem `--settings-path` und `--resource-path` anlegen.
2. Audio-Manifest und Preflight-Check für DJ-Set-Szenarien ergänzen.
3. Deterministischen DJ-Set-Szenario-Runner für simulierte Ausführung bauen.
4. Optional sichtbaren Live-Runner für manuelle Beobachtung gegen laufendes Mixxx ergänzen.

## Verification

1. `npx vitest run`
2. `npm run check`
3. `npm run build`
4. Optional: `node tests/mixxx-smoke/run-mixxx-smoke.mjs`
