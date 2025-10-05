import { ButtonBrightnessOff, ButtonBrightnessOn } from '../../settings';
import { debug } from '../../tools';
import type { ControlInOutOptions } from '../../types/component';
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
  constructor(private number: number, deck: S5Deck, io: BytePosInOut) {
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
    this.output(0);
  }

  unshift() {
    this.inKey = `hotcue_${this.number}_activate`;
  }

  shift() {
    this.inKey = `hotcue_${this.number}_clear`;
  }

  input(pressed: number) {
    if (!pressed) return;
    engine.setValue(this.group, 'scratch2_enable', 0);
    debug('INKEY', this.inKey);
    engine.setValue(this.group, this.inKey, 1);
  }

  output(value: number) {
    const colorVal = value ? ButtonBrightnessOn : ButtonBrightnessOff;
    this.outputRgb(colorVal, colorVal, colorVal);
  }
}
