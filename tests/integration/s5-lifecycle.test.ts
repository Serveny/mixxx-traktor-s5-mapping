import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

describe('S5 lifecycle', () => {
	beforeEach(() => {
		globalThis.engine.setValue('[App]', 'num_decks', 4);
		globalThis.engine.setValue('[App]', 'num_samplers', 16);
	});

	test('init reads the knobs/fader input report', () => {
		const s5 = new S5(mapping);

		s5.init();

		expect(globalThis.controller.getInputReport).toHaveBeenCalledWith(2);
	});

	test('shutdown sends zeroed LED reports to all three output reports', () => {
		const s5 = new S5(mapping);

		// Clear calls from constructor so we only see shutdown calls
		(globalThis.controller.sendOutputReport as ReturnType<typeof import('vitest').vi.fn>).mockClear();

		s5.shutdown();

		const calls = (
			globalThis.controller.sendOutputReport as ReturnType<typeof import('vitest').vi.fn>
		).mock.calls;

		// Should send report 128 (left deck LEDs), 130 (mixer LEDs), 129 (right deck LEDs)
		const reportIds = calls.map((call: unknown[]) => call[0]);
		expect(reportIds).toContain(128);
		expect(reportIds).toContain(129);
		expect(reportIds).toContain(130);

		// Each shutdown report should contain all zeros
		for (const call of calls) {
			const reportId = call[0] as number;
			const data = new Uint8Array(call[1] as ArrayBuffer);
			expect(data.every((b: number) => b === 0)).toBe(true);
		}
	});

	test('shutdown sends correct buffer lengths', () => {
		const s5 = new S5(mapping);

		(globalThis.controller.sendOutputReport as ReturnType<typeof import('vitest').vi.fn>).mockClear();

		s5.shutdown();

		const calls = (
			globalThis.controller.sendOutputReport as ReturnType<typeof import('vitest').vi.fn>
		).mock.calls;

		for (const call of calls) {
			const reportId = call[0] as number;
			const data = new Uint8Array(call[1] as ArrayBuffer);
			if (reportId === 128 || reportId === 129) {
				expect(data.length).toBe(104);
			} else if (reportId === 130) {
				expect(data.length).toBe(73);
			}
		}
	});

	test('constructor ensures at least 4 decks and 16 samplers', () => {
		globalThis.engine.setValue('[App]', 'num_decks', 2);
		globalThis.engine.setValue('[App]', 'num_samplers', 4);

		new S5(mapping);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[App]',
			'num_decks',
			4
		);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[App]',
			'num_samplers',
			16
		);
	});

	test('constructor does not lower deck/sampler count', () => {
		globalThis.engine.setValue('[App]', 'num_decks', 8);
		globalThis.engine.setValue('[App]', 'num_samplers', 32);
		(globalThis.engine.setValue as ReturnType<typeof import('vitest').vi.fn>).mockClear();

		new S5(mapping);

		const deckCalls = (
			globalThis.engine.setValue as ReturnType<typeof import('vitest').vi.fn>
		).mock.calls.filter(
			(c: unknown[]) => c[0] === '[App]' && c[1] === 'num_decks'
		);
		const samplerCalls = (
			globalThis.engine.setValue as ReturnType<typeof import('vitest').vi.fn>
		).mock.calls.filter(
			(c: unknown[]) => c[0] === '[App]' && c[1] === 'num_samplers'
		);

		expect(deckCalls).toHaveLength(0);
		expect(samplerCalls).toHaveLength(0);
	});

	test('registers gui_tick connection for volume meters', () => {
		new S5(mapping);

		const tickConnections = globalThis.__mixxxTestState.connections.filter(
			(c) => c.group === '[App]' && c.control === 'gui_tick_50ms_period_s'
		);
		expect(tickConnections).toHaveLength(1);
	});
});
