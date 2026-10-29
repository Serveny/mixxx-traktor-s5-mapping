import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

const mockEngine = () => globalThis.engine as any;
const set = (group: string, key: string, value: number) => mockEngine().setValue(group, key, value);
const get = (group: string, key: string): number => mockEngine().getValue(group, key);
const leftReport = () => globalThis.__mixxxTestState;

describe('transport behaviour from the S5 manual', () => {
	beforeEach(() => {
		set('[App]', 'num_decks', 4);
		set('[App]', 'num_samplers', 16);
	});

	test('shift+sync makes the deck tempo master (4.2.6)', () => {
		const s5 = new S5(mapping);
		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.syncButton.onShortRelease();
		expect(get('[Channel1]', 'sync_leader')).toBe(1);
		expect(get('[Channel1]', 'sync_enabled')).toBe(0);
	});

	test('sync LED is green in phase, red out of phase, dim when not synced (4.2.6)', () => {
		const s5 = new S5(mapping);
		const syncIo = mapping.deckLeft.transportControls.sync;
		const led = () => {
			const data = s5.reports.out[syncIo.outReportId].data;
			return [data[syncIo.outByte], data[syncIo.outByte + 1]];
		};

		s5.deckLeft.updatePhase();
		expect(led()).toEqual([9, 0]);

		set('[Channel1]', 'sync_enabled', 1);
		set('[Channel1]', 'play', 1);
		set('[Channel2]', 'play', 1);
		set('[Channel2]', 'sync_leader', 1);
		set('[Channel1]', 'beat_distance', 0.52);
		set('[Channel2]', 'beat_distance', 0.5);
		s5.deckLeft.updatePhase();
		expect(led()).toEqual([127, 0]);

		set('[Channel1]', 'beat_distance', 0.7);
		s5.deckLeft.updatePhase();
		expect(led()).toEqual([0, 127]);
	});

	test('phase offset wraps around the beat boundary', () => {
		const s5 = new S5(mapping);
		set('[Channel1]', 'play', 1);
		set('[Channel2]', 'play', 1);
		set('[Channel1]', 'beat_distance', 0.95);
		set('[Channel2]', 'beat_distance', 0.05);
		expect(s5.deckLeft.phaseOffset()).toBeCloseTo(-0.1);
	});

	test('touch strip shows phase: centre red when aligned, blue towards the offset (3.1.2)', () => {
		const s5 = new S5(mapping);
		const leds = mapping.deckLeft.touchStrip.leds;
		const data = s5.reports.out[leds.blue.outReportId].data;

		s5.deckLeft.touchStrip.showPhase(0);
		expect(data[leds.red.outByte + 12]).toBe(127);

		s5.deckLeft.touchStrip.showPhase(0.25);
		expect(data[leds.red.outByte + 12]).toBe(0);
		expect(data[leds.blue.outByte + 13]).toBe(127);
		expect(data[leds.blue.outByte + 18]).toBe(127);
		expect(data[leds.blue.outByte + 19]).toBe(0);
		expect(data[leds.blue.outByte + 11]).toBe(0);
	});

	test('shift shows the play position again after an unshift at the same position (3.1.1)', () => {
		const s5 = new S5(mapping);
		const leds = mapping.deckLeft.touchStrip.leds;
		const data = s5.reports.out[leds.blue.outReportId].data;
		set('[Channel1]', 'playposition', 0.5);

		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.shiftButton.input(0);
		s5.deckLeft.shiftButton.input(1);
		expect(data[leds.red.outByte + 12]).toBe(127);
		expect(data[leds.blue.outByte + 12]).toBe(0);
		expect(data[leds.blue.outByte + 0]).toBe(127);
	});

	test('tempo encoder changes the master tempo by 0.01 BPM, shift by 1 BPM (4.4.2.4)', () => {
		const s5 = new S5(mapping);
		const encoder = s5.mixer.tempoEncoder;
		set('[Channel2]', 'sync_leader', 1);
		set('[Channel2]', 'bpm', 120);

		encoder.input(5);
		encoder.input(6);
		expect(get('[Channel2]', 'bpm')).toBe(120.01);

		s5.deckRight.shiftButton.input(1);
		encoder.input(5);
		expect(get('[Channel2]', 'bpm')).toBe(119.01);
	});

	test('tempo encoder adjusts the internal clock when no deck is master', () => {
		const s5 = new S5(mapping);
		set('[InternalClock]', 'bpm', 124);
		s5.mixer.tempoEncoder.input(5);
		s5.mixer.tempoEncoder.input(6);
		expect(get('[InternalClock]', 'bpm')).toBe(124.01);
	});

	test('flux button toggles flux mode (3.4)', () => {
		const s5 = new S5(mapping);
		s5.deckLeft.fluxButton.onShortPress();
		s5.deckLeft.fluxButton.onShortRelease();
		expect(get('[Channel1]', 'slip_enabled')).toBe(1);
		s5.deckLeft.fluxButton.onShortPress();
		expect(get('[Channel1]', 'slip_enabled')).toBe(0);
	});

	test('releasing a hotcue pad in flux mode returns to the flux playhead (3.4)', () => {
		const s5 = new S5(mapping);
		set('[Channel1]', 'slip_enabled', 1);
		const calls = globalThis.engine.setValue as unknown as { mock: { calls: unknown[][] } };

		s5.deckLeft.pads[2].input(1);
		const before = calls.mock.calls.length;
		s5.deckLeft.pads[2].input(0);
		const slipCalls = calls.mock.calls
			.slice(before)
			.filter((c) => c[0] === '[Channel1]' && c[1] === 'slip_enabled')
			.map((c) => c[2]);
		expect(slipCalls).toEqual([0, 1]);
	});

	test('loop encoder press only holds a loop while pressed in flux mode (4.2.8)', () => {
		const s5 = new S5(mapping);
		set('[Channel1]', 'slip_enabled', 1);
		s5.deckLeft.loopEncoder.onPress(1);
		expect(get('[Channel1]', 'beatlooproll_activate')).toBe(1);
		s5.deckLeft.loopEncoder.onPress(0);
		expect(get('[Channel1]', 'beatlooproll_activate')).toBe(0);
	});

	test('loop LED is blue on deck A and white on deck C while a loop is active (4.2.8)', () => {
		const s5 = new S5(mapping);
		const io = mapping.deckLeft.loopLed;
		const data = s5.reports.out[io.outReportId].data;

		s5.deckLeft.loopLed.output(1);
		expect([data[io.outByte], data[io.outByte + 1]]).toEqual([0, 127]);

		s5.deckLeft.toggleDeck();
		s5.deckLeft.loopLed.output(1);
		expect([data[io.outByte], data[io.outByte + 1]]).toEqual([127, 0]);
		expect(leftReport().timers.size).toBeGreaterThan(0);
	});
});
