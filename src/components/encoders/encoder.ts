import type { HIDReportHodler } from '../../hid-report';
import type {
  Encoder as EncoderMapping,
  TouchEncoder as TouchEncoderMapping,
} from '../../types/mapping';
import type { ControlInOptions, InOptions } from '../../types/component';
import type { MixxxGroup, MixxxKey } from '../../types/mixxx-controls';
import {
  Component,
  InMixin,
  ShiftMixin,
  ControlComponent,
  ControlInMixin,
} from '../component';

export abstract class Encoder<TGroup extends MixxxGroup> extends ShiftMixin(
  ControlInMixin(ControlComponent<MixxxGroup, ControlInOptions<MixxxGroup>>)
) {
  inBitLength = 4;
  lastValue: number | null = null;
  max: number = 0;
  isPressed: boolean = false;

  press: EncoderPress;

  constructor(
    group: TGroup,
    inKey: MixxxKey[TGroup],
    reports: HIDReportHodler,
    io: EncoderMapping
  ) {
    super({
      group,
      inKey,
      reports,
      io: io.fade,
    });

    // TODO
    this.press = new EncoderPress(this, {
      reports,
      io: io.press,
    });
  }

  abstract onChange(isRight: boolean): void;
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

export abstract class TouchEncoder<
  TGroup extends MixxxGroup
> extends Encoder<TGroup> {
  touch: EncoderTouch;
  constructor(
    group: TGroup,
    inKey: MixxxKey[TGroup],
    reports: HIDReportHodler,
    io: TouchEncoderMapping
  ) {
    super(group, inKey, reports, io);

    this.touch = new EncoderTouch(this, {
      reports,
      io: io.touch,
    });
  }
  abstract onTouch(value: number): void;
}

class EncoderPress extends InMixin(Component<InOptions>) {
  constructor(private encoder: Encoder<MixxxGroup>, opts: InOptions) {
    super(opts);
  }
  input(value: number) {
    this.encoder.onPress(value);
  }
}

class EncoderTouch extends InMixin(Component<InOptions>) {
  constructor(private encoder: TouchEncoder<MixxxGroup>, opts: InOptions) {
    super(opts);
  }
  input(value: number) {
    this.encoder.onTouch(value);
  }
}
