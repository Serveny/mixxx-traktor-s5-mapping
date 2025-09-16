import type { HIDReportHodler } from '../../hid-report';
import { ComponentIn } from '../component';
import type { Encoder as EncoderMapping } from '../../types/mapping';
import type { ComponentInOptions } from '../../types/component';

export abstract class Encoder extends ComponentIn {
  inBitLength = 4;
  lastValue: number | null = null;
  max: number = 0;
  isPressed: boolean = false;

  touch: EncoderTouch;
  press: EncoderPress;

  constructor(
    group: string,
    inKey: string,
    reports: HIDReportHodler,
    io: EncoderMapping
  ) {
    super({
      group,
      inKey,
      reports,
      io: io.fade,
    });

    this.touch = new EncoderTouch(this, {
      group,
      inKey: `${inKey}_touch`,
      reports,
      io: io.touch,
    });

    this.press = new EncoderPress(this, {
      group,
      inKey: `${inKey}_press`,
      reports,
      io: io.press,
    });
  }

  abstract onChange(isRight: boolean): void;
  abstract onTouch(value: number): void;
  abstract onPress(value: number): void;

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

class EncoderTouch extends ComponentIn {
  constructor(private encoder: Encoder, opts: ComponentInOptions) {
    super(opts);
  }
  input(value: number) {
    this.encoder.onTouch(value);
  }
}

class EncoderPress extends ComponentIn {
  constructor(private encoder: Encoder, opts: ComponentInOptions) {
    super(opts);
  }
  input(value: number) {
    this.encoder.onPress(value);
  }
}
