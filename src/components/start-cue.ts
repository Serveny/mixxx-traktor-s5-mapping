import { channels } from '../settings';
import type { MixxxChannelGroup } from '../types/mixxx-controls';

// Mixxx's kMaxNumberOfHotcues.
const hotcueCount = 36;
// Mixxx attaches a track's stored cues right after raising track_loaded; wait before checking them
// so an existing hotcue 1 is never overwritten.
const cueLoadDelayMillis = 200;
// hotcue_X_position rejects 0, so the start cue sits on the first frame (one stereo frame = 2 samples).
const trackStartSamplePos = 2;
const startCueColor = 0xffffff;

// -- 🚜 S5 Docs 2.7:
// "pad 1 always represents the Start Cue Point that will be assigned automatically as soon as a
// track is loaded." Only tracks without any hotcue get one, so the user's own cues stay untouched.
export function connectStartCues() {
	for (const group of channels) {
		engine.makeConnection(group, 'track_loaded', (loaded) => {
			if (!loaded) return;
			engine.beginTimer(cueLoadDelayMillis, () => setStartCue(group), true);
		});
	}
}

function setStartCue(group: MixxxChannelGroup) {
	if (!engine.getValue(group, 'track_loaded')) return;
	for (let n = 1; n <= hotcueCount; n++) {
		if (engine.getValue(group, `hotcue_${n}_status`)) return;
	}
	engine.setValue(group, 'hotcue_1_setcue', 1);
	engine.setValue(group, 'hotcue_1_position', trackStartSamplePos);
	engine.setValue(group, 'hotcue_1_color', startCueColor);
}

// Keeps the automatic start cue on the grid's first beat after a beatgrid edit, so it marks the
// corrected start. Only a white hotcue 1 within the first two beats counts as the start cue; any
// other hotcue 1 is the user's and stays put. Assumes a constant-tempo grid (Mixxx's default).
// Mixxx updates beat_closest synchronously when the grid changes, so this can run right after the edit.
export function moveStartCueToFirstBeat(group: MixxxChannelGroup) {
	const bpm = engine.getValue(group, 'file_bpm');
	const sampleRate = engine.getValue(group, 'track_samplerate');
	const closestBeat = engine.getValue(group, 'beat_closest');
	if (bpm <= 0 || sampleRate <= 0 || closestBeat < 0) return;
	if (!engine.getValue(group, 'hotcue_1_status')) return;
	if (engine.getValue(group, 'hotcue_1_color') !== startCueColor) return;

	// Engine sample positions count both stereo channels.
	const beatLength = (60 / bpm) * sampleRate * 2;
	if (engine.getValue(group, 'hotcue_1_position') >= 2 * beatLength) return;

	const firstBeat = ((closestBeat % beatLength) + beatLength) % beatLength;
	const firstFrame = Math.round(firstBeat / 2) * 2;
	engine.setValue(group, 'hotcue_1_position', Math.max(firstFrame, trackStartSamplePos));
}
