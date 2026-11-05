import type { HIDReportHolder } from '../../hid-report';
import type { ControlInOutOptions } from '../../types/component';
import type { Btn } from '../../types/mapping';
import type { EffectUnitGroup as Group } from '../../types/mixxx-controls';
import {
	ControlComponent,
	ControlInMixin,
	ControlOutMixin,
	ShiftMixin,
	IndicatorMixin,
} from '../component';
import type { S5EffectUnit } from '../s5-effect-unit';

export class PowerWindowButton extends IndicatorMixin(
	ShiftMixin(
		ControlOutMixin(
			ControlInMixin(ControlComponent<Group, ControlInOutOptions<Group>>)
		)
	)
) {
	constructor(
		private unit: S5EffectUnit,
		reports: HIDReportHolder,
		io: Btn
	) {
		const key = `group_[Channel${unit.unitNumber}]_enable` as const;
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
		this.outKey = `group_[Channel${this.unit.unitNumber}]_enable`;
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
		for (const effectNumber of [1, 2, 3] as const) {
			engine.setValue(this.unit.effectGroup(effectNumber), 'enabled', pressed);
		}
		this.output(pressed);
	}
}
