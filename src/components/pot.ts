import type { HIDReportHodler } from '../hid-report';
import type { ControlInOptions } from '../types/component';
import type { Knob } from '../types/mapping';
import { ControlComponent, ControlInMixin } from './component';

export class Pot<TGroup extends MixxxControls.Group> extends ControlInMixin(
	ControlComponent<MixxxControls.Group, ControlInOptions<MixxxControls.Group>>
) {
	declare group: TGroup;
	declare inKey: MixxxControls.CtrlRW<TGroup>;

	max = 2 ** 12 - 1;
	hardwarePosition: number | null;
	shiftedHardwarePosition: number | null;

	constructor(
		group: TGroup,
		inKey: MixxxControls.CtrlRW<TGroup>,
		reports: HIDReportHodler,
		io: Knob
	) {
		super({
			group,
			inKey,
			reports,
			io: {
				inReportId: io.inReportId,
				inByte: io.inByte,
				inBit: 0,
				inLengthBit: 16,
			},
		});
		this.hardwarePosition = null;
		this.shiftedHardwarePosition = null;
	}

	input(value: number) {
		const receivingFirstValue = this.hardwarePosition === null;
		this.hardwarePosition = value / this.max;
		engine.setParameter(this.group, this.inKey, this.hardwarePosition);
		if (receivingFirstValue) {
			engine.softTakeover(this.group, this.inKey, true);
		}
	}
}
