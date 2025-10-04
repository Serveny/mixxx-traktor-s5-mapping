/*
 * Components library
 */

import { HIDInputReport, HIDOutputReport } from '../hid-report';
import { ButtonBrightnessOff, ButtonBrightnessOn } from '../settings';
import type {
  ComponentConstructor,
  ControlInOptions,
  InOptions,
  ControlOutOptions,
  OutOptions,
  ControlComponentConstructor,
  ComponentOptions,
  ControlOptions,
} from '../types/component';
import type { BytePosIn, BytePosOut } from '../types/mapping';
import type {
  MixxxChannelGroup,
  MixxxGroup,
  MixxxKey,
} from '../types/mixxx-controls';

export class Component<P extends ComponentOptions> {
  constructor(..._: [P]) {}
}

export class ControlComponent<
  TGroup extends MixxxGroup,
  P extends ControlOptions<TGroup>
> extends Component<P> {
  group: TGroup;
  constructor(...args: [P]) {
    super(...args);
    this.group = args[0].group;
  }
}

// Register input from controller
export function InMixin<TBase extends ComponentConstructor>(Base: TBase) {
  return class extends Base {
    inConnection: ScriptConnection;
    inReport: HIDInputReport;
    io: BytePosIn;
    oldDataDefault?: number;

    constructor(...args: any[]) {
      super(...args);
      const opts: InOptions = args[0];
      this.inReport = opts.reports.in[opts.io.inReportId];
      this.io = opts.io;
      if (opts.input) this.input = opts.input;

      this.inConnection = this.inConnect();
    }

    inConnect(): ScriptConnection {
      return this.inReport.registerCallback(
        this.input.bind(this)!,
        this.io,
        this.oldDataDefault
      );
    }

    input(_: number) {
      // Placeholder: Can't do abstract classes in mixins
    }

    inDisconnect() {
      this.inConnection.disconnect();
    }
  };
}

// Register output to controller
export function OutMixin<TBase extends ComponentConstructor>(Base: TBase) {
  return class extends Base {
    outReport: HIDOutputReport;
    io: BytePosOut;

    constructor(...args: any[]) {
      super(...args);
      const opts = args[0] as OutOptions;

      this.outReport = opts.reports.out[opts.io.outReportId];
      this.io = opts.io;
      if (opts.output) this.output = opts.output;
    }

    output(value: number) {
      this.send(value);
    }

    outputArr(data: Uint8Array) {
      for (let i = 0; i < data.length; i++) {
        this.outReport.data[this.io.outByte + i] = data[i];
      }
    }

    send(value: number) {
      this.outReport.data[this.io.outByte] = value;
      this.outReport.send();
    }
  };
}

// Interact with mixxx input control
// input() is called on controller or GUI input
export function ControlInMixin<TBase extends ControlComponentConstructor>(
  Base: TBase
) {
  const BaseIn = InMixin(Base);

  return class extends BaseIn {
    inKey: MixxxKey[keyof MixxxKey];

    constructor(...args: any[]) {
      super(...args);
      const opts = args[0] as ControlInOptions<any>;

      this.inKey = opts.inKey;
    }

    input(pressed: number) {
      engine.setValue(this.group, this.inKey, pressed);
    }

    setInKey(key: MixxxKey[MixxxChannelGroup]) {
      if (key === this.inKey) {
        return;
      }
      this.inDisconnect();
      this.inKey = key;
      this.inConnect();
    }
  };
}

// Interact with mixxx output control
// output() is called on mixxx control change
export function ControlOutMixin<TBase extends ControlComponentConstructor>(
  Base: TBase
) {
  const BaseOut = OutMixin(Base);

  return class extends BaseOut {
    outKey: MixxxKey[keyof MixxxKey];
    outConnection: ScriptConnection;
    constructor(...args: any[]) {
      super(...args);
      const opts = args[0] as ControlOutOptions<any>;

      this.outKey = opts.outKey;
      this.outConnection = this.outConnect();
    }

    outConnect(): ScriptConnection {
      const outCon = engine.makeConnection(
        this.group,
        this.outKey,
        this.output.bind(this)
      );
      if (outCon == null)
        throw Error(
          `Unable to connect ${this.group}.${this.outKey}' to the controller output. The control appears to be unavailable.`
        );
      return outCon;
    }

    outTrigger() {
      this.outConnection.trigger();
    }

    outDisconnect() {
      this.outConnection.disconnect();
    }

    setOutKey(key: MixxxKey[MixxxChannelGroup]) {
      if (key === this.outKey) {
        return;
      }
      this.outDisconnect();
      this.outKey = key;
      this.outConnect();
      this.outTrigger();
    }
  };
}

