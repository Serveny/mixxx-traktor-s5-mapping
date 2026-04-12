import { describe, expect, test } from 'vitest';
import { setupS5 } from './scenario-harness';

describe('shift combination pass', () => {
	const s5 = setupS5();

	test('shift+play stops and ejects in addition to toggling', () => {
		const instance = s5.get();

		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.playButton.input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel1]', 'play', 0);
		expect(globalThis.script.triggerControl).toHaveBeenCalledWith('[Channel1]', 'eject', 50);
	});

	test('shift+cue triggers start_stop instead of cue_default', () => {
		const instance = s5.get();

		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.cueButton.input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel1]', 'start_stop', 1);
		expect(globalThis.engine.setValue).not.toHaveBeenCalledWith('[Channel1]', 'cue_default', 1);
	});

	test('shift+loop encoder right triggers loop_move_1_forward instead of loop_double', () => {
		const instance = s5.get();

		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.loopEncoder.input(5);
		instance.deckLeft.loopEncoder.input(6);

		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel1]',
			'loop_move_1_forward',
			50
		);
		expect(globalThis.script.triggerControl).not.toHaveBeenCalledWith(
			'[Channel1]',
			'loop_double',
			50
		);
	});

	test('shift+loop encoder left triggers loop_move_1_backward instead of loop_halve', () => {
		const instance = s5.get();

		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.loopEncoder.input(5);
		instance.deckLeft.loopEncoder.input(4);

		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel1]',
			'loop_move_1_backward',
			50
		);
	});

	test('shift+loop encoder press triggers reloop_toggle instead of beatloop_activate', () => {
		const instance = s5.get();

		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.loopEncoder.onPress(1);

		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel1]',
			'reloop_toggle',
			50
		);
		expect(globalThis.script.triggerControl).not.toHaveBeenCalledWith(
			'[Channel1]',
			'beatloop_activate',
			50
		);
	});

	test('shift+pad clears hotcue instead of activating', () => {
		const instance = s5.get();

		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.pads[0].input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_1_clear',
			1
		);
		expect(globalThis.engine.setValue).not.toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_1_activate',
			1
		);
	});

	test('unshifting restores normal play behavior', () => {
		const instance = s5.get();

		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.shiftButton.input(0);
		instance.deckLeft.playButton.input(1);

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith('[Channel1]', 'play');
		expect(globalThis.script.triggerControl).not.toHaveBeenCalledWith('[Channel1]', 'eject', 50);
	});

	test('unshifting restores normal loop encoder behavior', () => {
		const instance = s5.get();

		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.shiftButton.input(0);
		instance.deckLeft.loopEncoder.input(5);
		instance.deckLeft.loopEncoder.input(6);

		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel1]',
			'loop_double',
			50
		);
	});

	test('unshifting restores normal pad behavior', () => {
		const instance = s5.get();

		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.shiftButton.input(0);
		instance.deckLeft.pads[0].input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_1_activate',
			1
		);
	});

	test('full shift pass: all shift combos then verify restoration', () => {
		const instance = s5.get();

		// Hold shift
		instance.deckLeft.shiftButton.input(1);

		// play → eject
		instance.deckLeft.playButton.input(1);
		expect(globalThis.script.triggerControl).toHaveBeenCalledWith('[Channel1]', 'eject', 50);

		// cue → start_stop
		instance.deckLeft.cueButton.input(1);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel1]', 'start_stop', 1);

		// loop encoder rotate → loop_move
		instance.deckLeft.loopEncoder.input(5);
		instance.deckLeft.loopEncoder.input(6);
		expect(globalThis.script.triggerControl).toHaveBeenCalledWith('[Channel1]', 'loop_move_1_forward', 50);

		// loop encoder press → reloop_toggle
		instance.deckLeft.loopEncoder.onPress(1);
		expect(globalThis.script.triggerControl).toHaveBeenCalledWith('[Channel1]', 'reloop_toggle', 50);

		// pad → clear
		instance.deckLeft.pads[0].input(1);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel1]', 'hotcue_1_clear', 1);

		// Release shift
		instance.deckLeft.shiftButton.input(0);

		// play → normal toggle
		instance.deckLeft.playButton.input(1);
		expect(globalThis.script.toggleControl).toHaveBeenCalledWith('[Channel1]', 'play');

		// loop encoder → loop_double
		instance.deckLeft.loopEncoder.input(7);
		expect(globalThis.script.triggerControl).toHaveBeenCalledWith('[Channel1]', 'loop_double', 50);

		// pad → activate
		instance.deckLeft.pads[0].input(1);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel1]', 'hotcue_1_activate', 1);
	});
});
