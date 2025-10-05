import type { HIDReportHodler } from '../../hid-report';
import type { Btn as ButtonMapping } from '../../types/mapping';
import { settings } from '../../settings';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';
import {
  ControlComponent,
  LongPressMixin,
  SetInOutKeyMixin,
  ShiftMixin,
  SingleColorOutMixin,
} from '../component';
import type { S5Deck } from '../s5-deck';
import type { ControlInOutOptions } from '../../types/component';

export class SyncButton extends SingleColorOutMixin(
  ShiftMixin(
    LongPressMixin(
      SetInOutKeyMixin(
        ControlComponent<
          MixxxChannelGroup,
          ControlInOutOptions<MixxxChannelGroup>
        >
      )
    )
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

  onShortRelease() {
    script.toggleControl(this.group, this.inKey);
    if (!this.isShifted) {
      engine.softTakeover(this.group, 'rate', true);
    }
  }

  onLongPress() {
    if (this.isShifted) {
      engine.setValue(this.group, 'sync_key', 1);
      engine.setValue(this.group, 'sync_key', 0);
    } else {
      script.toggleControl(this.group, 'sync_enabled');
    }
  }

  onShift() {
    if (settings.useKeylockOnMaster) this.setKey('keylock');
  }

  onUnshift() {
    if (settings.useKeylockOnMaster) this.setKey('sync_enabled');
  }
}
