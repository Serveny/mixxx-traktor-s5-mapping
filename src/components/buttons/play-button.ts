import type { HIDReportHodler } from '../../hid-report';
import { settings } from '../../settings';
import type { Btn } from '../../types/mapping';
import { Button } from './button';

export class PlayButton extends Button {
  constructor(group: string, reports: HIDReportHodler, io: Btn) {
    super({
      group,
      inKey: 'play',
      outKey: 'play_indicator',
      reports,
      io,
    });

    // Prevent accidental ejection/duplication accident
    this.longPressTimeOutMillis = 800;

    if (settings.inactiveLightsAlwaysBacklit)
      this.output = this.uncoloredOutput;
  }

  onShortPress() {
    script.toggleControl(this.group, this.inKey);
  }

  onLongPress() {
    if (this.isShifted) {
      engine.setValue(this.group, this.inKey, 0);
      script.triggerControl(this.group, 'eject', 0);
    } else if (!engine.getValue(this.group, this.inKey)) {
      script.triggerControl(this.group, 'CloneFromDeck', 0);
    }
  }
}
