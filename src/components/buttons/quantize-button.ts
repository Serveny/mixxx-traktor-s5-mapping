import type { HIDReportHodler } from '../../hid-report';
import type { Btn } from '../../types/mapping';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';
import { Button } from './button';

export class QuantizeButton extends Button<MixxxChannelGroup> {
  globalQuantizeOn: boolean = false;
  constructor(reports: HIDReportHodler, io: Btn) {
    const key = 'quantize';
    super({
      group: `[Channel1]`,
      inKey: key,
      outKey: key,
      reports,
      io,
    });
  }

  input(pressed: number) {
    if (pressed) {
      this.globalQuantizeOn = !this.globalQuantizeOn;
      for (let deckIdx = 1; deckIdx <= 4; deckIdx++) {
        engine.setValue(
          `[Channel${deckIdx}]`,
          'quantize',
          this.globalQuantizeOn ? 1 : 0
        );
      }
      this.send(this.globalQuantizeOn ? 127 : 0);
    }
  }
}
