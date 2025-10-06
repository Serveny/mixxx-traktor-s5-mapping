import type { HIDReportHodler } from '../../hid-report';
import type { Btn } from '../../types/mapping';
import {
  ShiftMixin,
  ControlComponent,
  ControlInMixin,
  ControlOutMixin,
  SingleColorOutMixin,
} from '../component';
import type { S5Deck } from '../s5-deck';

export class PlayButton extends SingleColorOutMixin(
  ShiftMixin(ControlOutMixin(ControlInMixin(ControlComponent)))
) {
  constructor(deck: S5Deck, reports: HIDReportHodler, io: Btn) {
    super({
      group: deck.group,
      inKey: 'play',
      outKey: 'play_indicator',
      reports,
      io,
    });
  }

  input(pressed: number) {
    if (!pressed) return;
    script.toggleControl(this.group, this.inKey);
    if (this.isShifted) {
      engine.setValue(this.group, this.inKey, 0);
      script.triggerControl(this.group, 'eject', 50);
    }
  }
}
