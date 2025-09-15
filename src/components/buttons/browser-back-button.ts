import type { HIDReportHodler } from '../../hid-report';
import type { BytePosInOut } from '../../types/mapping';
import { PushButton } from './button';

export class BrowserBackButton extends PushButton {
  constructor(group: string, reports: HIDReportHodler, io: BytePosInOut) {
    const key = 'browse_back';
    super({
      group,
      inKey: key,
      outKey: key,
      reports,
      io,
    });
  }
}
