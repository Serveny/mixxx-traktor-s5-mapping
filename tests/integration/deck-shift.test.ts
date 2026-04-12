import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

function activeConnectionsFor(group: string, control: string) {
	return globalThis.__mixxxTestState.connections.filter(
		(connection) => connection.group === group && connection.control === control
	);
}

describe('deck switch and shift flows', () => {
	beforeEach(() => {
		globalThis.engine.setValue('[App]', 'num_decks', 4);
		globalThis.engine.setValue('[App]', 'num_samplers', 16);
	});

	test('rebinds pad output connections when switching decks', () => {
		const s5 = new S5(mapping);

		expect(activeConnectionsFor('[Channel1]', 'hotcue_1_status')).toHaveLength(1);
		expect(activeConnectionsFor('[Channel1]', 'hotcue_1_color')).toHaveLength(1);

		s5.deckLeft.toggleDeck();

		expect(activeConnectionsFor('[Channel1]', 'hotcue_1_status')).toHaveLength(0);
		expect(activeConnectionsFor('[Channel1]', 'hotcue_1_color')).toHaveLength(0);
		expect(activeConnectionsFor('[Channel3]', 'hotcue_1_status')).toHaveLength(1);
		expect(activeConnectionsFor('[Channel3]', 'hotcue_1_color')).toHaveLength(1);
	});

	test('uses clear and activate hotcue controls across shift and deck switch', () => {
		const s5 = new S5(mapping);
		const pad = s5.deckLeft.pads[0];

		s5.deckLeft.shiftButton.input(1);
		pad.input(1);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'hotcue_1_clear',
			1
		);

		s5.deckLeft.toggleDeck();
		pad.input(1);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel3]',
			'hotcue_1_clear',
			1
		);

		s5.deckLeft.shiftButton.input(0);
		pad.input(1);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel3]',
			'hotcue_1_activate',
			1
		);
	});

	test('does not throw when toggling decks while shift is held', () => {
		const s5 = new S5(mapping);

		expect(() => {
			s5.deckLeft.shiftButton.input(1);
			s5.deckLeft.toggleDeck();
			s5.deckLeft.toggleDeck();
			s5.deckLeft.shiftButton.input(0);
		}).not.toThrow();
	});
});
