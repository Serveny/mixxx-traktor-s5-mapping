import type { HIDReportHodler } from '../../hid-report';
import { S5 } from '../../s5';
import { channels } from '../../settings';
import type { Btn } from '../../types/mapping';
import { Button } from './button';

export class QuantizeButton extends Button {
  isGlobalQuantize: boolean = this.checkGlobalQuantize();
  constructor(reports: HIDReportHodler, io: Btn) {
    const key = 'quantize';
    super({
      group: `[Channel1]`,
      inKey: key,
      outKey: key,
      reports,
      io,
    });

    this.output(this.isGlobalQuantize ? 1 : 0);
  }

  input(pressed: number) {
    if (pressed) {
      this.isGlobalQuantize = !this.isGlobalQuantize;
      for (const channel of channels) {
        engine.setValue(channel, 'quantize', this.isGlobalQuantize ? 1 : 0);
      }
      this.output(this.isGlobalQuantize ? 127 : 0);
    }
  }

  private checkGlobalQuantize(): boolean {
    return !channels.some((c) => !engine.getValue(c, 'quantize'));
  }
}
