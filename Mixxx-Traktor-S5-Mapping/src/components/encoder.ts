import { Component } from './component';

export class Encoder extends Component {
  inBitLength = 4;
  lastValue: number | null = null;
  max: number = 0;
  onChange(isRight: boolean) {}
  constructor(options: Partial<Component>) {
    super(options);
  }
  input(value: number) {
    const oldValue = this.lastValue;
    this.lastValue = value;

    if (oldValue === null || typeof this.onChange !== 'function') {
      // This scenario happens at the controller initialisation. No real input to proceed
      return;
    }
    let isRight;
    if (oldValue === this.max && value === 0) {
      isRight = true;
    } else if (oldValue === 0 && value === this.max) {
      isRight = false;
    } else {
      isRight = value > oldValue;
    }
    this.onChange(isRight);
  }
}
