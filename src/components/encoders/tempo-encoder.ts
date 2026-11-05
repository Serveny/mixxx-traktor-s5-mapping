import { Encoder } from './encoder';
import type { Encoder as EncoderMapping } from '../../types/mapping';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';
import type { HIDReportHolder } from '../../hid-report';
import { channels } from '../../settings';

// -- 🚜 S5 Docs 4.4.2.4:
// "The central TEMPO knob controls TRAKTOR's Tempo Master in BPM. All synced Decks automatically follow tempo changes."
// "The TEMPO encoder changes tempo in increments of .01 BPM. Hold SHIFT to change in increments of 1 BPM."
export class TempoEncoder extends Encoder<MixxxChannelGroup> {
	constructor(
		reports: HIDReportHolder,
		io: EncoderMapping,
		private anyDeckShifted: () => boolean
	) {
		super('[Channel1]', 'bpm', reports, io);
	}

	onChange(isRight: boolean) {
		const step = (this.anyDeckShifted() ? 1 : 0.01) * (isRight ? 1 : -1);
		const leader = channels.find((c) => engine.getValue(c, 'sync_leader'));
		// [InternalClock] is the tempo master when no deck is the leader; it is missing from the control typings.
		const group = (leader ?? '[InternalClock]') as MixxxChannelGroup;
		engine.setValue(group, 'bpm', Math.round((engine.getValue(group, 'bpm') + step) * 100) / 100);
	}

	onPress(): void {}
}
