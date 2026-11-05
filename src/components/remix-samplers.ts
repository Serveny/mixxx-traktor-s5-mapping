import { RgbColor } from '../color';
import type { S5Deck } from './s5-deck';
import type { SamplerGroup } from '../types/mixxx-controls';

// Mixxx has no Remix Decks; each deck side drives its own bank of samplers instead.
// The bank is laid out like a Remix Set: 4 slots (pad columns) x 4 rows, the pads show two rows (one page).
export const samplersPerSide = 16;
const slots = 4;
const rowsPerPage = 2;
const pageCount = samplersPerSide / (slots * rowsPerPage);
// Cell colours per slot, like the coloured columns of a Remix Set.
const slotColors = [0x7f3f00, 0x007f20, 0x7f007f, 0x007f7f];

// -- 🚜 S5 Docs 3.5 / 3.6 / 4.2.3.3 / 4.2.4: REMIX mode on a Track Deck.
export class RemixSamplers {
	page = 0;
	remixButtonHeld = false;
	private lastLeds = '';

	constructor(private deck: S5Deck) {}

	private get firstSampler() {
		return this.deck.decks[0] === 1 ? 1 : samplersPerSide + 1;
	}

	sampler(padNumber: number): SamplerGroup {
		return `[Sampler${this.firstSampler + this.page * slots * rowsPerPage + padNumber - 1}]`;
	}

	private samplersInSlot(slot: number): SamplerGroup[] {
		return Array.from(
			{ length: samplersPerSide / slots },
			(_, row): SamplerGroup => `[Sampler${this.firstSampler + row * slots + slot}]`
		);
	}

	pad(padNumber: number, pressed: boolean, shifted: boolean) {
		if (!pressed) return;
		const group = this.sampler(padNumber);

		if (this.remixButtonHeld) {
			// -- 🚜 S5 Docs 3.5.4: "Hold the REMIX button ... Press a Pad that refers to the Remix Slot you want to mute."
			for (const sampler of this.samplersInSlot((padNumber - 1) % slots)) {
				script.toggleControl(sampler, 'mute');
			}
			return;
		}
		if (shifted) {
			// -- 🚜 S5 Docs 3.5.2: "Press SHIFT + pad 1 to stop playback."
			engine.setValue(group, 'cue_gotoandstop', 1);
			return;
		}
		if (!engine.getValue(group, 'track_loaded')) {
			this.capture(group);
			return;
		}
		// -- 🚜 S5 Docs 3.5.2: "Note that only one Sample per Remix Slot (column in the display) can play at a time."
		for (const sampler of this.samplersInSlot((padNumber - 1) % slots)) {
			if (sampler !== group && engine.getValue(sampler, 'play')) {
				engine.setValue(sampler, 'cue_gotoandstop', 1);
			}
		}
		if (engine.getValue(group, 'hotcue_1_status')) {
			engine.setValue(group, 'hotcue_1_activate', 1);
			engine.setValue(group, 'hotcue_1_activate', 0);
			engine.setValue(group, 'play', 1);
		} else {
			engine.setValue(group, 'cue_gotoandplay', 1);
		}
	}

	// -- 🚜 S5 Docs 3.6: "Press one of the unlit pads to capture a Sample from the current playback position."
	// The capture size is the loop size. The captured section is stored as saved loop on hotcue 1.
	capture(sampler: SamplerGroup) {
		const source = this.deck.group;
		if (!engine.getValue(source, 'track_loaded')) return;
		const bpm = engine.getValue(source, 'file_bpm');
		const samplesPerBeat = bpm > 0 ? (60 / bpm) * engine.getValue(source, 'track_samplerate') * 2 : 0;
		if (samplesPerBeat <= 0) return;
		const closestBeat = engine.getValue(source, 'beat_closest');
		const start =
			closestBeat >= 0
				? closestBeat
				: engine.getValue(source, 'playposition') * engine.getValue(source, 'track_samples');
		const end = start + this.deck.currentLoopSize() * samplesPerBeat;

		const connection = engine.makeConnection(sampler, 'track_loaded', (loaded) => {
			if (!loaded) return;
			connection?.disconnect();
			engine.setValue(sampler, 'loop_start_position', start);
			engine.setValue(sampler, 'loop_end_position', end);
			engine.setValue(sampler, 'hotcue_1_setloop', 1);
			engine.setValue(sampler, 'sync_enabled', 1);
		});
		engine.setValue(sampler, 'LoadTrackFromDeck', this.deck.decks[this.deck.currentDeckIdx]);
	}

	// -- 🚜 S5 Docs 3.5.2 / 4.2.1.2: Display Buttons 3/4 (or REMIX + LOOP turn) scroll the cell rows in steps of two.
	scroll(direction: 1 | -1) {
		this.page = Math.max(0, Math.min(pageCount - 1, this.page + direction));
		this.lastLeds = '';
	}

	padColors(): RgbColor[] {
		return Array.from({ length: slots * rowsPerPage }, (_, i) => {
			const group = this.sampler(i + 1);
			if (this.remixButtonHeld) {
				// -- 🚜 S5 Docs 3.5.4: pads turn white while REMIX is held; muted slots are dim.
				return RgbColor.white().brightness(engine.getValue(group, 'mute') ? 0.1 : 1);
			}
			if (!engine.getValue(group, 'track_loaded')) return new RgbColor(0);
			return new RgbColor(slotColors[i % slots]).brightness(engine.getValue(group, 'play') ? 1 : 0.2);
		});
	}

	changedPadColors(): RgbColor[] | null {
		const colors = this.padColors();
		const key = colors.map((c) => `${c.r()},${c.g()},${c.b()}`).join(';');
		if (key === this.lastLeds) return null;
		this.lastLeds = key;
		return colors;
	}

	invalidate() {
		this.lastLeds = '';
	}
}
