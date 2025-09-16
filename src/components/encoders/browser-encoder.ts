import { settings } from '../../settings';
import { Encoder } from './encoder';
import type { S5Deck } from '../s5-deck';
import type { Encoder as EncoderMapping } from '../../types/mapping';

export class BrowserEncoder extends Encoder {
  libraryPlayButtonPressed = false;
  gridButtonPressed = false;
  starButtonPressed = false;
  libraryViewButtonPressed = false;
  libraryPlaylistButtonPressed = false;
  currentSortedColumnIdx = -1;
  constructor(deck: S5Deck, io: EncoderMapping) {
    super(deck.group, 'browser_encoder', deck.reports, io);
  }

  onChange(isRight: boolean) {
    if (this.libraryViewButtonPressed) {
      this.currentSortedColumnIdx =
        (settings.librarySortableColumns.length +
          this.currentSortedColumnIdx +
          (isRight ? 1 : -1)) %
        settings.librarySortableColumns.length;
      engine.setValue(
        '[Library]',
        'sort_column',
        settings.librarySortableColumns()[this.currentSortedColumnIdx]
      );
    } else if (this.starButtonPressed) {
      if (this.isShifted) {
        // FIXME doesn't exist, feature request needed
        script.triggerControl(
          this.group,
          isRight ? 'track_color_prev' : 'track_color_next',
          0
        );
      } else {
        script.triggerControl(
          this.group,
          isRight ? 'stars_up' : 'stars_down',
          0
        );
      }
    } else if (this.gridButtonPressed) {
      script.triggerControl(
        this.group,
        isRight ? 'waveform_zoom_up' : 'waveform_zoom_down',
        0
      );
    } else if (this.libraryPlayButtonPressed) {
      script.triggerControl(
        '[PreviewDeck1]',
        isRight ? 'beatjump_16_forward' : 'beatjump_16_backward',
        0
      );
    } else {
      // FIXME there is a bug where this action has no effect when the Mixxx window has no focused. https://github.com/mixxxdj/mixxx/issues/11285
      // As a workaround, we are using deprecated control, hoping the bug will be fixed before the controls get removed
      const currentlyFocusWidget = engine.getValue(
        '[Library]',
        'focused_widget'
      );
      if (currentlyFocusWidget === 0) {
        if (this.isShifted) {
          script.triggerControl(
            '[Playlist]',
            isRight ? 'SelectNextPlaylist' : 'SelectPrevPlaylist',
            0
          );
        } else {
          script.triggerControl(
            '[Playlist]',
            isRight ? 'SelectNextTrack' : 'SelectPrevTrack',
            0
          );
        }
      } else {
        engine.setValue('[Library]', 'focused_widget', this.isShifted ? 2 : 3);
        engine.setValue('[Library]', 'MoveVertical', isRight ? 1 : -1);
      }
    }
  }

  onTouch(): void {
    // TODO
  }

  onPress(): void {
    if (this.libraryViewButtonPressed) {
      script.toggleControl('[Library]', 'sort_order');
    } else {
      const currentlyFocusWidget = engine.getValue(
        '[Library]',
        'focused_widget'
      );
      // 3 == Tracks table or root views of library features
      if (this.isShifted && currentlyFocusWidget === 0) {
        script.triggerControl('[Playlist]', 'ToggleSelectedSidebarItem', 0);
      } else if (currentlyFocusWidget === 3 || currentlyFocusWidget === 0) {
        script.triggerControl(this.group, 'LoadSelectedTrack', 0);
      } else {
        script.triggerControl('[Library]', 'GoToItem', 0);
      }
    }
  }
}
