import type { S5 } from '../s5';
import type { ControlOutOptions } from '../types/component';
import type { Meter } from '../types/mapping';
import {
	channelGroup,
	type AuxiliaryGroup,
	type DeckChannel,
	type MicrophoneGroup,
	type MixxxChannelGroup,
} from '../types/mixxx-controls';
import { ControlComponent, ControlOutMixin } from './component';

type Group =
	| MixxxChannelGroup
	| AuxiliaryGroup
	| MicrophoneGroup;

const FullBrightness = 127;
const DimBrightness = 125;

export class VolumeMeter extends ControlOutMixin(
	ControlComponent<Group, ControlOutOptions<Group>>
) {
	// Each column has 11 segments, I could reserve the top one specially for the clip indicator,
	// but in my opinion it looks irritating if the top blinks and the one under is not on
	private deckSegments = 11;
	private channelGroup: MixxxChannelGroup;
	private auxGroup: `[Auxiliary${number}]`;
	private micGroup: `[Microphone${number}]`;
	private oldDeckLevel = 0;
	isChange = false;

	constructor(
		deckNum: DeckChannel,
		outKey: MixxxControls.Ctrl<Group>,
		private s5: S5,
		io: Meter
	) {
		super({
			group: channelGroup(deckNum),
			outKey,
			reports: s5.reports,
			io,
		});
		this.channelGroup = channelGroup(deckNum);
		this.auxGroup = `[Auxiliary${deckNum}]`;
		this.micGroup = `[Microphone${deckNum}]`;
	}

	output() {
		let deckGroup: Group = this.channelGroup;
		const isAnyDeckShifted = !!(
			this.s5.deckLeft?.isShifted || this.s5.deckRight?.isShifted
		);
		if (isAnyDeckShifted) {
			if (engine.getValue(this.auxGroup, 'input_configured')) {
				deckGroup = this.auxGroup;
			} else if (engine.getValue(this.micGroup, 'input_configured')) {
				deckGroup = this.micGroup;
			}
		}
		const deckLevel = Math.max(0, Math.min(engine.getValue(deckGroup, 'vu_meter'), 1));
		this.isChange = deckLevel !== this.oldDeckLevel;
		if (!this.isChange) return;
		this.oldDeckLevel = deckLevel;

		const columnBaseIndex = this.io.outByte;
		const scaledLevel = deckLevel * this.deckSegments;
		for (let i = 0; i < this.deckSegments; i++) {
			const segmentLevel = scaledLevel - i;
			this.outReport.data[columnBaseIndex + i] =
				segmentLevel >= 1
					? FullBrightness
					: segmentLevel > 0.5
						? DimBrightness
						: 0;
		}
	}
}
