import { settings } from '../../settings';
import { TouchEncoder } from './encoder';
import type { S5Deck } from '../s5-deck';
import type { TouchEncoder as EncoderMapping } from '../../types/mapping';

export class BrowserEncoder extends TouchEncoder<'[Library]'> {
  libraryPlayButtonPressed = false;
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

  onTouch(): void {
    // TODO
  }

  onPress(pressed: number): void {
    if (!pressed) return;

    this.isPlaylistSelected =
      engine.getValue('[Library]', 'focused_widget') === 3;

    if (this.isPlaylistSelected)
      engine.setValue(this.deck.group, 'LoadSelectedTrack', 1);
    else {
      // engine.setValue('[Playlist]', 'SelectPlaylist', 1);
      engine.setValue('[Library]', 'focused_widget', 3);
      this.isPlaylistSelected = true;
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
}
