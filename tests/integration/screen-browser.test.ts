import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';
import { settings } from '../../src/settings';

const mockEngine = () => globalThis.engine as any;
const set = (group: string, key: string, value: number) => mockEngine().setValue(group, key, value);
const get = (group: string, key: string): number => mockEngine().getValue(group, key);

describe('browser on the deck display (manual 2.1)', () => {
	let shared: Record<string, Record<string, unknown>>;

	beforeEach(() => {
		set('[App]', 'num_decks', 4);
		shared = {};
		mockEngine().setSharedValue = (entity: string, key: string, value: unknown) => {
			(shared[entity] ??= {})[key] = value;
		};
	});

	afterEach(() => {
		delete mockEngine().setSharedValue;
		settings.autoOpenBrowserOnTouch = false;
	});

	test('BROWSE press opens the browser, turning scrolls, pressing again opens or loads the selection (2.1.1 / 2.1.2)', () => {
		const s5 = new S5(mapping);
		const enc = s5.deckLeft.browserEncoder;

		enc.onPress(1);
		expect(shared.leftdeck.popup).toBe('browser');

		enc.onChange(true);
		enc.onChange(true);
		enc.onChange(false);
		expect(shared.leftdeck.browserScrollRequest).toBe(1);

		s5.deckLeft.shiftButton.input(1);
		enc.onChange(true);
		s5.deckLeft.shiftButton.input(0);
		expect(shared.leftdeck.browserScrollRequest).toBe(9);

		enc.onPress(1);
		expect(shared.leftdeck.browserActivateRequest).toBe(1);
		expect(shared.leftdeck.popup).toBe('browser');
	});

	test('loading a track into the deck closes its browser (2.2.1)', () => {
		const s5 = new S5(mapping);
		s5.deckLeft.browserEncoder.onPress(1);
		const trackLoaded = (group: string) =>
			globalThis.__mixxxTestState.connections
				.filter((c: any) => c.group === group && c.control === 'track_loaded')
				.forEach((c: any) => c.trigger());

		set('[Channel2]', 'track_loaded', 1);
		trackLoaded('[Channel2]');
		expect(shared.leftdeck.popup).toBe('browser');

		set('[Channel1]', 'track_loaded', 1);
		trackLoaded('[Channel1]');
		expect(shared.leftdeck.popup).toBe('none');
	});

	test('the browser is never open on both displays at once (2.1)', () => {
		const s5 = new S5(mapping);
		s5.deckLeft.browserEncoder.onPress(1);
		s5.deckRight.browserEncoder.onPress(1);
		expect(shared.leftdeck.popup).toBe('none');
		expect(shared.rightdeck.popup).toBe('browser');
	});

	test('BACK goes up a folder, holding it for a second or VIEW closes the browser (2.1.2 / 4.2.2)', () => {
		const timers = globalThis.__mixxxTestState.timers;
		const newestTimer = () => Math.max(...timers.keys());
		const s5 = new S5(mapping);
		s5.deckLeft.browserEncoder.onPress(1);
		s5.deckLeft.browserBackButton.input(1);
		s5.deckLeft.browserBackButton.input(0);
		expect(shared.leftdeck.browserBackRequest).toBe(1);
		expect(shared.leftdeck.popup).toBe('browser');

		s5.deckLeft.browserBackButton.input(1);
		timers.get(newestTimer())!();
		expect(shared.leftdeck.browserBackRequest).toBe(2);
		expect(shared.leftdeck.popup).toBe('none');

		s5.deckLeft.browserEncoder.onPress(1);
		s5.deckLeft.display.viewButton.input(1);
		expect(shared.leftdeck.popup).toBe('none');
		expect(get('[Skin]', 'show_maximized_library')).toBe(0);
	});

	test('SORT BY: left performance button, LOOP turns the category and press flips the order (2.1.5)', () => {
		const s5 = new S5(mapping);
		const deck = s5.deckLeft;
		deck.browserEncoder.onPress(1);
		deck.display.perfModeLeftButton.input(1);
		expect(shared.leftdeck.browserSorting).toBe(true);

		expect(shared.leftdeck.browserSortColumn).toBe(3); // "#": Mixxx's library order
		deck.loopEncoder.onChange(false);
		expect(shared.leftdeck.browserSortColumn).toBe(2);
		deck.loopEncoder.onPress(1);
		expect(shared.leftdeck.browserSortDescending).toBe(true);
		expect(get('[Channel1]', 'beatloop_activate')).toBe(0);

		deck.display.viewButton.input(1);
		expect(shared.leftdeck.browserSorting).toBe(false);
	});

	test('PREVIEW: right performance button, LOOP press previews, LOOP turn seeks (2.1.4)', () => {
		const s5 = new S5(mapping);
		const deck = s5.deckLeft;
		deck.browserEncoder.onPress(1);
		deck.display.perfModeRightButton.input(1);
		expect(shared.leftdeck.browserPreviewMode).toBe(true);

		deck.loopEncoder.onPress(1);
		expect(shared.leftdeck.browserPreviewRequest).toBe(1);

		deck.loopEncoder.onChange(true);
		expect(get('[PreviewDeck1]', 'beatjump')).toBe(16);

		set('[PreviewDeck1]', 'play', 1);
		deck.loopEncoder.onPress(1);
		expect(get('[PreviewDeck1]', 'play')).toBe(0);
		expect(shared.leftdeck.browserPreviewRequest).toBe(1);
	});

	test('with Auto Open Browser on Touch, touching opens and the browser closes 3 s after the last interaction (2.1.3)', () => {
		settings.autoOpenBrowserOnTouch = true;
		const timers = globalThis.__mixxxTestState.timers;
		const newestTimer = () => Math.max(...timers.keys());
		const s5 = new S5(mapping);
		const enc = s5.deckRight.browserEncoder;

		enc.onTouch(1);
		expect(shared.rightdeck.popup).toBe('browser');
		enc.onTouch(0);
		expect(shared.rightdeck.popup).toBe('browser');

		const firstClose = newestTimer();
		enc.onChange(true);
		expect(timers.has(firstClose)).toBe(false);

		enc.onTouch(1);
		enc.onTouch(0);
		timers.get(newestTimer())!();
		expect(shared.rightdeck.popup).toBe('none');
	});
});
