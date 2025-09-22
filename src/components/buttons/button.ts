import { LedColors } from '../../color';
import { ComponentInOut } from '../component';
import type { ButtonOptions } from '../../types/component';
import type { MixxxGroup, MixxxKey } from '../../types/mixxx-controls';

export abstract class Button<
  TGroup extends MixxxGroup
> extends ComponentInOut<TGroup> {
  // valid range 0 - 3, but 3 makes some colors appear whitish
  brightnessOff = 0;
  brightnessOn = 2;

  longPressTimeOutMillis: number = 225;
  indicatorIntervalMillis: number = 350;
  longPressTimer: number = 0;
  indicatorTimer: number = 0;
  indicatorState: boolean = false;
  isLongPress: boolean = false;
  color?: number;
  indicatorColor?: number;

  globalQuantizeOn?: boolean;

  constructor(opts: ButtonOptions<TGroup>) {
    super(opts);
  }

  setKey(key: MixxxKey[TGroup]) {
    this.inKey = key;
    if (key === this.outKey) {
      return;
    }
    this.outDisconnect();
    this.outKey = key;
    this.outConnect();
    this.outTrigger();
  }

  uncoloredOutput(value: number) {
    if (this.indicatorTimer !== 0) return;
    const color =
      value > 0
        ? (this.color || LedColors.white) + this.brightnessOn
        : LedColors.off;
    this.send(color);
  }

  output(value: number) {
    if (this.indicatorTimer !== 0) {
      return;
    }
    const brightness =
      (value > 0 ? this.brightnessOn : this.brightnessOff) ?? 0;
    this.send((this.color || LedColors.white) * brightness);
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
    } else if (this.isLongPress) {
      this.onLongRelease();
    } else {
      if (this.longPressTimer !== 0) {
        engine.stopTimer(this.longPressTimer);
        this.longPressTimer = 0;
      }
      this.onShortRelease();
    }
  }

  shift() {
    this.isShifted = true;
  }

  unshift() {
    this.isShifted = false;
  }
}

export abstract class PushButton<
  TGroup extends MixxxGroup
> extends Button<TGroup> {
  constructor(opts: ButtonOptions<TGroup>) {
    super(opts);
  }

  input(pressed: number) {
    engine.setValue(this.group, this.inKey, pressed);
  }
}

export abstract class ToggleButton<
  TGroup extends MixxxGroup
> extends Button<TGroup> {
  constructor(opts: ButtonOptions<TGroup>) {
    super(opts);
  }

  onShortPress() {
    script.toggleControl(this.group, this.inKey);
  }

  input(pressed: number) {
    if (pressed) {
      this.isLongPress = false;
      this.onShortPress();
    } else if (!this.isLongPress && this.longPressTimer !== 0) {
      engine.stopTimer(this.longPressTimer);
      this.longPressTimer = 0;
    }
  }
}

export abstract class TriggerButton<
  TGroup extends MixxxGroup
> extends Button<TGroup> {
  constructor(opts: ButtonOptions<TGroup>) {
    super(opts);
  }

  onShortPress() {
    engine.setValue(this.group, this.inKey, 1);
  }

  onShortRelease() {
    engine.setValue(this.group, this.inKey, 0);
  }

  input(pressed: number) {
    if (pressed) {
      this.isLongPress = false;
      this.onShortPress();
    } else if (!this.isLongPress && this.longPressTimer !== 0) {
      engine.stopTimer(this.longPressTimer);
      this.longPressTimer = 0;
      this.onShortRelease();
    }
  }
}

//input(pressed: number) {
//if (pressed) {
//this.isLongPress = false;
//if (
//typeof this.onShortPress === 'function' &&
//this.onShortPress.length === 0
//) {
//this.onShortPress();
//}
//if (
//(typeof this.onLongPress === 'function' &&
//this.onLongPress.length === 0) ||
//(typeof this.onLongRelease === 'function' &&
//this.onLongRelease.length === 0)
//) {
//this.longPressTimer = engine.beginTimer(
//this.longPressTimeOutMillis,
//() => {
//this.isLongPress = true;
//this.longPressTimer = 0;
//if (typeof this.onLongPress !== 'function') {
//return;
//}
//this.onLongPress();
//},
//true
//);
//}
//} else if (this.isLongPress) {
//if (
//typeof this.onLongRelease === 'function' &&
//this.onLongRelease.length === 0
//) {
//this.onLongRelease();
//}
//} else {
//if (this.longPressTimer !== 0) {
//engine.stopTimer(this.longPressTimer);
//this.longPressTimer = 0;
//}
//if (
//typeof this.onShortRelease === 'function' &&
//this.onShortRelease.length === 0
//) {
//this.onShortRelease();
//}
//}
//}
