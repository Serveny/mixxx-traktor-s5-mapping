import { RgbColor } from '../color';
import type { S5Deck } from './s5-deck';

const sliceCount = 8;

// -- 🚜 S5 Docs 3.3 / 4.2.3.2 / 4.2.4:
// FREEZE takes the playhead position, adds the slice size and splits the section into eight
// slices mapped to the pads. Slicer mode loops the held slice(s) instead of playing on.
// Positions are Mixxx sample positions (interleaved stereo, like loop_start_position).
export class FreezeSlicer {
	start = 0;
	sliceLength = 0;
	slicer = false;
	private heldPads = new Set<number>();
	private fluxJumped = false;
	private lastLeds = '';

	constructor(private deck: S5Deck) {}

	private get group() {
		return this.deck.group;
	}

	private samplesPerBeat() {
		const bpm = engine.getValue(this.group, 'file_bpm');
		return bpm > 0 ? (60 / bpm) * engine.getValue(this.group, 'track_samplerate') * 2 : 0;
	}

	freeze() {
		this.heldPads.clear();
		if (engine.getValue(this.group, 'loop_enabled')) {
			// -- 🚜 S5 Docs 3.3.3: "Press the LOOP encoder to engage a loop. Press the FREEZE button to engage Slicer mode to the active loop."
			const loopStart = engine.getValue(this.group, 'loop_start_position');
			const loopEnd = engine.getValue(this.group, 'loop_end_position');
			this.start = loopStart;
			this.sliceLength = (loopEnd - loopStart) / sliceCount;
			this.slicer = true;
		} else {
			const closestBeat = engine.getValue(this.group, 'beat_closest');
			this.start =
				closestBeat >= 0
					? closestBeat
					: engine.getValue(this.group, 'playposition') *
						engine.getValue(this.group, 'track_samples');
			this.resize();
			this.slicer = false;
		}
		this.lastLeds = '';
	}

	// -- 🚜 S5 Docs 3.3.2: the slice size can be changed between 1/4 and 4 beats.
	resize() {
		this.sliceLength = this.samplesPerBeat() * this.deck.currentSliceSize();
		this.lastLeds = '';
	}

	toggleSlicer() {
		this.slicer = !this.slicer;
		if (!this.slicer) this.releaseLoop();
		this.lastLeds = '';
	}

	exit() {
		if (this.slicer) this.releaseLoop();
		this.slicer = false;
		this.heldPads.clear();
	}

	pad(padNumber: number, pressed: boolean) {
		if (pressed) this.heldPads.add(padNumber);
		else this.heldPads.delete(padNumber);
		const isFlux = engine.getValue(this.group, 'slip_enabled') !== 0;

		// -- 🚜 S5 Docs 3.4: "Note that when the FLUX button is engaged, you cannot make use of Slicer mode on the pads."
		if (this.slicer && !isFlux) {
			this.slicerPad(padNumber, pressed);
			return;
		}
		if (pressed) {
			this.jumpTo(this.sliceStart(padNumber));
			this.fluxJumped = isFlux;
		} else if (this.fluxJumped && this.heldPads.size === 0) {
			// -- 🚜 S5 Docs 3.4: in FREEZE mode, releasing the pad resumes at the second playhead.
			this.fluxJumped = false;
			engine.setValue(this.group, 'slip_enabled', 0);
			engine.setValue(this.group, 'slip_enabled', 1);
		}
	}

	// -- 🚜 S5 Docs 4.2.4: "In Slicer mode, holding a pad will infinitely loop the corresponding slice.
	// Holding two pads will loop the range between the start of one pad and the end of the second."
	private slicerPad(padNumber: number, pressed: boolean) {
		if (this.heldPads.size === 0) {
			this.releaseLoop();
			return;
		}
		const held = [...this.heldPads];
		const first = Math.min(...held);
		const last = Math.max(...held);
		engine.setValue(this.group, 'loop_start_position', this.sliceStart(first));
		engine.setValue(this.group, 'loop_end_position', this.sliceStart(last + 1));
		if (!engine.getValue(this.group, 'loop_enabled')) {
			engine.setValue(this.group, 'reloop_toggle', 1);
		}
		if (pressed) this.jumpTo(this.sliceStart(padNumber));
	}

	private releaseLoop() {
		if (engine.getValue(this.group, 'loop_enabled')) {
			engine.setValue(this.group, 'reloop_toggle', 1);
		}
	}

	private sliceStart(padNumber: number) {
		return this.start + (padNumber - 1) * this.sliceLength;
	}

	private jumpTo(samplePosition: number) {
		const trackSamples = engine.getValue(this.group, 'track_samples');
		if (trackSamples <= 0) return;
		engine.setValue(this.group, 'playposition', samplePosition / trackSamples);
		if (!engine.getValue(this.group, 'play')) engine.setValue(this.group, 'play', 1);
	}

	currentSlice(): number | null {
		if (this.sliceLength <= 0) return null;
		const position =
			engine.getValue(this.group, 'playposition') * engine.getValue(this.group, 'track_samples');
		const slice = Math.floor((position - this.start) / this.sliceLength) + 1;
		return slice >= 1 && slice <= sliceCount ? slice : null;
	}

	// -- 🚜 S5 Docs 3.3 / 4.2.3.2: pads are blue in Freeze mode and green in Slicer mode;
	// the pad of the slice that is currently playing is lit brightest.
	padColors(): RgbColor[] {
		const current = this.currentSlice();
		const slicer = this.slicer && !engine.getValue(this.group, 'slip_enabled');
		return Array.from({ length: sliceCount }, (_, i) => {
			const color = slicer ? RgbColor.fromRgb(0, 127, 0) : RgbColor.blue();
			const bright = current === i + 1 || this.heldPads.has(i + 1);
			return color.brightness(bright ? 1 : 0.15);
		});
	}

	// Returns colours only when they changed since the last call.
	changedPadColors(): RgbColor[] | null {
		const colors = this.padColors();
		const key = colors.map((c) => `${c.r()},${c.g()},${c.b()}`).join(';');
		if (key === this.lastLeds) return null;
		this.lastLeds = key;
		return colors;
	}
}
