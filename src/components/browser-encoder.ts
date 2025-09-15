import { moveModes } from '../settings';
import { Encoder } from './encoder';
import type { S5Deck } from './s5-deck';
import type { Encoder as EncoderMapping } from '../types/mapping';

export class BrowserEncoder extends Encoder {
  constructor(private deck: S5Deck, io: EncoderMapping) {
    super(deck.group, 'browser_encoder', deck.reports, io);
  }

  onChange(right: boolean) {
    switch (this.deck.moveMode) {
      case moveModes.grid:
        script.triggerControl(
          this.group,
          right ? 'beats_adjust_faster' : 'beats_adjust_slower',
          0
        );
        break;
      case moveModes.keyboard:
      //if (this.deck.keyboard[0].offset === (right ? 16 : 0)) {
      //return;
      //}
      //this.deck.keyboardOffset += right ? 1 : -1;
      //this.deck.keyboard.forEach(function (pad) {
      //pad.outTrigger();
      //});
      //break;
      case moveModes.bpm:
        script.triggerControl(
          this.group,
          right ? 'beats_translate_later' : 'beats_translate_earlier',
          0
        );
        break;
      default:
        if (!this.isShifted) {
          if (!this.isPressed) {
            if (right) {
              script.triggerControl(this.group, 'beatjump_forward', 0);
            } else {
              script.triggerControl(this.group, 'beatjump_backward', 0);
            }
          } else {
            let beatjumpSize = engine.getValue(this.group, 'beatjump_size');
            if (right) {
              beatjumpSize *= 2;
            } else {
              beatjumpSize /= 2;
            }
            engine.setValue(this.group, 'beatjump_size', beatjumpSize);
          }
        } else {
          if (right) {
            script.triggerControl(this.group, 'pitch_up_small', 0);
          } else {
            script.triggerControl(this.group, 'pitch_down_small', 0);
          }
        }
        break;
    }
  }
}
