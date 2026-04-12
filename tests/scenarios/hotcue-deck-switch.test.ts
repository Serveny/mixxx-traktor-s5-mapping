import { describe, expect, test } from 'vitest';
import { activeConnectionsFor, setupS5 } from './scenario-harness';

describe('hotcue workflow across deck switch', () => {
	const s5 = setupS5();

	test('pressing pads sets hotcues on the active deck', () => {
		const instance = s5.get();

		instance.deckLeft.pads[0].input(1);
		instance.deckLeft.pads[1].input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_1_activate',
			1
		);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_2_activate',
			1
		);
	});

	test('hotcue LED connections are live for deck A on start', () => {
		setupS5();

		expect(activeConnectionsFor('[Channel1]', 'hotcue_1_status')).toHaveLength(1);
		expect(activeConnectionsFor('[Channel1]', 'hotcue_1_color')).toHaveLength(1);
	});

	test('toggling deck unbinds Channel1 LED connections and binds Channel3', () => {
		const instance = s5.get();

		expect(activeConnectionsFor('[Channel1]', 'hotcue_1_status')).toHaveLength(1);

		instance.deckLeft.toggleDeck();

		expect(activeConnectionsFor('[Channel1]', 'hotcue_1_status')).toHaveLength(0);
		expect(activeConnectionsFor('[Channel3]', 'hotcue_1_status')).toHaveLength(1);
	});

	test('pads control the new deck after toggle', () => {
		const instance = s5.get();

		instance.deckLeft.toggleDeck();
		instance.deckLeft.pads[0].input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel3]',
			'hotcue_1_activate',
			1
		);
	});

	test('shift+pad clears hotcue on the switched deck', () => {
		const instance = s5.get();

		instance.deckLeft.toggleDeck();
		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.pads[0].input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel3]',
			'hotcue_1_clear',
			1
		);
	});

	test('toggling back restores Channel1 LED connections', () => {
		const instance = s5.get();

		instance.deckLeft.toggleDeck();
		instance.deckLeft.toggleDeck();

		expect(activeConnectionsFor('[Channel3]', 'hotcue_1_status')).toHaveLength(0);
		expect(activeConnectionsFor('[Channel1]', 'hotcue_1_status')).toHaveLength(1);
	});

	test('full hotcue lifecycle: set on A, switch to C, clear on C, switch back, pads back on A', () => {
		const instance = s5.get();

		// Set hotcues on deck A
		instance.deckLeft.pads[0].input(1);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel1]', 'hotcue_1_activate', 1);
		instance.deckLeft.pads[1].input(1);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel1]', 'hotcue_2_activate', 1);

		// Switch to deck C
		instance.deckLeft.toggleDeck();
		expect(activeConnectionsFor('[Channel1]', 'hotcue_1_status')).toHaveLength(0);
		expect(activeConnectionsFor('[Channel3]', 'hotcue_1_status')).toHaveLength(1);

		// Set a hotcue on deck C
		instance.deckLeft.pads[0].input(1);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel3]', 'hotcue_1_activate', 1);

		// Clear the hotcue on deck C via shift
		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.pads[0].input(1);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel3]', 'hotcue_1_clear', 1);
		instance.deckLeft.shiftButton.input(0);

		// Switch back to deck A
		instance.deckLeft.toggleDeck();
		expect(activeConnectionsFor('[Channel3]', 'hotcue_1_status')).toHaveLength(0);
		expect(activeConnectionsFor('[Channel1]', 'hotcue_1_status')).toHaveLength(1);

		// Pads now control deck A again
		instance.deckLeft.pads[2].input(1);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel1]', 'hotcue_3_activate', 1);
	});
});
