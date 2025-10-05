import { debug } from '../../tools';
import type {
  ControlInOutOptions,
  ControlOutOptions,
} from '../../types/component';
import type { BytePosInOut } from '../../types/mapping';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';
import {
  ControlComponent,
  ControlInMixin,
  ControlOutMixin,
  RgbOutMixin,
  ShiftMixin,
} from '../component';
import type { S5Deck } from '../s5-deck';

/*
 * Represent a pad button that interact with a hotcue (set, activate or clear)
 */
export class PadButton extends RgbOutMixin(
  ShiftMixin(
    ControlInMixin(
      ControlOutMixin(
        ControlComponent<
          MixxxChannelGroup,
          ControlInOutOptions<MixxxChannelGroup>
        >
      )
    )
  )
) {
  colorComp: ColorComponent;

  constructor(public number: number, public deck: S5Deck, io: BytePosInOut) {
    super({
      group: deck.group,
      inKey: `hotcue_${number}_activate`,
      outKey: `hotcue_${number}_status`,
      reports: deck.reports,
      io,
    });
    if (number < 1 || number > 32) {
      throw Error(
        'HotcueButton must have a number property of an integer between 1 and 32'
      );
    }

    this.colorComp = new ColorComponent(this);
    this.output(0);
  }

  unshift() {
    this.inKey = `hotcue_${this.number}_activate`;
  }

  shift() {
    this.inKey = `hotcue_${this.number}_clear`;
  }

  input(pressed: number) {
    this.colorComp.colorOutput(pressed !== 0);
    if (!pressed) return;
    engine.setValue(this.group, 'scratch2_enable', 0);
    engine.setValue(this.group, this.inKey, 1);
  }

  output(isActive: number) {
    const offOnMulit = isActive ? 1 : 0.1;
    const rgbNumber = engine.getValue(
      this.group,
      `hotcue_${this.number}_color`
    );
    const r = ((rgbNumber >> 16) & 0xff) * offOnMulit;
    const g = (rgbNumber >> 8) & (0xff * offOnMulit);
    const b = rgbNumber & (0xff * offOnMulit);
    debug('COLOR', rgbNumber, r, g, b);
    this.outputRgb(r, g, b);
  }
}

class ColorComponent extends RgbOutMixin(
  ControlOutMixin(
    ControlComponent<MixxxChannelGroup, ControlOutOptions<MixxxChannelGroup>>
  )
) {
  color = 0;

  constructor(padBtn: PadButton) {
    super({
      group: padBtn.group,
      outKey: `hotcue_${padBtn.number}_color`,
      reports: padBtn.deck.reports,
      io: padBtn.io,
    });
  }

  output(rgbNumber: number) {
    this.color = rgbNumber;
    this.colorOutput(false);
  }

  colorOutput(isPressed: boolean) {
    const offOnMulit = isPressed ? 1 : 0.1;
    const r = ((this.color >> 16) & 0xff) * offOnMulit;
    const g = ((this.color >> 8) & 0xff) * offOnMulit;
    const b = (this.color & 0xff) * offOnMulit;
    this.outputRgb(r, g, b);
  }
}
