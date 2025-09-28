import type { HIDReportHodler } from '../../hid-report';
import type { Btn } from '../../types/mapping';
import {
  LongPressMixin,
  ShiftMixin,
  ControlComponent,
  ControlInMixin,
  ControlOutMixin,
  SingleColorOutMixin,
} from '../component';
import type { S5Deck } from '../s5-deck';

export class PlayButton extends SingleColorOutMixin(
  LongPressMixin(ShiftMixin(ControlOutMixin(ControlInMixin(ControlComponent))))
) {
  constructor(deck: S5Deck, reports: HIDReportHodler, io: Btn) {
    super({
      group: deck.group,
      inKey: 'play',
      outKey: 'play_indicator',
      reports,
      io,
    });

    // Prevent accidental ejection/duplication accident
    this.longPressTimeOutMillis = 800;
  }

  onShortPress() {
    script.toggleControl(this.group, this.inKey);
  }

  onLongPress() {
    if (this.isShifted) {
      engine.setValue(this.group, this.inKey, 0);
      script.triggerControl(this.group, 'eject', 50);
    } else if (!engine.getValue(this.group, this.inKey)) {
      script.triggerControl(this.group, 'CloneFromDeck', 50);
    }
  }
}
