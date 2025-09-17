import type { HIDReportHodler } from '../../hid-report';
import type { BytePosInOut } from '../../types/mapping';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';
import { PushButton } from './button';

export class BrowserBackButton extends PushButton<MixxxChannelGroup> {
  constructor(
    group: MixxxChannelGroup,
    reports: HIDReportHodler,
    io: BytePosInOut
  ) {
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
