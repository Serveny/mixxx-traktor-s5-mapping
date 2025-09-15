import type { HIDReportHodler } from '../hid-report';
import type { Knob } from '../types/mapping';
import { ComponentIn } from './component';
import type { Mixer } from './mixer';

export class Pot extends ComponentIn {
  max = 2 ** 12 - 1;
  hardwarePosition: number | null;
  shiftedHardwarePosition: number | null;
  mixer?: Mixer;

  constructor(
    group: string,
    inKey: string,
    reports: HIDReportHodler,
    io: Knob
  ) {
    super({
      group,
      inKey,
      reports,
      io: { inBit: 0, inLengthBit: 16, ...io },
    });
    this.hardwarePosition = null;
    this.shiftedHardwarePosition = null;
  }

  input(value: number) {
    const receivingFirstValue = this.hardwarePosition === null;
    this.hardwarePosition = value / this.max;
    engine.setParameter(this.group, this.inKey, this.hardwarePosition);
    if (receivingFirstValue) {
      engine.softTakeover(this.group, this.inKey, true);
    }
  }

  //outDisconnect() {
  //if (this.hardwarePosition !== null) {
  //engine.softTakeover(this.group, this.inKey, true);
  //}
  //engine.softTakeoverIgnoreNextValue(this.group, this.inKey);
  //super.outDisconnect();
  //}
}
