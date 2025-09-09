import { LedColors } from '../../color';
import { HIDInputReport } from '../../hid-input-record';
import { Component } from '../component';

export class Button extends Component {
  // valid range 0 - 3, but 3 makes some colors appear whitish
  brightnessOff = 0;
  brightnessOn = 2;
  uncoloredOutput(value: number) {
    if (this.indicatorTimer !== 0) {
      return;
    }
    const color =
      value > 0
        ? (this.color || LedColors.white) + this.brightnessOn
        : LedColors.off;
    this.send(color);
  }
  colorMap = new ColorMapper({
    0xcc0000: LedColors.red,
    0xcc5e00: LedColors.carrot,
    0xcc7800: LedColors.orange,
    0xcc9200: LedColors.honey,

    0xcccc00: LedColors.yellow,
    0x81cc00: LedColors.lime,
    0x00cc00: LedColors.green,
    0x00cc49: LedColors.aqua,

    0x00cccc: LedColors.celeste,
    0x0091cc: LedColors.sky,
    0x0000cc: LedColors.blue,
    0xcc00cc: LedColors.purple,

    0xcc0091: LedColors.fuscia,
    0xcc0079: LedColors.magenta,
    0xcc477e: LedColors.azalea,
    0xcc4761: LedColors.salmon,

    0xcccccc: LedColors.white,
  });

  longPressTimeOutMillis: number;
  indicatorIntervalMillis: number;
  longPressTimer: number;
  indicatorTimer: number;
  indicatorState: boolean;
  isLongPress: boolean;
  color?: number;
  indicatorColor?: number;
  onShortPress() {}
  onShortRelease() {}
  onLongPress(button: Button) {}
  onLongRelease() {}
  globalQuantizeOn?: boolean;
  constructor(options: Partial<Button>) {
    options.oldDataDefault = 0;

    super(options);

    if (this.input === undefined) {
      this.input = this.defaultInput;
      if (
        typeof this.input === 'function' &&
        this.inReport instanceof HIDInputReport &&
        this.input.length === 0
      ) {
        this.inConnect();
      }
    }

    this.longPressTimeOutMillis =
      options.longPressTimeOutMillis === undefined
        ? 225
        : options.longPressTimeOutMillis;
    this.indicatorIntervalMillis =
      options.indicatorIntervalMillis === undefined
        ? 350
        : options.indicatorIntervalMillis;
    this.longPressTimer = 0;
    this.indicatorTimer = 0;
    this.indicatorState = false;
    this.isLongPress = false;
    if (this.inBitLength === undefined) {
      this.inBitLength = 1;
    }
  }
  setKey(key: string) {
    this.inKey = key;
    if (key === this.outKey) {
      return;
    }
    this.outDisconnect();
    this.outKey = key;
    this.outConnect();
    this.outTrigger();
  }
  setGroup(group: string) {
    if (group === this.group) {
      return;
    }
    this.outDisconnect();
    this.group = group;
    this.outConnect();
    this.outTrigger();
  }
  output(value: number) {
    if (this.indicatorTimer !== 0) {
      return;
    }
    const brightness =
      (value > 0 ? this.brightnessOn : this.brightnessOff) ?? 0;
    this.send((this.color || LedColors.white) + brightness);
  }
  indicatorCallback() {
    this.indicatorState = !this.indicatorState;
    this.send(
      (this.indicatorColor || this.color || LedColors.white) +
        ((this.indicatorState ? this.brightnessOn : this.brightnessOff) ?? 0)
    );
  }
  indicator(on: boolean) {
    if (on && this.indicatorTimer === 0) {
      this.outDisconnect();
      this.indicatorTimer = engine.beginTimer(
        this.indicatorIntervalMillis,
        this.indicatorCallback.bind(this)
      );
    } else if (!on && this.indicatorTimer !== 0) {
      engine.stopTimer(this.indicatorTimer);
      this.indicatorTimer = 0;
      this.indicatorState = false;
      this.outConnect();
      this.outTrigger();
    }
  }
  defaultInput(pressed: number) {
    if (pressed) {
      this.isLongPress = false;
      if (
        typeof this.onShortPress === 'function' &&
        this.onShortPress.length === 0
      ) {
        this.onShortPress();
      }
      if (
        (typeof this.onLongPress === 'function' &&
          this.onLongPress.length === 0) ||
        (typeof this.onLongRelease === 'function' &&
          this.onLongRelease.length === 0)
      ) {
        this.longPressTimer = engine.beginTimer(
          this.longPressTimeOutMillis,
          () => {
            this.isLongPress = true;
            this.longPressTimer = 0;
            if (typeof this.onLongPress !== 'function') {
              return;
            }
            this.onLongPress(this);
          },
          true
        );
      }
    } else if (this.isLongPress) {
      if (
        typeof this.onLongRelease === 'function' &&
        this.onLongRelease.length === 0
      ) {
        this.onLongRelease();
      }
    } else {
      if (this.longPressTimer !== 0) {
        engine.stopTimer(this.longPressTimer);
        this.longPressTimer = 0;
      }
      if (
        typeof this.onShortRelease === 'function' &&
        this.onShortRelease.length === 0
      ) {
        this.onShortRelease();
      }
    }
  }
}

export class PushButton extends Button {
  constructor(options: Partial<PushButton>) {
    super(options);
  }
  input(pressed: number) {
    engine.setValue(this.group, this.inKey, pressed);
  }
}

export class ToggleButton extends Button {
  constructor(options: Partial<ToggleButton>) {
    super(options);
  }
  onShortPress() {
    script.toggleControl(this.group, this.inKey);
  }
}

export class TriggerButton extends Button {
  constructor(options: Partial<TriggerButton>) {
    super(options);
  }
  onShortPress() {
    engine.setValue(this.group, this.inKey, 1);
  }
  onShortRelease() {
    engine.setValue(this.group, this.inKey, 0);
  }
}

export class PowerWindowButton extends Button {
  isLongPressed: boolean;
  unit!: Component;
  constructor(options: Partial<PowerWindowButton>) {
    super(options);
    this.isLongPressed = false;
    this.longPressTimer = 0;
  }
  onShortPress() {
    script.toggleControl(this.group, this.inKey);
  }
  onLongRelease() {
    script.toggleControl(this.group, this.inKey);
  }
}
