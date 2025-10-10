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
  constructor(private deck: S5Deck, io: EncoderMapping) {
    super('[Library]', 'MoveFocus', deck.reports, io);
  }

  onChange(isRight: boolean) {
    engine.setValue('[Library]', isRight ? 'MoveDown' : 'MoveUp', 1);

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
    this.deck.display.isPlaylistSelected = focused === 3;

    if (
      !pressed ||
      this.deck.display.isPlaylistSelected ||
      focused === 2 ||
      !settings.autoOpenBrowserOnTouch
    )
      return;
    engine.setValue('[Library]', 'focused_widget', 3);
  }

  onPress(pressed: number): void {
    if (!pressed) return;

    const isFocusTrackTable =
      engine.getValue('[Library]', 'focused_widget') === 3;

    this.deck.display.setPlaylistStatus(isFocusTrackTable);

    // -- 🚜 S5 Docs 2.1.2
    // "Press the BROWSE encoder to load a track"
    if (this.deck.display.isPlaylistSelected) {
      engine.setValue(this.deck.group, 'LoadSelectedTrack', 1);

      // -- 🚜 S5 Docs 2.7
      // "On a Track Deck in HOTCUE mode, pad 1 always represents the Start Cue Point that will be assigned automatically as soon as a track is loaded."
      if (engine.getValue(this.deck.group, 'hotcue_1_status') === 0)
        engine.setValue(this.deck.group, 'hotcue_1_activate', 1);
      this.deck.display.setPlaylistStatus(false);
    }

    // -- 🚜 S5 Docs 2.1.2
    // "Press the BROWSE encoder to open a folder."
    else {
      engine.setValue('[Library]', 'focused_widget', 3);
      this.deck.display.setPlaylistStatus(true);
      // engine.setValue('[Playlist]', 'SelectPlaylist', 1);
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
