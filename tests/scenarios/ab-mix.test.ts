import { describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { ButtonBrightnessOn } from '../../src/settings';
import { setEngineValue, setupS5 } from './scenario-harness';

describe('A→B mix scenario', () => {
	const s5 = setupS5();

	test('left deck starts playing', () => {
		s5.get().deckLeft.playButton.input(1);

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[Channel1]',
			'play'
		);
	});

	test('play LED lights up when deck A plays', () => {
		const instance = s5.get();
		const playOutByte = mapping.deckLeft.transportControls.play.outByte;
		const outReport = instance.reports.out[128];

		setEngineValue('[Channel1]', 'play_indicator', 1);
		(instance.deckLeft.playButton as any).outConnection.trigger();

		expect(outReport.data[playOutByte]).toBe(ButtonBrightnessOn);
	});

	test('right deck syncs to master', () => {
		s5.get().deckRight.syncButton.onShortRelease();

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[Channel2]',
			'sync_enabled'
		);
	});

	test('crossfader moves fully to deck B', () => {
		s5.get().mixer.crossfader.input(4095);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[Master]',
			'crossfader',
			1
		);
	});

	test('right deck starts playing', () => {
		s5.get().deckRight.playButton.input(1);

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[Channel2]',
			'play'
		);
	});

	test('right deck play LED lights up', () => {
		const instance = s5.get();
		const playOutByte = mapping.deckRight.transportControls.play.outByte;
		const outReport = instance.reports.out[129];

		setEngineValue('[Channel2]', 'play_indicator', 1);
		(instance.deckRight.playButton as any).outConnection.trigger();

		expect(outReport.data[playOutByte]).toBe(ButtonBrightnessOn);
	});

	test('shift+play on left deck stops and ejects deck A', () => {
		const instance = s5.get();

		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.playButton.input(1);

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

	test('full A→B transition: play A, sync B, move crossfader, play B, eject A', () => {
		const instance = s5.get();

		// Step 1: Start deck A
		instance.deckLeft.playButton.input(1);
		expect(globalThis.script.toggleControl).toHaveBeenCalledWith('[Channel1]', 'play');

		// Step 2: Sync deck B to master tempo
		instance.deckRight.syncButton.onShortRelease();
		expect(globalThis.script.toggleControl).toHaveBeenCalledWith('[Channel2]', 'sync_enabled');

		// Step 3: Move crossfader to center
		instance.mixer.crossfader.input(2048);
		expect(globalThis.engine.setParameter).toHaveBeenCalledWith('[Master]', 'crossfader', expect.closeTo(0.5, 1));

		// Step 4: Start deck B
		instance.deckRight.playButton.input(1);
		expect(globalThis.script.toggleControl).toHaveBeenCalledWith('[Channel2]', 'play');

		// Step 5: Move crossfader fully to B
		instance.mixer.crossfader.input(4095);
		expect(globalThis.engine.setParameter).toHaveBeenCalledWith('[Master]', 'crossfader', 1);

		// Step 6: Eject deck A
		instance.deckLeft.shiftButton.input(1);
		instance.deckLeft.playButton.input(1);
		expect(globalThis.script.triggerControl).toHaveBeenCalledWith('[Channel1]', 'eject', 50);
	});
});
