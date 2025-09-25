import type { ButtonOptions } from '../../types/component';
import type { MixxxGroup, MixxxKey } from '../../types/mixxx-controls';
import {
  GroupComponentInMixin,
  GroupComponentOutMixin,
  ComponentShiftMixin,
  GroupComponent,
} from '../component';

export class Button<TGroup extends MixxxGroup> extends ComponentShiftMixin(
  GroupComponentInMixin(GroupComponentOutMixin(GroupComponent))
) {
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
    this.send(value * 127);
  }

  output(value: number) {
    if (this.indicatorTimer !== 0) return;
    this.send(value * 127);
  }

  indicatorCallback() {
    this.indicatorState = !this.indicatorState;
    this.send(this.indicatorState ? 127 : 0);
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
