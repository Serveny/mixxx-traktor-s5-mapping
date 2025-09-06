import type { Deck } from '../deck';
import { PushButton } from './button';

export class CueButton extends PushButton {
  deck!: Deck;
  constructor(options: Partial<CueButton>) {
    super(options);
    this.outKey = 'cue_indicator';
    this.outConnect();
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
      this.deck.assignKeyboardPlayMode(this.group, this.inKey);
    } else {
      engine.setValue(this.group, this.inKey, pressed);
    }
  }
}
