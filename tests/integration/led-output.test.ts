import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';
import { ButtonBrightnessOff, ButtonBrightnessOn } from '../../src/settings';

/** Set a value directly in the test state (bypasses type checks for read-only controls) */
function setTestValue(group: string, control: string, value: number) {
	globalThis.__mixxxTestState.values.set(`${group}::${control}`, value);
}

describe('LED output', () => {
	beforeEach(() => {
		globalThis.engine.setValue('[App]', 'num_decks', 4);
		globalThis.engine.setValue('[App]', 'num_samplers', 16);
	});

	test('play indicator LED updates on play state change', () => {
		const s5 = new S5(mapping);
		const playOutByte = mapping.deckLeft.transportControls.play.outByte;
		const outReport = s5.reports.out[128];

		// Trigger via the play button's output connection directly
		setTestValue('[Channel1]', 'play_indicator', 1);
		const playConn = (s5.deckLeft.playButton as any).outConnection;
		expect(playConn).toBeDefined();
		playConn.trigger();

		expect(outReport.data[playOutByte]).toBe(ButtonBrightnessOn);
	});

	test('play indicator LED turns off when stopped', () => {
		const s5 = new S5(mapping);
		const playOutByte = mapping.deckLeft.transportControls.play.outByte;
		const outReport = s5.reports.out[128];

		const playConn = (s5.deckLeft.playButton as any).outConnection;

		setTestValue('[Channel1]', 'play_indicator', 0);
		playConn.trigger();

		expect(outReport.data[playOutByte]).toBe(ButtonBrightnessOff);
	});

	test('shift LED lights on shift press', () => {
		const s5 = new S5(mapping);
		const shiftOutByte = mapping.deckLeft.transportControls.shift.outByte;
		const outReport = s5.reports.out[128];

		s5.deckLeft.shiftButton.input(1);

		expect(outReport.data[shiftOutByte]).toBe(ButtonBrightnessOn);
	});

	test('shift LED dims on shift release', () => {
		const s5 = new S5(mapping);
		const shiftOutByte = mapping.deckLeft.transportControls.shift.outByte;
		const outReport = s5.reports.out[128];

		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.shiftButton.input(0);

		expect(outReport.data[shiftOutByte]).toBe(ButtonBrightnessOff);
	});

	test('pad LED reflects hotcue status via output callback', () => {
		const s5 = new S5(mapping);
		const padOutByte = mapping.deckLeft.pads[0].outByte;
		const outReport = s5.reports.out[128];

		// Trigger pad 1's hotcue status output directly
		s5.deckLeft.pads[0].output(1);

		const rgbBytes = [
			outReport.data[padOutByte],
			outReport.data[padOutByte + 1],
			outReport.data[padOutByte + 2],
		];
		// At least one channel should be non-zero when active
		expect(rgbBytes.some((b) => b > 0)).toBe(true);
	});

	test('pad LED goes dark when hotcue cleared', () => {
		const s5 = new S5(mapping);
		const padOutByte = mapping.deckLeft.pads[0].outByte;
		const outReport = s5.reports.out[128];

		// Activate then deactivate
		s5.deckLeft.pads[0].output(1);
		s5.deckLeft.pads[0].output(0);

		const rgbBytes = [
			outReport.data[padOutByte],
			outReport.data[padOutByte + 1],
			outReport.data[padOutByte + 2],
		];
		expect(rgbBytes.every((b) => b === 0)).toBe(true);
	});

	test('LED connections rebind to new deck after deck switch', () => {
		const s5 = new S5(mapping);
		const playOutByte = mapping.deckLeft.transportControls.play.outByte;
		const outReport = s5.reports.out[128];

		s5.deckLeft.toggleDeck();

		// Set engine value and trigger the play button's output connection directly
		setTestValue('[Channel3]', 'play_indicator', 1);
		const playConn = (s5.deckLeft.playButton as any).outConnection;
		expect(playConn).toBeDefined();
		expect(playConn.group).toBe('[Channel3]');

		playConn.trigger();

		expect(outReport.data[playOutByte]).toBe(ButtonBrightnessOn);
	});

	test('volume meter clears all channel LEDs when vu_meter returns to zero', () => {
		const s5 = new S5(mapping);
		const meterOutByte = mapping.mixer.channelA.volumeLevel.outByte;
		const outReport = s5.reports.out[130];

		setTestValue('[Channel1]', 'vu_meter', 0.7);
		s5.mixer.channelA.volumeMeter.output();

		setTestValue('[Channel1]', 'vu_meter', 0);
		s5.mixer.channelA.volumeMeter.output();

		const meterBytes = Array.from(
			outReport.data.slice(
				meterOutByte,
				meterOutByte + mapping.mixer.channelA.volumeLevel.outLengthByte
			)
		);
		expect(meterBytes.every((value) => value === 0)).toBe(true);
	});

	test('volume meter renders consecutive full and partial segments', () => {
		const s5 = new S5(mapping);
		const meterOutByte = mapping.mixer.channelA.volumeLevel.outByte;
		const outReport = s5.reports.out[130];

		setTestValue('[Channel1]', 'vu_meter', 1.6 / 11);
		s5.mixer.channelA.volumeMeter.output();

		const meterBytes = Array.from(
			outReport.data.slice(
				meterOutByte,
				meterOutByte + mapping.mixer.channelA.volumeLevel.outLengthByte
			)
		);

		expect(meterBytes[0]).toBe(127);
		expect(meterBytes[1]).toBe(125);
		expect(meterBytes.slice(2).every((value) => value === 0)).toBe(true);
	});

	test('deck button is blue for deck A/B and white for deck C/D', () => {
		const s5 = new S5(mapping);
		const deckOutByte = mapping.deckLeft.deck.outByte;
		const outReport = s5.reports.out[128];

		expect(outReport.data[deckOutByte]).toBe(0);
		expect(outReport.data[deckOutByte + 1]).toBe(127);

		s5.deckLeft.toggleDeck();

		expect(outReport.data[deckOutByte]).toBe(127);
		expect(outReport.data[deckOutByte + 1]).toBe(0);
	});
});
