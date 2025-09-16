import { Button } from './button';
import type { Btn as ButtonMapping } from '../../types/mapping';
import type { S5Deck } from '../s5-deck';

export class PerformanceRightButton extends Button {
  constructor(private deck: S5Deck, io: ButtonMapping) {
    super({
      group: '[PreviewDeck1]',
      inKey: 'performance_right',
      outKey: 'play',
      reports: deck.reports,
      io,
    });
  }

  input(pressed: number) {
    if (pressed) {
      script.triggerControl(this.group, 'LoadSelectedTrackAndPlay', 0);
    } else {
      engine.setValue(this.group, 'play', 0);
      script.triggerControl(this.group, 'eject', 0);
    }

    this.deck.browserEncoder.libraryPlayButtonPressed = pressed > 0;
  }
}
