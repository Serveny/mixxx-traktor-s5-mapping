import type { HIDReportHodler } from '../hid-report';
import type { Knob } from '../types/mapping';
import type { MixxxGroup, MixxxKey } from '../types/mixxx-controls';
import { ComponentIn } from './component';
import type { Mixer } from './mixer';

export class Pot<TGroup extends MixxxGroup> extends ComponentIn<TGroup> {
  max = 2 ** 12 - 1;
  hardwarePosition: number | null;
  shiftedHardwarePosition: number | null;
  mixer?: Mixer;

  constructor(
    group: TGroup,
    inKey: MixxxKey[TGroup],
    reports: HIDReportHodler,
    io: Knob
  ) {
    super({
      group,
      inKey,
      reports,
      io: {
        inReportId: io.inReportId,
        inByte: io.inByte,
        inBit: 0,
        inLengthBit: 16,
      },
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
}
