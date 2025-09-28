import type { ControlInOutOptions } from '../../types/component';
import type { MixxxGroup, MixxxKey } from '../../types/mixxx-controls';
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
        ControlComponent<MixxxGroup, ControlInOutOptions<MixxxGroup>>
      )
    )
  )
) {}

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
