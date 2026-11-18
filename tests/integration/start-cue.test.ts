import { beforeEach, describe, expect, test } from 'vitest';
import { connectStartCues } from '../../src/components/start-cue';
import type { MixxxChannelGroup } from '../../src/types/mixxx-controls';

function loadTrack(group: MixxxChannelGroup) {
	const state = globalThis.__mixxxTestState;
	state.values.set(`${group}::track_loaded`, 1);
	const timersBefore = new Set(state.timers.keys());
	for (const connection of state.connections) {
		if (connection.group === group && connection.control === 'track_loaded') {
			connection.callback(1);
		}
	}
	for (const [id, callback] of state.timers) {
		if (!timersBefore.has(id)) callback();
	}
}

describe('start cue', () => {
	beforeEach(() => {
		connectStartCues();
	});

	test('a loaded track without hotcues gets a white start cue on hotcue 1', () => {
		loadTrack('[Channel3]');

		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel3]', 'hotcue_1_setcue', 1);
		expect(globalThis.engine.getValue('[Channel3]', 'hotcue_1_position')).toBe(2);
		expect(globalThis.engine.getValue('[Channel3]', 'hotcue_1_color')).toBe(0xffffff);
	});

	test('a track with any hotcue keeps its cues', () => {
		globalThis.engine.setValue('[Channel1]', 'hotcue_7_status', 1);
		loadTrack('[Channel1]');

		expect(globalThis.engine.setValue).not.toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_1_setcue',
			1
		);
	});
});
