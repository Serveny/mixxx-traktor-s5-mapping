import type { HIDReportHodler } from '../../hid-report';
import type { Btn as ButtonMapping } from '../../types/mapping';
import { settings } from '../../settings';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';
import {
  GroupComponent,
  GroupInMixin,
  GroupOutMixin,
  IndicatorMixin,
  LongPressMixin,
  SetKeyMixin,
  ShiftMixin,
} from '../component';

export class SyncButton extends IndicatorMixin(
  SetKeyMixin(
    LongPressMixin(ShiftMixin(GroupInMixin(GroupOutMixin(GroupComponent))))
  )
) {
  constructor(
    group: MixxxChannelGroup,
    reports: HIDReportHodler,
    io: ButtonMapping
  ) {
    const key = 'sync_enabled';
    super({
      group,
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

  shift() {
    if (settings.useKeylockOnMaster) this.setKey('keylock');
  }

  unshift() {
    if (settings.useKeylockOnMaster) this.setKey('sync_enabled');
  }
}
