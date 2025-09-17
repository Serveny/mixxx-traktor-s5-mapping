import type { HIDReportHodler } from '../../hid-report';
import type { Btn } from '../../types/mapping';
import type { S5EffectUnit } from '../s5-effect-unit';
import { Button } from './button';

export class PowerWindowButton extends Button<`[EffectRack1_EffectUnit${number}]`> {
  constructor(private unit: S5EffectUnit, reports: HIDReportHodler, io: Btn) {
    const key =
      `group_${unit.group}_enable` as `group_[Channel${number}]_enable`;
    super({
      inKey: key,
      outKey: key,
      group: unit.group,
      reports,
      io,
    });
    this.isLongPress = false;
    this.longPressTimer = 0;
  }

  onShortPress() {
    script.toggleControl(this.group, this.inKey);
  }

  onLongRelease() {
    script.toggleControl(this.group, this.inKey);
  }

  shift() {
    this.group = this.unit.group;
    this.outKey = 'group_[Master]_enable';
    this.outConnect();
    this.outTrigger();
  }

  unshift() {
    this.outDisconnect();
    this.group = this.unit.group;
    const key =
      `group_${this.unit.group}_enable` as `group_[Channel${number}]_enable`;
    this.outKey = key;
    this.output(0);
  }

  input(pressed: number) {
    if (!this.isShifted) {
      for (const index of [0, 1, 2]) {
        const effectGroup = `[EffectRack1_EffectUnit${
          this.unit.unitNumber
        }_Effect${index + 1}]`;
        engine.setValue(effectGroup, 'enabled', pressed);
      }
      this.output(pressed);
    } else if (pressed) {
      if (this.unit.focusedEffect !== null) {
        this.unit.setFocusedEffect(null);
      } else {
        script.toggleControl(this.unit.group, 'group_[Master]_enable');
        this.shift();
      }
    }
  }
}
