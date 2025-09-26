import type { HIDReportHodler } from '../../hid-report';
import type { Btn as ButtonMapping } from '../../types/mapping';
import { settings } from '../../settings';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';
import {
  GroupComponent,
  ControlInMixin,
  ControlOutMixin,
  IndicatorMixin,
  LongPressMixin,
  SetInOutKeyMixin,
  ShiftMixin,
} from '../component';
import type { S5Deck } from '../s5-deck';

export class SyncButton extends IndicatorMixin(
  SetInOutKeyMixin(
    LongPressMixin(ShiftMixin(ControlInMixin(ControlOutMixin(GroupComponent))))
  )
) {
  constructor(deck: S5Deck, reports: HIDReportHodler, io: ButtonMapping) {
    const key = 'sync_enabled';
    super({
      group: deck.group,
      inKey: key,
      outKey: key,
      reports,
      io,
    });
  }
  onLongPress() {
    if (this.isShifted) {
      engine.setValue(this.group, 'sync_key', 1);
      engine.setValue(this.group, 'sync_key', 0);
    } else {
      script.triggerControl(this.group, 'beatsync_tempo', 50);
    }
  }

  onShortRelease() {
    script.toggleControl(this.group, this.inKey);
    if (!this.isShifted) {
      engine.softTakeover(this.group, 'rate', true);
    }
  }

  onShift() {
    if (settings.useKeylockOnMaster) this.setKey('keylock');
  }

  onUnshift() {
    if (settings.useKeylockOnMaster) this.setKey('sync_enabled');
  }
}