// Activate shift functionality
export function ShiftMixin<TBase extends ComponentConstructor>(Base: TBase) {
  return class extends Base {
    isShifted = false;

    shift() {
      this.isShifted = true;
      this.onShift();
    }

    unshift() {
      this.isShifted = false;
      this.onUnshift();
    }

    onShift() {}
    onUnshift() {}
  };
}

export function LongPressMixin<TBase extends ControlComponentConstructor>(
  Base: TBase
) {
  return class extends Base {
    longPressTimeOutMillis = 225;
    longPressTimer = 0;
    isLongPress = false;

    onShortPress(): void {}
    onShortRelease(): void {}
    onLongPress(): void {}
    onLongRelease(): void {}

    input(pressed: number) {
      if (pressed) {
        this.isLongPress = false;
        this.onShortPress();

        this.longPressTimer = engine.beginTimer(
          this.longPressTimeOutMillis,
          () => {
            this.isLongPress = true;
            this.longPressTimer = 0;
            this.onLongPress();
          },
          true
        );
      } else if (this.isLongPress) this.onLongRelease();
      else {
        if (this.longPressTimer !== 0) {
          engine.stopTimer(this.longPressTimer);
          this.longPressTimer = 0;
        }
        this.onShortRelease();
      }
    }
  };
}

export function IndicatorMixin<TBase extends ComponentConstructor>(
  Base: TBase
) {
  const BaseOut = OutMixin(Base);

  return class extends BaseOut {
    indicatorIntervalMillis: number = 350;
    indicatorTimer: number = 0;
    indicatorState: boolean = false;

    output(pressed: number) {
      if (this.indicatorTimer !== 0) return;
      this.send(pressed ? ButtonBrightnessOn : ButtonBrightnessOff);
    }

    indicatorCallback() {
      this.indicatorState = !this.indicatorState;
      this.send(this.indicatorState ? ButtonBrightnessOn : ButtonBrightnessOff);
    }

    indicator(on: boolean) {
      if (on && this.indicatorTimer === 0) {
        // this.outDisconnect();
        this.indicatorTimer = engine.beginTimer(
          this.indicatorIntervalMillis,
          this.indicatorCallback.bind(this)
        );
      } else if (!on && this.indicatorTimer !== 0) {
        engine.stopTimer(this.indicatorTimer);
        this.indicatorTimer = 0;
        this.indicatorState = false;
        // this.outConnect();
        // this.outTrigger();
      }
    }
  };
}

export function SetInOutKeyMixin<TBase extends ControlComponentConstructor>(
  Base: TBase
) {
  const BaseOut = ControlOutMixin(ControlInMixin(Base));

  return class extends BaseOut {
    setKey(key: MixxxKey[MixxxChannelGroup]) {
      this.setInKey(key);
      this.setOutKey(key);
    }
  };
}

export function SingleColorOutMixin<TBase extends ComponentConstructor>(
  Base: TBase
) {
  const BaseOut = OutMixin(Base);

  return class extends BaseOut {
    // IMPORTANT: This output function excepts ZERO or ONE
    output(value: number) {
      this.send(value ? ButtonBrightnessOn : ButtonBrightnessOff);
    }
  };
}

export function DoubleColorOutMixin<TBase extends ComponentConstructor>(
  Base: TBase
) {
  const BaseOut = OutMixin(Base);

  return class extends BaseOut {
    outputDoubleColor(brightness1: number, brightness2: number) {
      this.outReport.data[this.io.outByte] = brightness1;
      this.outReport.data[this.io.outByte + 1] = brightness2;
      this.outReport.send();
    }
  };
}
