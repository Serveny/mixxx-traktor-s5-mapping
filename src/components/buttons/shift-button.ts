import { settings } from '../../settings';
import type { Btn } from '../../types/mapping';
import type { S5Deck } from '../s5-deck';
import { PushButton } from './button';

export class ShiftButton extends PushButton {
  constructor(private deck: S5Deck, io: Btn) {
    super({
      reports: deck.reports,
      io,
    });

    if (!settings.inactiveLightsAlwaysBacklit)
      this.output = this.uncoloredOutput;
  }

  unshift() {
    this.output(0);
  }

  shift() {
    this.output(1);
  }

  input(pressed: number) {
    if (pressed) {
      this.deck.shift();
    } else {
      this.deck.unshift();
    }
  }
}
