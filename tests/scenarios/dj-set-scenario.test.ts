import { describe, expect, test } from 'vitest';
import { buildDjSetScenario } from './dj-set-scenario';

describe('DJ set scenario', () => {
	test('includes track-dependent phases when audio preflight is full', () => {
		const scenario = buildDjSetScenario('full');

		expect(scenario.mode).toBe('full');
		expect(scenario.steps.some((step) => step.id === 'load-deck-a')).toBe(true);
		expect(scenario.steps.some((step) => step.id === 'mix-decks')).toBe(true);
	});

	test('skips track-dependent phases when audio preflight is degraded', () => {
		const scenario = buildDjSetScenario('degraded');

		expect(scenario.mode).toBe('degraded');
		expect(scenario.steps.some((step) => step.id === 'load-deck-a')).toBe(false);
		expect(scenario.steps.some((step) => step.id === 'deck-switch-stress')).toBe(true);
	});

	test('blocks execution when required audio is missing', () => {
		const scenario = buildDjSetScenario('blocked');

		expect(scenario.mode).toBe('blocked');
		expect(scenario.steps).toEqual([]);
		expect(scenario.warnings[0]).toContain('Required audio tracks are missing');
	});
});
