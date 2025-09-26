import { Encoder, TouchEncoder } from './encoder';
import type { TouchEncoder as EncoderMapping } from '../../types/mapping';
import { S5Deck } from '../s5-deck';
import { settings, wheelModes } from '../../settings';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';

export class loopEncoder extends TouchEncoder<MixxxChannelGroup> {
  constructor(private deck: S5Deck, io: EncoderMapping) {
    super(deck.group, 'loop_in', deck.reports, io);
  }

  onChange(isRight: boolean) {
    if (
      this.deck.wheelMode === wheelModes.loopIn ||
      this.deck.wheelMode === wheelModes.loopOut
    ) {
      const moveFactor = this.isShifted
        ? settings.loopEncoderShiftMoveFactor
        : settings.loopEncoderMoveFactor;
      const loopStartPos = engine.getValue(this.group, 'loop_start_position');
      const valueIn =
        loopStartPos + (isRight ? (moveFactor as number) : -moveFactor);
      const loopEndPos = engine.getValue(this.group, 'loop_end_position');
      const valueOut =
        loopEndPos + (isRight ? (moveFactor as number) : -moveFactor);
      engine.setValue(this.group, 'loop_start_position', valueIn);
      engine.setValue(this.group, 'loop_end_position', valueOut);
    } else if (this.isShifted) {
      script.triggerControl(
        this.group,
        isRight ? 'loop_move_1_forward' : 'loop_move_1_backward',
        50
      );
    } else {
      script.triggerControl(
        this.group,
        isRight ? 'loop_double' : 'loop_halve',
        50
      );
    }
  }

  onTouch(): void {
    // TODO
  }

  // originally onShortPress
  onPress(pressed: number): void {
    if (!pressed) {
      return;
    }
    // const loopEnabled = engine.getValue(this.group, 'loop_enabled');
    if (!this.isShifted) {
      script.triggerControl(this.group, 'beatloop_activate', 50);
    } else {
      script.triggerControl(this.group, 'reloop_toggle', 50);
    }
  }

  // FIXME not supported, feature request
  // onLongPress: function(){
  //     script.triggerControl("[Library]", "search_related_track", engine.getValue("[Library]", "sort_column"));
  // }
}
