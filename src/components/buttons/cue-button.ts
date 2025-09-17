import { moveModes } from '../../settings';
import type { BytePosInOut } from '../../types/mapping';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';
import type { S5Deck } from '../s5-deck';
import { PushButton } from './button';

export class CueButton extends PushButton<MixxxChannelGroup> {
  constructor(private deck: S5Deck, io: BytePosInOut) {
    super({
      group: deck.group,
      inKey: 'cue_default',
      outKey: 'cue_indicator',
      reports: deck.reports,
      io,
    });
  }

  unshift() {
    this.inKey = 'cue_default';
  }

  shift() {
    this.inKey = 'start_stop';
  }

  input(pressed: number) {
    if (
      this.deck.moveMode === moveModes.keyboard &&
      !this.deck.keyboardPlayMode
    ) {
      // this.deck.assignKeyboardPlayMode(this.group, this.inKey);
    } else {
      engine.setValue(this.group, this.inKey, pressed);
    }
  }
}
