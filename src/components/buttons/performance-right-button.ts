import { Button } from './button';
import type { Btn as ButtonMapping } from '../../types/mapping';
import type { S5Deck } from '../s5-deck';

export class PerformanceRightButton extends Button {
  constructor(private deck: S5Deck, io: ButtonMapping) {
    super({
      group: '[PreviewDeck1]',
      inKey: 'play',
      outKey: 'play_indicator',
      reports: deck.reports,
      io,
    });
  }

  input(pressed: number) {
    if (pressed) {
      script.triggerControl(this.group, 'LoadSelectedTrackAndPlay', 50);
    } else {
      engine.setValue(this.group, 'play', 0);
      script.triggerControl(this.group, 'eject', 50);
    }

    this.deck.browserEncoder.libraryPlayButtonPressed = pressed > 0;
  }
}
