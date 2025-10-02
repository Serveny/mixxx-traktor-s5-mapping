import type { Btn as ButtonMapping } from '../../types/mapping';
import type { S5Deck } from '../s5-deck';
import { Component, InMixin, SingleColorOutMixin } from '../component';
import type { ComponentOptions } from '../../types/component';

export class PerformanceLeftButton extends SingleColorOutMixin(
  InMixin(Component<ComponentOptions>)
) {
  isSorting = false;

  constructor(private deck: S5Deck, io: ButtonMapping) {
    super({
      reports: deck.reports,
      io,
    });
  }

  // -- 🚜 S5 Docs 2.1.5
  input(pressed: number) {
    if (!pressed || !this.deck.browserEncoder.isPlaylistSelected) return;
    this.isSorting = !this.isSorting;
    this.output(this.isSorting ? 1 : 0);
  }
}
