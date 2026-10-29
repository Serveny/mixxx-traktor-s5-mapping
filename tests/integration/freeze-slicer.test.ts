import { beforeEach, describe, expect, test } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';

const mockEngine = () => globalThis.engine as any;
const set = (group: string, key: string, value: number) => mockEngine().setValue(group, key, value);
const get = (group: string, key: string): number => mockEngine().getValue(group, key);

// 120 BPM at 44.1 kHz: one beat = 0.5 s = 44100 interleaved stereo samples.
const beat = 44100;

function loadTrack() {
	set('[Channel1]', 'file_bpm', 120);
	set('[Channel1]', 'track_samplerate', 44100);
	set('[Channel1]', 'track_samples', beat * 400);
	set('[Channel1]', 'beat_closest', beat * 100);
	set('[Channel1]', 'playposition', 100 / 400);
}

describe('FREEZE and Slicer mode (manual 3.3)', () => {
	beforeEach(() => {
		set('[App]', 'num_decks', 4);
		set('[App]', 'num_samplers', 16);
	});

	test('freeze splits the section from the playhead into eight slices of the slice size', () => {
		loadTrack();
		const s5 = new S5(mapping);
		s5.deckLeft.freezeButton.input(1);

		const freeze = s5.deckLeft.freezeSlicer;
		expect(s5.deckLeft.performanceMode).toBe('freeze');
		expect(freeze.start).toBe(beat * 100);
		expect(freeze.sliceLength).toBe(beat); // default slice size: 1 beat

		s5.deckLeft.pads[4].input(1); // pad 5 -> slice 5
		expect(get('[Channel1]', 'playposition') * beat * 400).toBeCloseTo(beat * 104);
		expect(get('[Channel1]', 'play')).toBe(1);
	});

	test('pads do not touch hotcues in freeze mode', () => {
		loadTrack();
		const s5 = new S5(mapping);
		s5.deckLeft.freezeButton.input(1);
		s5.deckLeft.pads[0].input(1);
		expect(get('[Channel1]', 'hotcue_1_activate')).toBe(0);
	});

	test('the playing slice is lit brightest, the others dim blue', () => {
		loadTrack();
		const s5 = new S5(mapping);
		s5.deckLeft.freezeButton.input(1);
		set('[Channel1]', 'playposition', (beat * 102.5) / (beat * 400)); // inside slice 3

		const colors = s5.deckLeft.freezeSlicer.padColors();
		expect(colors[2].b()).toBe(127);
		expect(colors[0].b()).toBeCloseTo(127 * 0.15);
		expect(colors[0].g()).toBe(0);
	});

	test('changing the slice size while frozen resizes the slices (3.3.2)', () => {
		loadTrack();
		const s5 = new S5(mapping);
		s5.deckLeft.freezeButton.input(1);
		s5.deckLeft.adjustSliceSize(1); // 1 -> 2 beats
		expect(s5.deckLeft.freezeSlicer.sliceLength).toBe(beat * 2);
	});

	test('loop encoder press toggles slicer; holding two pads loops the range between them (4.2.4)', () => {
		loadTrack();
		const s5 = new S5(mapping);
		s5.deckLeft.freezeButton.input(1);
		s5.deckLeft.loopEncoder.onPress(1);
		expect(s5.deckLeft.freezeSlicer.slicer).toBe(true);

		s5.deckLeft.pads[1].input(1); // slice 2
		s5.deckLeft.pads[3].input(1); // slice 4
		expect(get('[Channel1]', 'loop_start_position')).toBe(beat * 101);
		expect(get('[Channel1]', 'loop_end_position')).toBe(beat * 104);

		set('[Channel1]', 'loop_enabled', 1);
		s5.deckLeft.pads[1].input(0);
		s5.deckLeft.pads[3].input(0);
		expect(get('[Channel1]', 'reloop_toggle')).toBe(1); // loop released
	});

	test('freeze on an active loop starts slicer mode on that loop (3.3.3)', () => {
		loadTrack();
		set('[Channel1]', 'loop_enabled', 1);
		set('[Channel1]', 'loop_start_position', beat * 200);
		set('[Channel1]', 'loop_end_position', beat * 204);
		const s5 = new S5(mapping);
		s5.deckLeft.freezeButton.input(1);

		expect(s5.deckLeft.freezeSlicer.slicer).toBe(true);
		expect(s5.deckLeft.freezeSlicer.start).toBe(beat * 200);
		expect(s5.deckLeft.freezeSlicer.sliceLength).toBe(beat / 2);
	});

	test('hotcue button leaves freeze and pads trigger hotcues again', () => {
		loadTrack();
		const s5 = new S5(mapping);
		s5.deckLeft.freezeButton.input(1);
		s5.deckLeft.hotcueModeButton.onShortPress();
		s5.deckLeft.pads[0].input(1);
		expect(get('[Channel1]', 'hotcue_1_activate')).toBe(1);
	});
});
