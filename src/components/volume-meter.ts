import type { S5 } from '../s5';
import type { ControlOutOptions } from '../types/component';
import type { Meter } from '../types/mapping';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import { ControlComponent, ControlOutMixin } from './component';

type Group =
	| MixxxChannelGroup
	| `[Auxiliary${number}]`
	| `[Microphone${number}]`;

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
		private deckNum: number,
		outKey: MixxxControls.Ctrl<Group>,
		private s5: S5,
		io: Meter
	) {
		super({
			group: `[Channel${deckNum}]`,
			outKey,
			reports: s5.reports,
			io,
		});
		this.channelGroup = `[Channel${deckNum}]`;
		this.auxGroup = `[Auxiliary${deckNum}]`;
		this.micGroup = `[Microphone${deckNum}]`;
	}

	output() {
		const deckNum = this.deckNum;
		let deckGroup: Group = this.channelGroup;
		if (this.s5.deckLeft.isShifted || this.s5.deckRight.isShifted) {
			if (engine.getValue(this.auxGroup, 'input_configured')) {
				deckGroup = this.auxGroup;
			} else if (engine.getValue(this.micGroup, 'input_configured')) {
				deckGroup = this.micGroup;
			}
		}
		const deckLevel = engine.getValue(deckGroup, 'vu_meter');
		this.isChange = deckLevel !== this.oldDeckLevel;
		if (!this.isChange) return;
		this.oldDeckLevel = deckLevel;

		const columnBaseIndex = this.io.outByte;
		const scaledLevel = deckLevel * this.deckSegments;
		const segmentsToLightFully = Math.floor(scaledLevel);
		const partialSegmentValue = scaledLevel - segmentsToLightFully;
		if (segmentsToLightFully > 0) {
			// There are 3 brightness levels per segment: off, dim, and full.
			for (let i = 0; i <= segmentsToLightFully; i++) {
				this.outReport.data[columnBaseIndex + i] = 127;
			}
			if (
				partialSegmentValue > 0.5 &&
				segmentsToLightFully < this.deckSegments
			) {
				this.outReport.data[columnBaseIndex + segmentsToLightFully + 1] = 125;
			}
		}

		for (let i = segmentsToLightFully; i < this.deckSegments; i++)
			this.outReport.data[columnBaseIndex + i] = 0;

		// Peak indicator, but I do not use it
		//const peak = engine.getValue(deckGroup, 'PeakIndicator') * 127;
		//this.outReport.data[columnBaseIndex + this.deckSegments] = peak;
	}
}
