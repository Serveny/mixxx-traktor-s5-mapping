import type { HIDReportHodler } from '../../hid-report';
import { settings } from '../../settings';
import type { Btn } from '../../types/mapping';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';
import {
  LongPressMixin,
  ShiftMixin,
  GroupComponent,
  GroupInMixin,
  GroupOutMixin,
  IndicatorMixin,
} from '../component';

export class PlayButton extends IndicatorMixin(
  LongPressMixin(ShiftMixin(GroupOutMixin(GroupInMixin(GroupComponent))))
) {
  constructor(group: MixxxChannelGroup, reports: HIDReportHodler, io: Btn) {
    super({
      group,
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
