import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';
import { settings } from '../../src/settings';

function report1({
	leftShift = false,
	leftPlay = false,
	leftTouch = 0,
}: {
	leftShift?: boolean;
	leftPlay?: boolean;
	leftTouch?: number;
} = {}) {
	const data = new Uint8Array(28);
	data[0] = 1;

	if (leftShift) {
		data[9] |= 1 << 4;
	}
	if (leftPlay) {
		data[9] |= 1 << 2;
	}

	data[20] = leftTouch & 0xff;
	data[21] = (leftTouch >> 8) & 0xff;

	return data;
}

function activeConnectionsFor(group: string, control: string) {
	return globalThis.__mixxxTestState.connections.filter(
		(connection) => connection.group === group && connection.control === control
	);
}

describe('deck control regressions', () => {
	beforeEach(() => {
		globalThis.engine.setValue('[App]', 'num_decks', 4);
		globalThis.engine.setValue('[App]', 'num_samplers', 16);
		settings.useKeylockOnMaster = false;
	});

	test('touch strip keeps controlling the active deck after shift and deck switch', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.toggleDeck();
		s5.deckLeft.touchStrip.input(512);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel3]',
			'playposition',
			0.5
		);
	});

	test('play HID input does not switch decks after a shifted touch-strip seek', () => {
		const s5 = new S5(mapping);

		expect(() => {
			s5.incomingData(report1({ leftShift: true, leftTouch: 512 }));
			s5.incomingData(report1());
			s5.incomingData(report1({ leftPlay: true }));
		}).not.toThrow();

		expect(s5.deckLeft.currentDeckIdx).toBe(0);
		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[Channel1]',
			'play'
		);
		expect(
			globalThis.__mixxxTestState.connections.some((connection) =>
				connection.group.includes('undefined')
			)
		).toBe(false);
	});

	test('flux button cleans up loop-mode connection when switching decks', () => {
		const s5 = new S5(mapping);
		globalThis.engine.setValue('[Channel1]', 'loop_enabled', 1);

		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.fluxButton.onShortPress();

		// flux button output + flux loop-mode connection + loop LED
		expect(activeConnectionsFor('[Channel1]', 'loop_enabled')).toHaveLength(3);

		s5.deckLeft.toggleDeck();

		expect(activeConnectionsFor('[Channel1]', 'loop_enabled')).toHaveLength(0);
	});

	test('sync button keeps shifted key binding after deck switch', () => {
		settings.useKeylockOnMaster = true;
		const s5 = new S5(mapping);

		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.toggleDeck();
		s5.deckLeft.syncButton.onShortRelease();

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[Channel3]',
			'keylock'
		);
	});

	test('cue button keeps shifted control after deck switch', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.toggleDeck();
		s5.deckLeft.cueButton.input(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel3]',
			'start_play',
			1
		);
	});
});
