import type { MixxxKey } from '../../types/mixxx-controls';
import {
  ControlInMixin,
  ControlOutMixin,
  ShiftMixin,
  GroupComponent,
  IndicatorMixin,
} from '../component';

export abstract class Button extends IndicatorMixin(
  ShiftMixin(ControlInMixin(ControlOutMixin(GroupComponent)))
) {}

export abstract class PushButton extends Button {
  input(pressed: number) {
    engine.setValue(this.group, this.inKey, pressed);
  }
}
