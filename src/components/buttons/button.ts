import type { MixxxKey } from '../../types/mixxx-controls';
import {
  ControlInMixin,
  ControlOutMixin,
  ShiftMixin,
  GroupComponent,
  SingleColorOutMixin,
} from '../component';

export abstract class Button extends SingleColorOutMixin(
  ShiftMixin(ControlInMixin(ControlOutMixin(GroupComponent)))
) {}

export abstract class PushButton extends Button {
  input(pressed: number) {
    engine.setValue(this.group, this.inKey, pressed);
  }
}
