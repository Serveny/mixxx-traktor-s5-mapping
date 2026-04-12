import { describe, expect, test } from 'vitest';
import { setupS5 } from './scenario-harness';

describe('FX unit workflow', () => {
	const s5 = setupS5();

	test('left FX unit mix knob sets mix parameter on EffectUnit1', () => {
		s5.get().fxUnitLeft.mixKnob.input(4095);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1]',
			'mix',
			1
		);
	});

	test('left FX unit mix knob at midpoint sets ~0.5', () => {
		s5.get().fxUnitLeft.mixKnob.input(2048);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1]',
			'mix',
			expect.closeTo(0.5, 1)
		);
	});

	test('left FX knob 1 sets meta on Effect1', () => {
		s5.get().fxUnitLeft.knobs[0].input(4095);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1_Effect1]',
			'meta',
			1
		);
	});

	test('left FX knob 2 sets meta on Effect2', () => {
		s5.get().fxUnitLeft.knobs[1].input(0);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1_Effect2]',
			'meta',
			0
		);
	});

	test('left FX knob 3 sets meta on Effect3', () => {
		s5.get().fxUnitLeft.knobs[2].input(2048);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1_Effect3]',
			'meta',
			expect.closeTo(0.5, 1)
		);
	});

	test('left FX button 1 toggles enabled on Effect1', () => {
		s5.get().fxUnitLeft.buttons[0].onShortPress();

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1_Effect1]',
			'enabled'
		);
	});

	test('left FX button 2 toggles enabled on Effect2', () => {
		s5.get().fxUnitLeft.buttons[1].onShortPress();

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1_Effect2]',
			'enabled'
		);
	});

	test('right FX unit mix knob targets EffectUnit2', () => {
		s5.get().fxUnitRight.mixKnob.input(4095);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit2]',
			'mix',
			1
		);
	});

	test('right FX knob 1 targets EffectUnit2_Effect1', () => {
		s5.get().fxUnitRight.knobs[0].input(2048);

		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit2_Effect1]',
			'meta',
			expect.closeTo(0.5, 1)
		);
	});

	test('right FX button 1 toggles EffectUnit2_Effect1', () => {
		s5.get().fxUnitRight.buttons[0].onShortPress();

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit2_Effect1]',
			'enabled'
		);
	});

	test('full FX chain: mix knob → three effect knobs → enable button', () => {
		const instance = s5.get();

		instance.fxUnitLeft.mixKnob.input(3000);
		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1]', 'mix', expect.closeTo(3000 / 4095, 2)
		);

		instance.fxUnitLeft.knobs[0].input(4095);
		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1_Effect1]', 'meta', 1
		);

		instance.fxUnitLeft.knobs[1].input(2048);
		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1_Effect2]', 'meta', expect.closeTo(0.5, 1)
		);

		instance.fxUnitLeft.knobs[2].input(0);
		expect(globalThis.engine.setParameter).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1_Effect3]', 'meta', 0
		);

		instance.fxUnitLeft.buttons[0].onShortPress();
		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[EffectRack1_EffectUnit1_Effect1]', 'enabled'
		);
	});
});
