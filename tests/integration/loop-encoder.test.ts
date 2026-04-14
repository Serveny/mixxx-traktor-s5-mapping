import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

describe('loop encoder', () => {
	beforeEach(() => {
		globalThis.engine.setValue('[App]', 'num_decks', 4);
		globalThis.engine.setValue('[App]', 'num_samplers', 16);
	});

	test('rotate right doubles the selected beatloop size preset', () => {
		const s5 = new S5(mapping);
		const encoder = s5.deckLeft.loopEncoder;

		globalThis.engine.setValue('[Channel1]', 'beatloop_size', 1);
		// Simulate initial value then turn right
		encoder.input(5);
		encoder.input(6);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'beatloop_size',
			2
		);
	});

	test('rotate left halves the selected beatloop size preset', () => {
		const s5 = new S5(mapping);
		const encoder = s5.deckLeft.loopEncoder;

		globalThis.engine.setValue('[Channel1]', 'beatloop_size', 1);
		encoder.input(5);
		encoder.input(4);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'beatloop_size',
			0.5
		);
	});

	test('shifted rotate right beatjumps by the current loop size preset', () => {
		const s5 = new S5(mapping);

		globalThis.engine.setValue('[Channel1]', 'beatloop_size', 4);
		s5.deckLeft.shiftButton.input(1);

		const encoder = s5.deckLeft.loopEncoder;
		encoder.input(5);
		encoder.input(6);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'beatjump_4_forward',
			1
		);
	});

	test('shifted rotate left beatjumps backward by the current loop size preset', () => {
		const s5 = new S5(mapping);

		globalThis.engine.setValue('[Channel1]', 'beatloop_size', 4);
		s5.deckLeft.shiftButton.input(1);

		const encoder = s5.deckLeft.loopEncoder;
		encoder.input(5);
		encoder.input(4);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'beatjump_4_backward',
			1
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

		globalThis.engine.setValue('[Channel3]', 'beatloop_size', 1);
		s5.deckLeft.toggleDeck();

		const encoder = s5.deckLeft.loopEncoder;
		encoder.input(5);
		encoder.input(6);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel3]',
			'beatloop_size',
			2
		);
	});

	test('freeze hold plus loop touch opens and closes the slice size popup', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.freezeButton.input(1);
		s5.deckLeft.loopEncoder.onTouch(1);
		expect(s5.deckLeft.display.activePopup).toBe('sliceSize');

		s5.deckLeft.loopEncoder.onTouch(0);
		expect(s5.deckLeft.display.activePopup).toBe('none');
	});

	test('pads store active loops and shifted pads clear stored loops', () => {
		const s5 = new S5(mapping);

		globalThis.engine.setValue('[Channel1]', 'loop_enabled', 1);
		s5.deckLeft.pads[0].input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_1_setloop',
			1
		);

		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.pads[0].input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_1_clear',
			1
		);
	});
});
