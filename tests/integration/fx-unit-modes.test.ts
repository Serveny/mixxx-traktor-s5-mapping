import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

const mockEngine = () => globalThis.engine as any;
const set = (group: string, key: string, value: number) => mockEngine().setValue(group, key, value);
const get = (group: string, key: string): number => mockEngine().getValue(group, key);
const unit1 = '[EffectRack1_EffectUnit1]';
const effect = (n: number) => `[EffectRack1_EffectUnit1_Effect${n}]`;

describe('FX unit Single and Group mode (manual 4.3)', () => {
	beforeEach(() => set('[App]', 'num_decks', 4));

	function singleMode() {
		const s5 = new S5(mapping);
		s5.deckLeft.shiftButton.input(1);
		s5.fxUnitLeft.mainButton.input(1);
		s5.deckLeft.shiftButton.input(0);
		return s5;
	}

	test('left deck shift + FX button 1 switches FX unit 1 to single mode', () => {
		const s5 = singleMode();
		expect(s5.fxUnitLeft.mode).toBe('single');
		expect(s5.fxUnitRight.mode).toBe('group');
	});

	test('single mode: knobs 2-4 control parameters 1-3 of effect 1', () => {
		const s5 = singleMode();
		s5.fxUnitLeft.knobs[2].input(4095);
		expect(get(effect(1), 'parameter3')).toBe(1);
		expect(get(effect(3), 'meta')).toBe(0);
	});

	test('single mode: FX button 1 toggles the effect, button 2 resets, buttons 3/4 are effect buttons', () => {
		const s5 = singleMode();
		s5.fxUnitLeft.mainButton.input(1);
		expect(get(effect(1), 'enabled')).toBe(1);

		s5.fxUnitLeft.buttons[0].onShortPress();
		expect(get(effect(1), 'parameter1_set_default')).toBe(1);
		expect(get(effect(1), 'enabled')).toBe(1);

		s5.fxUnitLeft.buttons[1].onShortPress();
		expect(get(effect(1), 'button_parameter1')).toBe(1);
	});

	test('switching back to group mode restores effect meta knobs and on/off buttons', () => {
		const s5 = singleMode();
		s5.deckLeft.shiftButton.input(1);
		s5.fxUnitLeft.mainButton.input(1);
		s5.deckLeft.shiftButton.input(0);
		s5.fxUnitLeft.knobs[1].input(4095);
		expect(get(effect(2), 'meta')).toBe(1);
		s5.fxUnitLeft.buttons[2].onShortPress();
		expect(get(effect(3), 'enabled')).toBe(1);
	});

	test('touching an FX knob shows the parameter panel while touched', () => {
		const s5 = new S5(mapping);
		const touch = [...s5.fxUnitLeft].find((c: any) => c.io === mapping.fxUnitLeft.knobs[1].touch) as any;
		touch.input(1);
		expect(get(unit1, 'show_parameters')).toBe(1);
		touch.input(0);
		expect(get(unit1, 'show_parameters')).toBe(0);
	});
});
