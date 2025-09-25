import type { HIDReportHodler } from '../../hid-report';
import type { BytePosInOut } from '../../types/mapping';
import { PushButton } from './button';

export class BrowserBackButton extends PushButton {
  constructor(reports: HIDReportHodler, io: BytePosInOut) {
    const key = 'show_maximized_library';
    super({
      group: '[Skin]',
      inKey: key,
      outKey: key,
      reports,
      io,
    });
  }
}
