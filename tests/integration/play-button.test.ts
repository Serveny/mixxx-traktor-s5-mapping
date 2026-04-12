import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';
import { settings } from '../../src/settings';

describe('play button', () => {
	beforeEach(() => {
		globalThis.engine.setValue('[App]', 'num_decks', 4);
		globalThis.engine.setValue('[App]', 'num_samplers', 16);
		settings.useKeylockOnMaster = false;
	});

	test('toggles play on press', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.playButton.input(1);

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[Channel1]',
			'play'
		);
	});

	test('does not toggle play on release', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.playButton.input(0);

		expect(globalThis.script.toggleControl).not.toHaveBeenCalled();
	});

	test('stops and ejects when shifted', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.playButton.input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'play',
			0
		);
		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel1]',
			'eject',
			50
		);
	});

	test('operates on the correct deck after deck switch', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.toggleDeck();
		s5.deckLeft.playButton.input(1);

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[Channel3]',
			'play'
		);
	});

	test('shift+play ejects from the switched deck', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.toggleDeck();
		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.playButton.input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel3]',
			'play',
			0
		);
		expect(globalThis.script.triggerControl).toHaveBeenCalledWith(
			'[Channel3]',
			'eject',
			50
		);
	});
});
