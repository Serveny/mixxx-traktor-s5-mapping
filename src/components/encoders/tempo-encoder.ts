import { Encoder } from './encoder';
import type { Encoder as EncoderMapping } from '../../types/mapping';
import type {
  MixxxChannelControl,
  MixxxChannelGroup,
} from '../../types/mixxx-controls';
import type { HIDReportHodler } from '../../hid-report';
import { channels } from '../../settings';

export class TempoEncoder extends Encoder<MixxxChannelGroup> {
  constructor(reports: HIDReportHodler, io: EncoderMapping) {
    super('[Channel1]', 'rate_perm_down', reports, io);
  }
  onChange(isRight: boolean) {
    if (this.isShifted)
      this.triggerAllChannels(isRight ? 'rate_perm_up' : 'rate_perm_down');
    else
      this.triggerAllChannels(
        isRight ? 'rate_perm_up_small' : 'rate_perm_down_small'
      );
  }
  onPress(): void {
    // TODO
  }

  private triggerAllChannels(control: MixxxChannelControl) {
    for (const channel of channels) script.triggerControl(channel, control, 50);
  }
}
