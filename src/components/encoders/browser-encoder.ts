import { settings } from '../../settings';
import { TouchEncoder } from './encoder';
import type { S5Deck } from '../s5-deck';
import type { TouchEncoder as EncoderMapping } from '../../types/mapping';

export class BrowserEncoder extends TouchEncoder<'[Library]'> {
  isPressedPreviewButton = false;
  gridButtonPressed = false;
  starButtonPressed = false;
  libraryViewButtonPressed = false;
  libraryPlaylistButtonPressed = false;
  currentSortedColumnIdx = -1;
  isPlaylistSelected = false;
  constructor(private deck: S5Deck, io: EncoderMapping) {
    super('[Library]', 'MoveFocus', deck.reports, io);
  }

  onChange(isRight: boolean) {
    const focusedWidget = engine.getValue('[Library]', 'focused_widget');

    if (this.isPlaylistSelected) {
      engine.setValue(
        '[Playlist]',
        isRight ? 'SelectNextTrack' : 'SelectPrevTrack',
        1
      );
    } else engine.setValue('[Library]', isRight ? 'MoveDown' : 'MoveUp', 1);
    //if (this.libraryViewButtonPressed) {
    //this.currentSortedColumnIdx =
    //(settings.librarySortableColumns.length +
    //this.currentSortedColumnIdx +
    //(isRight ? 1 : -1)) %
    //settings.librarySortableColumns.length;
    //engine.setValue(
    //'[Library]',
    //'sort_column',
    //settings.librarySortableColumns()[this.currentSortedColumnIdx]
    //);
    //} else if (this.gridButtonPressed) {
    //script.triggerControl(
    //this.group,
    //isRight ? 'waveform_zoom_up' : 'waveform_zoom_down',
    //50
    //);
    //} else if (this.libraryPlayButtonPressed) {
    //script.triggerControl(
    //'[PreviewDeck1]',
    //isRight ? 'beatjump_16_forward' : 'beatjump_16_backward',
    //50
    //);
    //} else {
    //// FIXME there is a bug where this action has no effect when the Mixxx window has no focused. https://github.com/mixxxdj/mixxx/issues/11285
    //// As a workaround, we are using deprecated control, hoping the bug will be fixed before the controls get removed
    //const currentlyFocusWidget = engine.getValue(
    //'[Library]',
    //'focused_widget'
    //);
    //if (currentlyFocusWidget === 0) {
    //if (this.isShifted) {
    //script.triggerControl(
    //'[Playlist]',
    //isRight ? 'SelectNextPlaylist' : 'SelectPrevPlaylist',
    //50
    //);
    //} else {
    //script.triggerControl(
    //'[Playlist]',
    //isRight ? 'SelectNextTrack' : 'SelectPrevTrack',
    //50
    //);
    //}
    //} else {
    //engine.setValue('[Library]', 'focused_widget', this.isShifted ? 2 : 3);
    //engine.setValue('[Library]', 'MoveVertical', isRight ? 1 : -1);
    //}
    //}
  }

  onTouch(pressed: number): void {
    const focused = engine.getValue('[Library]', 'focused_widget');
    this.isPlaylistSelected = focused === 3;

    if (
      !pressed ||
      this.isPlaylistSelected ||
      focused === 2 ||
      !settings.autoOpenBrowserOnTouch
    )
      return;
    engine.setValue('[Library]', 'focused_widget', 3);
  }

  // -- 🚜 S5 Docs 2.1.2
  onPress(pressed: number): void {
    if (!pressed) return;

    this.setPlaylistStatus(
      engine.getValue('[Library]', 'focused_widget') === 3
    );

    if (this.isPlaylistSelected) {
      engine.setValue(this.deck.group, 'LoadSelectedTrack', 1);
      this.setPlaylistStatus(false);
    } else {
      // engine.setValue('[Playlist]', 'SelectPlaylist', 1);
      engine.setValue('[Library]', 'focused_widget', 3);
      this.setPlaylistStatus(true);
    }

    //const currentlyFocusWidget = engine.getValue('[Library]', 'focused_widget');

    //if (currentlyFocusWidget === 2)
    //engine.setValue('[Library]', 'focused_widget', 3);
    //else if (currentlyFocusWidget === 3)
    //engine.setValue(this.deck.group, 'LoadSelectedTrack', 50);
    //else engine.setValue('[Library]', 'focused_widget', 2);

    // 3 == Tracks table or root views of library features
    //if (this.isShifted && currentlyFocusWidget === 0) {
    //script.triggerControl('[Playlist]', 'ToggleSelectedSidebarItem', 50);
    //} else if (currentlyFocusWidget === 3 || currentlyFocusWidget === 0) {
    //script.triggerControl(this.deck.group, 'LoadSelectedTrack', 50);
    //} else {
    //script.triggerControl('[Library]', 'GoToItem', 50);
    //}
  }

  setPlaylistStatus(isActive: boolean) {
    if (!isActive) {
      this.deck.display.perfModeLeftButton.isSorting = false;
      this.deck.display.perfModeLeftButton.output(0);
      engine.setValue('[Skin]', 'show_maximized_library', 0);
    }
    this.isPlaylistSelected = isActive;
  }
}
