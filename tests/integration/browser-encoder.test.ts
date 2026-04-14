import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

describe('browser encoder', () => {
	beforeEach(() => {
		globalThis.engine.setValue('[App]', 'num_decks', 4);
		globalThis.engine.setValue('[App]', 'num_samplers', 16);
	});

	test('falls back to direct track browsing when the library has no focus', () => {
		const s5 = new S5(mapping);
		const encoder = s5.deckLeft.browserEncoder;

		globalThis.engine.setValue('[Library]', 'focused_widget', 0);
		(
			globalThis.engine.setValue as ReturnType<typeof import('vitest').vi.fn>
		).mockClear();

		encoder.input(5);
		encoder.input(6);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Playlist]',
			'SelectNextTrack',
			1
		);
		expect(s5.deckLeft.display.isPlaylistSelected).toBe(true);
		expect(
			(
				globalThis.engine.setValue as ReturnType<
					typeof import('vitest').vi.fn
				>
			).mock.calls
		).not.toContainEqual(['[Library]', 'MoveDown', 1]);
	});

	test('falls back to direct playlist browsing when shifted and the library has no focus', () => {
		const s5 = new S5(mapping);
		const encoder = s5.deckLeft.browserEncoder;

		s5.deckLeft.shiftButton.input(1);
		globalThis.engine.setValue('[Library]', 'focused_widget', 0);
		(
			globalThis.engine.setValue as ReturnType<typeof import('vitest').vi.fn>
		).mockClear();

		encoder.input(5);
		encoder.input(6);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Playlist]',
			'SelectNextPlaylist',
			1
		);
		expect(s5.deckLeft.display.isPlaylistSelected).toBe(false);
	});

	test('retargets the focused library widget before moving when Mixxx still has focus', () => {
		const s5 = new S5(mapping);
		const encoder = s5.deckLeft.browserEncoder;

		globalThis.engine.setValue('[Library]', 'focused_widget', 1);
		(
			globalThis.engine.setValue as ReturnType<typeof import('vitest').vi.fn>
		).mockClear();

		encoder.input(5);
		encoder.input(6);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Library]',
			'focused_widget',
			3
		);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Library]',
			'MoveDown',
			1
		);
		expect(s5.deckLeft.display.isPlaylistSelected).toBe(true);
	});

	test('loads the selected track after focusless track browsing', () => {
		const s5 = new S5(mapping);
		const encoder = s5.deckLeft.browserEncoder;

		globalThis.engine.setValue('[Library]', 'focused_widget', 0);
		(
			globalThis.engine.setValue as ReturnType<typeof import('vitest').vi.fn>
		).mockClear();

		encoder.input(5);
		encoder.input(6);
		encoder.onPress(1);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Playlist]',
			'SelectNextTrack',
			1
		);
		expect(globalThis.engine.setValue).toHaveBeenCalledWith(
			'[Channel1]',
			'LoadSelectedTrack',
			1
		);
	});

	test('adjusts bpm instead of browsing while the bpm popup is active', () => {
		const s5 = new S5(mapping);
		const encoder = s5.deckLeft.browserEncoder;

		globalThis.engine.setValue('[Channel1]', 'bpm', 120);
		s5.deckLeft.display.displayButton1.input(1);
		(globalThis.engine.setValue as ReturnType<typeof import('vitest').vi.fn>).mockClear();

		encoder.input(5);
		encoder.input(6);

		expect(globalThis.engine.setValue).toHaveBeenCalledWith('[Channel1]', 'bpm', 120.1);
		expect(
			(globalThis.engine.setValue as ReturnType<typeof import('vitest').vi.fn>).mock.calls
		).not.toContainEqual(['[Library]', 'MoveDown', 1]);
	});

	test('browse press toggles keylock while the key popup is active', () => {
		const s5 = new S5(mapping);
		const encoder = s5.deckLeft.browserEncoder;

		s5.deckLeft.display.displayButton2.input(1);
		encoder.onPress(1);

		expect(globalThis.script.toggleControl).toHaveBeenCalledWith(
			'[Channel1]',
			'keylock'
		);
	});

	test('adjusts the quantize popup selection while remix mode is active', () => {
		const s5 = new S5(mapping);
		const encoder = s5.deckLeft.browserEncoder;

		s5.deckLeft.remixModeButton.input(1);
		s5.deckLeft.display.displayButton2.input(1);
		expect(s5.deckLeft.quantizeSizeIndex).toBe(2);

		encoder.input(5);
		encoder.input(6);

		expect(s5.deckLeft.quantizeSizeIndex).toBe(3);
	});
});
