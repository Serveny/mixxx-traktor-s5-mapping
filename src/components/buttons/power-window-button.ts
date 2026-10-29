import type { HIDReportHodler } from '../../hid-report';
import type { ControlInOutOptions } from '../../types/component';
import type { Btn } from '../../types/mapping';
import {
	ControlComponent,
	ControlInMixin,
	ControlOutMixin,
	ShiftMixin,
	IndicatorMixin,
} from '../component';
import type { S5EffectUnit } from '../s5-effect-unit';

type Group = `[EffectRack1_EffectUnit${number}]`;
type EffectGroup = `[EffectRack1_EffectUnit${number}_Effect${number}]`;

export class PowerWindowButton extends IndicatorMixin(
	ShiftMixin(
		ControlOutMixin(
			ControlInMixin(ControlComponent<Group, ControlInOutOptions<Group>>)
		)
	)
) {
	constructor(
		private unit: S5EffectUnit,
		reports: HIDReportHodler,
		io: Btn
	) {
		const key: `group_[Channel${number}]_enable` = `group_[Channel${unit.unitNumber}]_enable`;
		super({
			group: unit.group,
			inKey: key,
			outKey: key,
			reports,
			io,
		});
	}

	onShift() {
		this.group = this.unit.group;
		this.outKey = 'group_[Master]_enable';
		this.outConnect();
		this.outTrigger();
	}

	onUnshift() {
		this.outDisconnect();
		this.group = this.unit.group;
		const key =
			`group_${this.unit.group}_enable` as `group_[Channel${number}]_enable`;
		this.outKey = key;
		this.output(0);
	}

	input(pressed: number) {
		if (this.isShifted) {
			if (pressed) this.unit.toggleMode();
			return;
		}
		if (this.unit.mode === 'single') {
			// -- 🚜 S5 Docs 4.3 (Single Mode): "FX Button 1: Activate/deactivate the entire FX Unit."
			if (pressed) {
				script.toggleControl(this.unit.effectGroup(1), 'enabled');
				this.output(engine.getValue(this.unit.effectGroup(1), 'enabled'));
			}
			return;
		}
		for (const index of [0, 1, 2]) {
			const effectGroup = `[EffectRack1_EffectUnit${
				this.unit.unitNumber
			}_Effect${index + 1}]` as EffectGroup;
			engine.setValue(effectGroup, 'enabled', pressed);
		}
		this.output(pressed);
	}
}
