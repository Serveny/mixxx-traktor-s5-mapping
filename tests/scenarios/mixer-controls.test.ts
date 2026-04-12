import { describe, expect, test } from 'vitest';
import { setupS5 } from './scenario-harness';

describe('mixer channel controls', () => {
	const s5 = setupS5();

	test('channel A gain knob sets pregain parameter', () => {
		s5.get().mixer.channelA.gain.input(4095);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[Channel1]',
			'pregain',
			1
		);
	});

	test('channel A gain knob at midpoint sets ~0.5', () => {
		s5.get().mixer.channelA.gain.input(2048);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[Channel1]',
			'pregain',
			expect.closeTo(0.5, 1)
		);
	});

	test('channel A EQ high knob sets parameter3 on equalizer group', () => {
		s5.get().mixer.channelA.eqHigh.input(4095);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EqualizerRack1_[Channel1]_Effect1]',
			'parameter3',
			1
		);
	});

	test('channel A EQ mid knob sets parameter2 on equalizer group', () => {
		s5.get().mixer.channelA.eqMid.input(2048);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EqualizerRack1_[Channel1]_Effect1]',
			'parameter2',
			expect.closeTo(0.5, 1)
		);
	});

	test('channel A EQ low knob at zero kills lows', () => {
		s5.get().mixer.channelA.eqLow.input(0);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EqualizerRack1_[Channel1]_Effect1]',
			'parameter1',
			0
		);
	});

	test('channel A filter knob sets super1 on quick effect group', () => {
		s5.get().mixer.channelA.filterKnob.input(2048);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[QuickEffectRack1_[Channel1]]',
			'super1',
			expect.closeTo(0.5, 1)
		);
	});

	test('channel A volume fader sets volume parameter', () => {
		s5.get().mixer.channelA.volume.input(4095);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[Channel1]',
			'volume',
			1
		);
	});

	test('channel A PFL (cue) button toggles headphone monitoring', () => {
		s5.get().mixer.channelA.pfl.input(1);

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[Channel1]',
			'pfl'
		);
	});

	test('channel A FX1 assign button enables FX unit 1 on channel A', () => {
		s5.get().mixer.channelA.fxAssignleft.input(1);

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1]',
			'group_[Channel1]_enable'
		);
	});

	test('channel A FX2 assign button enables FX unit 2 on channel A', () => {
		s5.get().mixer.channelA.fxAssignRight.input(1);

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit2]',
			'group_[Channel1]_enable'
		);
	});

	test('crossfader orientation is set correctly in constructor: A left, B right', () => {
		s5.get(); // constructor already ran in beforeEach

		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel1]', 'orientation', 0);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel2]', 'orientation', 2);
	});

	test('channel B controls the correct group independently from A', () => {
		const instance = s5.get();

		instance.mixer.channelB.gain.input(4095);
		instance.mixer.channelA.gain.input(0);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith('[Channel2]', 'pregain', 1);
		expect(globalThis.engine.setParameter).toHaveBeenCalledWith('[Channel1]', 'pregain', 0);
	});

	test('full mixer chain: gain → EQ → filter → volume → PFL → FX assign', () => {
		const instance = s5.get();

		instance.mixer.channelA.gain.input(3000);
		expect(globalThis.engine.setParameter).toHaveBeenCalledWith('[Channel1]', 'pregain', expect.closeTo(3000 / 4095, 2));

		instance.mixer.channelA.eqHigh.input(0);
		expect(globalThis.engine.setParameter).toHaveBeenCalledWith('[EqualizerRack1_[Channel1]_Effect1]', 'parameter3', 0);

		instance.mixer.channelA.filterKnob.input(4095);
		expect(globalThis.engine.setParameter).toHaveBeenCalledWith('[QuickEffectRack1_[Channel1]]', 'super1', 1);

		instance.mixer.channelA.volume.input(2048);
		expect(globalThis.engine.setParameter).toHaveBeenCalledWith('[Channel1]', 'volume', expect.closeTo(0.5, 1));

		instance.mixer.channelA.pfl.input(1);
		expect(globalThis.script.toggleControl).toHaveBeenCalledWith('[Channel1]', 'pfl');

		instance.mixer.channelA.fxAssignleft.input(1);
		expect(globalThis.script.toggleControl).toHaveBeenCalledWith('[EffectRack1_EffectUnit1]', 'group_[Channel1]_enable');
	});
});
