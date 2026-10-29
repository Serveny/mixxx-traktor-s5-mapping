import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

const state = () => globalThis.__mixxxTestState;
const mockEngine = () => globalThis.engine as any;
const set = (group: string, key: string, value: number) => mockEngine().setValue(group, key, value);
const get = (group: string, key: string): number => mockEngine().getValue(group, key);
// The mock engine does not fire connections on setValue; do it for a single control.
const fire = (group: string, key: string) =>
	state()
		.connections.filter((c) => c.group === group && c.control === key)
		.forEach((c) => c.callback(get(group, key)));

describe('REMIX mode with Mixxx samplers (manual 3.5 / 3.6)', () => {
	beforeEach(() => {
		set('[App]', 'num_decks', 4);
		set('[App]', 'num_samplers', 16);
	});

	test('the S5 provides 16 remix samplers per deck side', () => {
		new S5(mapping);
		expect(get('[App]', 'num_samplers')).toBe(32);
	});

	test('pads trigger the side bank: left deck samplers 1-8, right deck 17-24', () => {
		const s5 = new S5(mapping);
		set('[Sampler3]', 'track_loaded', 1);
		set('[Sampler19]', 'track_loaded', 1);
		s5.deckLeft.remixModeButton.input(1);
		s5.deckLeft.remixModeButton.input(0);
		s5.deckRight.remixModeButton.input(1);
		s5.deckRight.remixModeButton.input(0);

		s5.deckLeft.pads[2].input(1);
		s5.deckRight.pads[2].input(1);
		expect(get('[Sampler3]', 'cue_gotoandplay')).toBe(1);
		expect(get('[Sampler19]', 'cue_gotoandplay')).toBe(1);
		expect(get('[Channel1]', 'hotcue_3_activate')).toBe(0);
	});

	test('only one sample per slot plays: a pad in the same column stops the other row (3.5.2)', () => {
		const s5 = new S5(mapping);
		set('[Sampler1]', 'track_loaded', 1);
		set('[Sampler1]', 'play', 1);
		set('[Sampler5]', 'track_loaded', 1);
		s5.deckLeft.remixModeButton.input(1);
		s5.deckLeft.remixModeButton.input(0);

		s5.deckLeft.pads[4].input(1); // pad 5 = slot 1, second row
		expect(get('[Sampler1]', 'cue_gotoandstop')).toBe(1);
		expect(get('[Sampler5]', 'cue_gotoandplay')).toBe(1);
	});

	test('shift+pad stops, REMIX held + pad mutes the slot (3.5.2 / 3.5.4)', () => {
		const s5 = new S5(mapping);
		set('[Sampler2]', 'track_loaded', 1);
		s5.deckLeft.remixModeButton.input(1);
		s5.deckLeft.pads[1].input(1);
		expect(get('[Sampler2]', 'mute')).toBe(1);
		expect(get('[Sampler6]', 'mute')).toBe(1);
		s5.deckLeft.remixModeButton.input(0);

		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.pads[1].input(1);
		expect(get('[Sampler2]', 'cue_gotoandstop')).toBe(1);
	});

	test('display button 4 scrolls to the next page of cells (4.2.1.2)', () => {
		const s5 = new S5(mapping);
		s5.deckLeft.remixModeButton.input(1);
		s5.deckLeft.remixModeButton.input(0);
		s5.deckLeft.display.displayButton4.input(1);
		expect(s5.deckLeft.remix.sampler(1)).toBe('[Sampler9]');
		expect(get('[Channel1]', 'waveform_zoom_up')).toBe(0);
	});

	test('an empty pad captures a loop-sized sample from the deck (3.6)', () => {
		const s5 = new S5(mapping);
		set('[Channel1]', 'track_loaded', 1);
		set('[Channel1]', 'file_bpm', 120);
		set('[Channel1]', 'track_samplerate', 44100);
		set('[Channel1]', 'beat_closest', 441000);
		set('[Channel1]', 'beatloop_size', 4);
		s5.deckLeft.remixModeButton.input(1);
		s5.deckLeft.remixModeButton.input(0);

		s5.deckLeft.pads[0].input(1);
		expect(get('[Sampler1]', 'LoadTrackFromDeck')).toBe(1);

		set('[Sampler1]', 'track_loaded', 1);
		fire('[Sampler1]', 'track_loaded');
		expect(get('[Sampler1]', 'loop_start_position')).toBe(441000);
		expect(get('[Sampler1]', 'loop_end_position')).toBe(441000 + 4 * 44100);
		expect(get('[Sampler1]', 'hotcue_1_setloop')).toBe(1);
		expect(get('[Sampler1]', 'sync_enabled')).toBe(1);
	});
});

describe('Stem Deck pads (manual 3.8.3)', () => {
	beforeEach(() => {
		set('[App]', 'num_decks', 4);
		set('[Channel1]', 'stem_count', 4);
	});

	function stemDeck() {
		const s5 = new S5(mapping);
		s5.deckLeft.remixModeButton.input(1);
		s5.deckLeft.remixModeButton.input(0);
		return s5;
	}

	test('upper pads mute stems, lower pads select them', () => {
		const s5 = stemDeck();
		expect(s5.deckLeft.isStemMode()).toBe(true);
		s5.deckLeft.pads[1].input(1);
		expect(get('[Channel1_Stem2]', 'mute')).toBe(1);
		expect(get('[Sampler2]', 'cue_gotoandplay')).toBe(0);
	});

	test('browse adjusts and resets the volume of the selected stems', () => {
		const s5 = stemDeck();
		set('[Channel1_Stem3]', 'volume', 1);
		s5.deckLeft.pads[6].input(1); // select stem 3
		s5.deckLeft.browserEncoder.input(5);
		s5.deckLeft.browserEncoder.input(4);
		expect(get('[Channel1_Stem3]', 'volume')).toBeCloseTo(0.95);
		s5.deckLeft.browserEncoder.onPress(1);
		expect(get('[Channel1_Stem3]', 'volume')).toBe(1);
	});

	test('filter page: loop press toggles and loop turn moves the stem filter', () => {
		const s5 = stemDeck();
		set('[QuickEffectRack1_[Channel1_Stem1]]', 'super1', 0.5);
		s5.deckLeft.display.perfModeRightButton.input(1); // VOLUME -> FILTER
		s5.deckLeft.pads[4].input(1); // select stem 1
		s5.deckLeft.loopEncoder.onPress(1);
		expect(get('[QuickEffectRack1_[Channel1_Stem1]]', 'enabled')).toBe(1);
		s5.deckLeft.loopEncoder.input(5);
		s5.deckLeft.loopEncoder.input(6);
		expect(get('[QuickEffectRack1_[Channel1_Stem1]]', 'super1')).toBeCloseTo(0.55);
	});

	test('shift + lower pad resets volume and filter of that stem', () => {
		const s5 = stemDeck();
		set('[Channel1_Stem4]', 'volume', 0.2);
		set('[QuickEffectRack1_[Channel1_Stem4]]', 'enabled', 1);
		s5.deckLeft.shiftButton.input(1);
		s5.deckLeft.pads[7].input(1);
		expect(get('[Channel1_Stem4]', 'volume')).toBe(1);
		expect(get('[QuickEffectRack1_[Channel1_Stem4]]', 'enabled')).toBe(0);
		expect(get('[QuickEffectRack1_[Channel1_Stem4]]', 'super1')).toBe(0.5);
	});
});
