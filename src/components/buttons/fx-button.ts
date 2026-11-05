import type { HIDReportHolder } from '../../hid-report';
import type { ControlInOutOptions } from '../../types/component';
import type { Btn } from '../../types/mapping';
import type { EffectGroup as Group } from '../../types/mixxx-controls';
import {
	ControlComponent,
	ControlInMixin,
	ControlOutMixin,
	LongPressMixin,
	ShiftMixin,
	SingleColorOutMixin,
} from '../component';
import type { FxUnitMode, S5EffectUnit } from '../s5-effect-unit';

export class FxButton extends SingleColorOutMixin(
	LongPressMixin(
		ShiftMixin(
			ControlOutMixin(
				ControlInMixin(ControlComponent<Group, ControlInOutOptions<Group>>)
			)
		)
	)
) {
	declare group: Group;
	declare inKey: MixxxControls.CtrlRW<Group>;

	constructor(
		group: Group,
		private unit: S5EffectUnit,
		reports: HIDReportHolder,
		index: number,
		io: Btn[]
	) {
		const key = 'enabled';
		super({
			group,
			inKey: key,
			outKey: key,
			reports,
			io: io[index + 1],
		});
	}

	private isResetButton = false;

	// Group Mode: FX Buttons 2-4 switch effect 1-3 on/off.
	// Single Mode: FX Button 2 resets the parameters, FX Buttons 3/4 are the effect's own buttons.
	applyMode(mode: FxUnitMode, index: number) {
		const effectNumber = (index + 1) as 1 | 2 | 3;
		this.isResetButton = mode === 'single' && index === 0;
		this.rebindGroup(this.unit.effectGroup(mode === 'single' ? 1 : effectNumber));
		const key = mode === 'single' && index > 0 ? (`button_parameter${index}` as const) : 'enabled';
		this.setInKey(key);
		this.setOutKey(key);
	}

	onShortPress() {
		if (this.isResetButton && !this.isShifted) {
			this.unit.resetParameters();
			return;
		}
		if (!this.isShifted || this.unit.focusedEffect !== null) {
			script.toggleControl(this.group, this.inKey);
		}
	}

	onLongPress() {
		if (this.isShifted) {
			this.unit.setFocusedEffect(this.unit.unitNumber);
		}
	}

	onShortRelease() {
		if (this.isShifted && this.unit.focusedEffect === null) {
			script.triggerControl(this.group, 'next_effect', 50);
		}
	}

	onLongRelease() {
		if (!this.isShifted && !this.isResetButton) {
			script.toggleControl(this.group, this.inKey);
		}
	}
}
