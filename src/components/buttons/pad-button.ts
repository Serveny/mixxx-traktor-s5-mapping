import { RgbColor } from '../../color';
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
  declare group: MixxxChannelGroup;
  declare inKey: MixxxControls.CtrlRW<MixxxChannelGroup>;
  declare outKey: MixxxControls.Ctrl<MixxxChannelGroup>;

  colorComp: ColorComponent;
  isActive = false;
  isPressed = false;

  constructor(
    public number: number,
    public deck: S5Deck,
    io: BytePosInOut
  ) {
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

    this.colorComp = new ColorComponent(
      number === 1 ? RgbColor.white() : RgbColor.blue(),
      this
    );
    this.output(0);
  }

  unshift() {
    this.inKey = `hotcue_${this.number}_activate`;
  }

  shift() {
    this.inKey = `hotcue_${this.number}_clear`;
  }

  input(pressed: number) {
    this.isPressed = pressed !== 0;
    this.colorComp.colorOutput(this.isActive, this.isPressed);
    if (!pressed) return;
    engine.setValue(this.group, 'scratch2_enable', 0);
    engine.setValue(this.group, this.inKey, 1);
  }

  output(isActive: number) {
    this.isActive = isActive !== 0;
    this.colorComp.colorOutput(this.isActive, this.isPressed);
  }
}

class ColorComponent extends RgbOutMixin(
  ControlOutMixin(
    ControlComponent<MixxxChannelGroup, ControlOutOptions<MixxxChannelGroup>>
  )
) {
  constructor(
    private color: RgbColor,
    private padBtn: PadButton
  ) {
    super({
      group: padBtn.group,
      outKey: `hotcue_${padBtn.number}_color`,
      reports: padBtn.deck.reports,
      io: padBtn.io,
    });
  }

  output(rgbNumber: number) {
    this.color = new RgbColor(rgbNumber);
    this.colorOutput(this.padBtn.isActive, false);
  }

  colorOutput(isActive: boolean, isPressed: boolean) {
    this.outputRgb(this.color.brightness(!isActive ? 0 : isPressed ? 1 : 0.1));
  }
}
