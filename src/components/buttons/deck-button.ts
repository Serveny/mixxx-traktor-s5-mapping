import type { Btn } from '../../types/mapping';
import { Component, InMixin, OutMixin } from '../component';
import type { S5Deck } from '../s5-deck';

export class DeckButton extends OutMixin(InMixin(Component)) {
  constructor(private deck: S5Deck, io: Btn) {
    super({
      reports: deck.reports,
      io,
    });
    this.output();
  }

  input(value: number) {
    if (value) this.deck.toggleDeck();
    this.output();
  }

  // -- 🚜 S5 Docs 2.5:
  // "If Deck A,B is focused the DECK button will be lit in blue. If Deck C,D is focused, the DECK button be lit in white."
  output() {
    if (this.deck.currentDeckIdx === 0) {
      this.outReport.data[this.io.outByte] = 0;
      this.outReport.data[this.io.outByte + 1] = 127;
    } else {
      this.outReport.data[this.io.outByte] = 127;
      this.outReport.data[this.io.outByte + 1] = 0;
    }
    this.outReport.send();
  }
}
