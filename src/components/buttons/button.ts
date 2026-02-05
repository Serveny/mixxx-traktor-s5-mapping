import type { ControlInOutOptions } from '../../types/component';
import {
	ControlInMixin,
	ControlOutMixin,
	ShiftMixin,
	ControlComponent,
	SingleColorOutMixin,
} from '../component';

export abstract class Button extends SingleColorOutMixin(
	ShiftMixin(
		ControlInMixin(
			ControlOutMixin(
				ControlComponent<
					MixxxControls.Group,
					ControlInOutOptions<MixxxControls.Group>
				>
			)
		)
	)
) {
	declare group: MixxxControls.Group;
}

export class PushButton extends Button {
	input(pressed: number) {
		engine.setValue(this.group, this.inKey, pressed);
	}
}

export class ToggleButton extends Button {
	input(pressed: number) {
		if (pressed) script.toggleControl(this.group, this.inKey);
	}
}
