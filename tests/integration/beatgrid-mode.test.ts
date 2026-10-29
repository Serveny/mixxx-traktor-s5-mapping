import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

const mockEngine = () => globalThis.engine as any;
const set = (group: string, key: string, value: number) => mockEngine().setValue(group, key, value);
const get = (group: string, key: string): number => mockEngine().getValue(group, key);

describe('Beatgrid mode (manual 3.9)', () => {
	beforeEach(() => set('[App]', 'num_decks', 4));

	function openBeatgrid() {
		const s5 = new S5(mapping);
		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.display.displayButton1.input(1);
		s5.deckLeft.shiftButton.input(0);
		return s5;
	}

	test('shift + display 1 opens beatgrid mode', () => {
		const s5 = openBeatgrid();
		expect(s5.deckLeft.display.activePopup).toBe('beatgrid');
	});

	test('loop encoder moves the grid on OFFSET and adjusts BPM on FINE', () => {
		const s5 = openBeatgrid();
		s5.deckLeft.loopEncoder.input(5);
		s5.deckLeft.loopEncoder.input(6);
		expect(get('[Channel1]', 'beats_translate_later')).toBe(1);

		s5.deckLeft.display.perfModeRightButton.input(1); // -> BPM
		s5.deckLeft.display.perfModeRightButton.input(1); // -> FINE
		expect(s5.deckLeft.display.beatgrid.param).toBe('fine');
		s5.deckLeft.loopEncoder.input(5);
		expect(get('[Channel1]', 'beats_adjust_slower')).toBe(1);
		expect(get('[Channel1]', 'beatloop_size')).toBe(0);
	});

	test('display buttons are LOCK, TAP and RST; view closes the mode', () => {
		const s5 = openBeatgrid();
		s5.deckLeft.display.displayButton1.input(1);
		expect(get('[Channel1]', 'bpmlock')).toBe(1);
		s5.deckLeft.display.displayButton3.input(1);
		expect(get('[Channel1]', 'bpm_tap')).toBe(1);
		s5.deckLeft.display.displayButton4.input(1);
		expect(get('[Channel1]', 'beats_undo_adjustment')).toBe(1);
		expect(get('[Channel1]', 'waveform_zoom_up')).toBe(0);

		s5.deckLeft.display.viewButton.input(1);
		expect(s5.deckLeft.display.activePopup).toBe('none');
	});

	test('browse press does not load a track while in beatgrid mode', () => {
		const s5 = openBeatgrid();
		set('[Library]', 'focused_widget', 3);
		s5.deckLeft.browserEncoder.onPress(1);
		expect(get('[Channel1]', 'LoadSelectedTrack')).toBe(0);
	});
});
