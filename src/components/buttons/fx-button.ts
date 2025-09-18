import type { HIDReportHodler } from '../../hid-report';
import type { Btn } from '../../types/mapping';
import type { S5EffectUnit } from '../s5-effect-unit';
import { Button } from './button';

export class FxButton extends Button<`[EffectRack1_EffectUnit${number}_Effect${number}]`> {
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
      script.triggerControl(this.group, 'next_effect', 0);
    }
  }

  onLongRelease() {
    if (!this.isShifted) {
      script.toggleControl(this.group, this.inKey);
    }
  }
}
