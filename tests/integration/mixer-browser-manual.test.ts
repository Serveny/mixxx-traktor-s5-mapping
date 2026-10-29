import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

const mockEngine = () => globalThis.engine as any;
const set = (group: string, key: string, value: number) => mockEngine().setValue(group, key, value);
const get = (group: string, key: string): number => mockEngine().getValue(group, key);

describe('AUX, main level and browser BACK (manual 4.4.2 / 4.2.2)', () => {
	beforeEach(() => set('[App]', 'num_decks', 4));

	test('holding AUX mixes both aux inputs into main; loop encoders set their volume', () => {
		const s5 = new S5(mapping);
		set('[Auxiliary2]', 'volume', 0.5);
		s5.mixer.auxButton.input(1);
		expect(get('[Auxiliary1]', 'main_mix')).toBe(1);
		expect(get('[Auxiliary2]', 'main_mix')).toBe(1);

		s5.deckRight.loopEncoder.input(5);
		s5.deckRight.loopEncoder.input(6);
		expect(get('[Auxiliary2]', 'volume')).toBeCloseTo(0.55);
		expect(get('[Channel2]', 'beatloop_size')).toBe(0);

		s5.mixer.auxButton.input(0);
		expect(get('[Auxiliary1]', 'main_mix')).toBe(0);
	});

	test('main clip LEDs follow the main peak indicators', () => {
		const s5 = new S5(mapping);
		const io = mapping.mixer.mainLevel;
		set('[Main]', 'peak_indicator_left', 1);
		set('[Main]', 'peak_indicator_right', 0);
		expect(s5.mixer.updateMainLevel()).toBe(true);
		const data = s5.reports.out[io.outReportId].data;
		expect([data[io.outByte], data[io.outByte + 1]]).toEqual([127, 0]);
		expect(s5.mixer.updateMainLevel()).toBe(false);
	});

	test('holding BACK for a second exits the browser', () => {
		const s5 = new S5(mapping);
		set('[Skin]', 'show_maximized_library', 1);
		const timersBefore = new Set(globalThis.__mixxxTestState.timers.keys());
		s5.deckLeft.browserBackButton.input(1);
		const [timerId] = [...globalThis.__mixxxTestState.timers.keys()].filter((id) => !timersBefore.has(id));
		globalThis.__mixxxTestState.timers.get(timerId)!();
		expect(get('[Skin]', 'show_maximized_library')).toBe(0);
	});
});
