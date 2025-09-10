import type { HIDInputReport } from '../hid-input-record';
import { Component } from './component';
import type { Mixer } from './mixer';

export class Pot extends Component {
  max = 2 ** 12 - 1;
  inBit = 0;
  inBitLength = 16;
  hardwarePosition: number | null;
  shiftedHardwarePosition: number | null;
  mixer?: Mixer;

  constructor(
    group: string,
    inKey: string,
    inByte: number,
    bitLength: number,
    inReport: HIDInputReport
  ) {
    super(undefined, inKey, undefined, undefined);
    this.hardwarePosition = null;
    this.shiftedHardwarePosition = null;

    if (this.input === undefined) {
      this.input = this.defaultInput;
    }
  }
  setGroupKey(group: string, key: string) {
    this.inKey = key;
    if (key === this.outKey && group === this.group) {
      return;
    }
    this.outDisconnect();
    this.group = group;
    this.outKey = key;
    this.outConnect();
  }
  defaultInput(value: number) {
    const receivingFirstValue = this.hardwarePosition === null;
    this.hardwarePosition = value / this.max;
    engine.setParameter(this.group, this.inKey, this.hardwarePosition);
    if (receivingFirstValue) {
      engine.softTakeover(this.group, this.inKey, true);
    }
  }
  outDisconnect() {
    if (this.hardwarePosition !== null) {
      engine.softTakeover(this.group, this.inKey, true);
    }
    engine.softTakeoverIgnoreNextValue(this.group, this.inKey);
    super.outDisconnect();
  }
}
