import { settings } from '../../settings';
import type { Btn } from '../../types/mapping';
import type { S5Deck } from '../s5-deck';
import { Button } from './button';

export class DeckButton extends Button {
  constructor(private deck: S5Deck, io: Btn) {
    super({
      group: deck.group,
      inKey: '',
      outKey: '',
      reports: deck.reports,
      io,
    });
  }

  input(value: number) {
    if (value) {
      this.deck.toggleDeck();
      this.outReport.data[this.io.outByte] =
        this.deck.colors[0] + this.brightnessOn;
      // turn off the other deck selection button's LED
      this.outReport.data[this.io.outByte + 1] =
        settings.deckSelectAlwaysBacklit
          ? this.deck.colors[1] + this.brightnessOff
          : 0;
      this.outReport.send();
    }
  }
}
