import { Encoder, TouchEncoder } from './encoder';
import type { TouchEncoder as EncoderMapping } from '../../types/mapping';
import { S5Deck } from '../s5-deck';
import { settings, wheelModes } from '../../settings';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';

export class loopEncoder extends TouchEncoder<MixxxChannelGroup> {
  // -- 🚜 S5 Docs 2.1.5
  // TITLE, ARTIST, BPM, IMPORT DATE, #, and KEY
  sortCategories = [2, 1, 15, 17, 9, 20];
  sortCategoryIdx = 0;

  constructor(private deck: S5Deck, io: EncoderMapping) {
    super(deck.group, 'loop_in', deck.reports, io);
  }

  onChange(isRight: boolean) {
    if (this.deck.display.perfModeLeftButton.isSorting)
      this.switchSortCategory(isRight);
    if (this.deck.browserEncoder.isPlaylistSelected) {
      this.browsePreviewTrack(isRight);
    } else if (
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

  // -- 🚜 S5 Docs 2.1.4
  private browsePreviewTrack(isRight: boolean) {
    engine.setValue('[PreviewDeck1]', 'beatjump', isRight ? 16 : -16);
  }

  // -- 🚜 S5 Docs 2.1.5
  private switchSortCategory(isRight: boolean) {
    this.sortCategoryIdx = Math.abs(
      (isRight ? this.sortCategoryIdx + 1 : this.sortCategoryIdx - 1) %
        this.sortCategories.length
    );
    engine.setValue(
      '[Library]',
      'sort_column',
      this.sortCategories[this.sortCategoryIdx]
    );
  }

  onTouch(): void {
    // TODO
  }

  // originally onShortPress
  onPress(pressed: number): void {
    if (!pressed) {
      return;
    }
    if (this.deck.browserEncoder.isPlaylistSelected) this.previewTrack();
    else if (!this.isShifted) {
      script.triggerControl(this.group, 'beatloop_activate', 50);
    } else {
      script.triggerControl(this.group, 'reloop_toggle', 50);
    }
  }

  // -- 🚜 S5 Docs 2.1.4
  private previewTrack() {
    // TODO: Check original behavior in Traktor Pro
    const isPlaying = engine.getValue('[PreviewDeck1]', 'play');
    script.triggerControl(
      '[PreviewDeck1]',
      isPlaying ? 'stop' : 'LoadSelectedTrackAndPlay',
      50
    );
  }
}
