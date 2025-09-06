import { Component } from './component';

export class Pot extends Component {
  max = 2 ** 12 - 1;
  inBit = 0;
  inBitLength = 16;

  constructor(options) {
    super(options);
    this.hardwarePosition = null;
    this.shiftedHardwarePosition = null;

    if (this.input === undefined) {
      this.input = this.defaultInput;
    }
  }
  setGroupKey(group, key) {
    this.inKey = key;
    if (key === this.outKey && group === this.group) {
      return;
    }
    this.outDisconnect();
    this.group = group;
    this.outKey = key;
    this.outConnect();
  }
  defaultInput(value) {
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
