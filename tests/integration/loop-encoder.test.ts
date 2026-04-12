import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

describe('loop encoder', () => {
	beforeEach(() => {
		globalThis.engine.setValue('[App]', 'num_decks', 4);
		globalThis.engine.setValue('[App]', 'num_samplers', 16);
	});

	test('rotate right triggers loop_double', () => {
		const s5 = new S5(mapping);
		const encoder = s5.deckLeft.loopEncoder;

		// Simulate initial value then turn right
		encoder.input(5);
		encoder.input(6);

		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel1]',
			'loop_double',
			50
		);
	});

	test('rotate left triggers loop_halve', () => {
		const s5 = new S5(mapping);
		const encoder = s5.deckLeft.loopEncoder;

		encoder.input(5);
		encoder.input(4);

		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel1]',
			'loop_halve',
			50
		);
	});

	test('shifted rotate right triggers loop_move_1_forward', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.shiftButton.input(1);

		const encoder = s5.deckLeft.loopEncoder;
		encoder.input(5);
		encoder.input(6);

		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel1]',
			'loop_move_1_forward',
			50
		);
	});

	test('shifted rotate left triggers loop_move_1_backward', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.shiftButton.input(1);

		const encoder = s5.deckLeft.loopEncoder;
		encoder.input(5);
		encoder.input(4);

		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel1]',
			'loop_move_1_backward',
			50
		);
	});

	test('press triggers beatloop_activate', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.loopEncoder.onPress(1);

		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel1]',
			'beatloop_activate',
			50
		);
	});

	test('shifted press triggers reloop_toggle', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.loopEncoder.onPress(1);

		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel1]',
			'reloop_toggle',
			50
		);
	});

	test('operates on correct deck after deck switch', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.toggleDeck();

		const encoder = s5.deckLeft.loopEncoder;
		encoder.input(5);
		encoder.input(6);

		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel3]',
			'loop_double',
			50
		);
	});
});
