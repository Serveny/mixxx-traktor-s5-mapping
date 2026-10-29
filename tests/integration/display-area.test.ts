import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

describe('display area popup controls', () => {
	beforeEach(() => {
		globalThis.engine.setValue('[App]', 'num_decks', 4);
		globalThis.engine.setValue('[App]', 'num_samplers', 16);
	});

	test('display button 1 toggles the bpm popup and view closes it', () => {
		const s5 = new S5(mapping);
		const display = s5.deckLeft.display;

		display.displayButton1.input(1);
		expect(display.activePopup).toBe('bpm');

		display.displayButton1.input(1);
		expect(display.activePopup).toBe('none');

		display.displayButton1.input(1);
		(globalThis.script.toggleControl as ReturnType<typeof import('vitest').vi.fn>).mockClear();
		display.viewButton.input(1);
		expect(display.activePopup).toBe('none');
		expect(globalThis.script.toggleControl).not.toHaveBeenCalledWith(
			'[Skin]',
			'show_maximized_library'
		);
	});

	test('view button flashes while a popup is open (manual 4.2.1.4)', () => {
		const s5 = new S5(mapping);
		const display = s5.deckLeft.display;
		const io = mapping.deckLeft.displayAreaAndControls.view;
		const led = () => s5.reports.out[io.outReportId].data[io.outByte];
		const timersBefore = new Set(globalThis.__mixxxTestState.timers.keys());

		display.displayButton1.input(1);
		expect(led()).toBe(127);
		const [blink] = [...globalThis.__mixxxTestState.timers.keys()].filter(
			(id) => !timersBefore.has(id) && id !== Math.max(...globalThis.__mixxxTestState.timers.keys())
		);
		globalThis.__mixxxTestState.timers.get(blink)!();
		expect(led()).toBe(9);

		display.viewButton.input(1);
		expect(display.activePopup).toBe('none');
		expect(led()).toBe(9);
		expect(globalThis.__mixxxTestState.timers.has(blink)).toBe(false);
	});

	test('display button 2 opens key popup in hotcue mode and quantize popup in remix mode', () => {
		const s5 = new S5(mapping);
		const display = s5.deckLeft.display;

		display.displayButton2.input(1);
		expect(display.activePopup).toBe('key');

		s5.deckLeft.remixModeButton.input(1);
		display.displayButton2.input(1);
		expect(display.activePopup).toBe('quantize');
	});

	test('popup timeout callback closes the active popup', () => {
		const s5 = new S5(mapping);
		const display = s5.deckLeft.display;

		display.displayButton1.input(1);
		expect(display.activePopup).toBe('bpm');

		const timerId = Math.max(...globalThis.__mixxxTestState.timers.keys());
		globalThis.__mixxxTestState.timers.get(timerId)?.();

		expect(display.activePopup).toBe('none');
	});

	test('opening slice size clears the previous popup timer', () => {
		const s5 = new S5(mapping);
		const display = s5.deckLeft.display;

		display.displayButton1.input(1);
		const bpmPopupTimer = Math.max(...globalThis.__mixxxTestState.timers.keys());
		s5.deckLeft.freezeButton.input(1);
		s5.deckLeft.loopEncoder.onTouch(1);

		expect(display.activePopup).toBe('sliceSize');
		expect(globalThis.__mixxxTestState.timers.has(bpmPopupTimer)).toBe(false);
	});

	test('changing performance mode closes an incompatible popup', () => {
		const s5 = new S5(mapping);
		const display = s5.deckLeft.display;

		display.displayButton2.input(1);
		expect(display.activePopup).toBe('key');

		s5.deckLeft.remixModeButton.input(1);
		expect(display.activePopup).toBe('none');
	});

	test('settings button uses the library fallback action', () => {
		const s5 = new S5(mapping);

		s5.deckLeft.display.settingsButton.input(1);

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[Skin]',
			'show_maximized_library'
		);
	});

	test('publishes deck focus and popup state for the screens when shared data exists', () => {
		let shared: Record<string, unknown> = { other: 1 };
		const sharedEngine = globalThis.engine as any;
		sharedEngine.getSharedData = () => shared;
		sharedEngine.setSharedData = (data: Record<string, unknown>) => {
			shared = data;
		};
		try {
			const s5 = new S5(mapping);
			s5.deckRight.display.displayButton1.input(1);
			expect(shared.rightdeck).toMatchObject({ group: '[Channel2]', popup: 'bpm' });

			s5.deckRight.toggleDeck();
			expect(shared.rightdeck).toMatchObject({ group: '[Channel4]', popup: 'none' });
			expect(shared.other).toBe(1);
		} finally {
			delete sharedEngine.getSharedData;
			delete sharedEngine.setSharedData;
		}
	});
});
