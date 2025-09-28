import type { HIDReportHodler } from '../../hid-report';
import type { Btn } from '../../types/mapping';
import {
  ControlComponent,
  ControlInMixin,
  ControlOutMixin,
  LongPressMixin,
  ShiftMixin,
  SingleColorOutMixin,
} from '../component';
import type { S5EffectUnit } from '../s5-effect-unit';

export class FxButton extends SingleColorOutMixin(
  LongPressMixin(
    ShiftMixin(
      ControlOutMixin(
        ControlInMixin(ControlComponent<`[EffectRack1_EffectUnit${number}]`>)
      )
    )
  )
) {
  constructor(
    group: `[EffectRack1_EffectUnit${number}_Effect${number}]`,
    private unit: S5EffectUnit,
    reports: HIDReportHodler,
    private index: number,
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

  onShortPress() {
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
    if (!this.isShifted) {
      script.toggleControl(this.group, this.inKey);
    }
  }
}
