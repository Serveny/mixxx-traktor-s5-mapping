export interface DjScenarioStep {
	id: string;
	description: string;
	requiresAudio: boolean;
}

export interface DjSetScenario {
	mode: 'full' | 'degraded' | 'blocked';
	steps: DjScenarioStep[];
	warnings: string[];
}

const audioSteps: DjScenarioStep[] = [
	{
		id: 'load-deck-a',
		description: 'Load the first scenario track into deck A.',
		requiresAudio: true,
	},
	{
		id: 'load-deck-b',
		description: 'Load the second scenario track into deck B.',
		requiresAudio: true,
	},
	{
		id: 'mix-decks',
		description: 'Perform the visible A/B mix with sync, EQ, filter, and crossfader changes.',
		requiresAudio: true,
	},
];

const controlOnlySteps: DjScenarioStep[] = [
	{
		id: 'deck-switch-stress',
		description: 'Stress deck switching between A/C and B/D while maintaining LED state.',
		requiresAudio: false,
	},
	{
		id: 'shift-combination-pass',
		description: 'Exercise shift combinations across pads, transport, and touch strip.',
		requiresAudio: false,
	},
	{
		id: 'browser-navigation-pass',
		description: 'Walk browse, back, and view navigation without loading tracks.',
		requiresAudio: false,
	},
];

export function buildDjSetScenario(
	mode: 'full' | 'degraded' | 'blocked'
): DjSetScenario {
	if (mode === 'blocked') {
		return {
			mode,
			steps: [],
			warnings: ['Required audio tracks are missing; the DJ set scenario cannot run.'],
		};
	}

	return {
		mode,
		steps: mode === 'full' ? [...audioSteps, ...controlOnlySteps] : controlOnlySteps,
		warnings:
			mode === 'degraded'
				? ['Optional scenario tracks are missing; running control-only fallback steps.']
				: [],
	};
}
