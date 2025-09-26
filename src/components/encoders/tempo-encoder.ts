import { Encoder } from './encoder';
import type { Encoder as EncoderMapping } from '../../types/mapping';
import type {
  MixxxChannelControl,
  MixxxChannelGroup,
} from '../../types/mixxx-controls';
import type { HIDReportHodler } from '../../hid-report';

export class TempoEncoder extends Encoder<MixxxChannelGroup> {
  private channels: MixxxChannelGroup[] = [
    `[Channel1]`,
    `[Channel2]`,
    `[Channel3]`,
    `[Channel4]`,
  ];
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
    for (const group of this.channels)
      script.triggerControl(group, control, 20);
  }
}
