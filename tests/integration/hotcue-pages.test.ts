import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

describe('hotcue pages', () => {
	beforeEach(() => {
		globalThis.engine.setValue('[App]', 'num_decks', 4);
		globalThis.engine.setValue('[App]', 'num_samplers', 16);
	});

	test('hotcue button cycles pages 1, 2, and 3', () => {
		const s5 = new S5(mapping);

		expect(s5.deckLeft.hotcuePage).toBe(1);

		s5.deckLeft.hotcueModeButton.onShortPress();
		expect(s5.deckLeft.hotcuePage).toBe(2);

		s5.deckLeft.hotcueModeButton.onShortPress();
		expect(s5.deckLeft.hotcuePage).toBe(3);

		s5.deckLeft.hotcueModeButton.onShortPress();
		expect(s5.deckLeft.hotcuePage).toBe(1);
	});

	test('pads use hotcue offsets from the active page', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.hotcueModeButton.onShortPress();
		s5.deckLeft.pads[0].input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_5_activate',
			1
		);

		s5.deckLeft.hotcueModeButton.onShortPress();
		s5.deckLeft.pads[0].input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_13_activate',
			1
		);
	});

	test('shift+pad clears the hotcue on the active page', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.hotcueModeButton.onShortPress();
		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.pads[1].input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_6_clear',
			1
		);
	});

	// Traktor: a HotCue on a paused deck plays while held and jumps back on release; Mixxx needs the release.
	test('releasing a pad releases the hotcue it activated', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.pads[2].input(1);
		s5.deckLeft.hotcueModeButton.onShortPress();
		s5.deckLeft.pads[2].input(0);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_3_activate',
			0
		);
	});
});
