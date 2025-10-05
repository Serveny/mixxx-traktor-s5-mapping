import type { S5DisplayArea as DisplayAreaMapping } from '../types/mapping';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import { PushButton, ToggleButton } from './buttons/button';
import { PerformanceLeftButton } from './buttons/performance-left-button';
import { PerformanceRightButton } from './buttons/performance-right-button';
import { createCompContainer } from './component-container';
import type { S5Deck } from './s5-deck';

export class DisplayArea extends createCompContainer<MixxxChannelGroup>() {
  // settingsButton: PushButton;
  displayButton1: PushButton;
  // displayButton2: PushButton;
  perfModeLeftButton: PerformanceLeftButton;
  viewButton: ToggleButton;
  // displayButton3: PushButton;
  // displayButton4: PushButton;
  perfModeRightButton: PerformanceRightButton;

  // Runtime variables
  isPlaylistSelected = false;
  isSorting = false;

  constructor(deck: S5Deck, io: DisplayAreaMapping) {
    super(deck.group);

    this.displayButton1 = new PushButton({
      group: this.group,
      inKey: 'beats_translate_curpos',
      outKey: 'beats_translate_curpos',
      reports: deck.reports,
      io: io.display1,
    });

    this.perfModeLeftButton = new PerformanceLeftButton(
      this,
      deck.reports,
      io.performanceModeLeft
    );

    // -- 🚜 S5 Docs 2.1.2
    // "Press the VIEW button. The display will return to Track view."
    this.viewButton = new ToggleButton({
      group: '[Skin]',
      inKey: 'show_maximized_library',
      outKey: 'show_maximized_library',
      reports: deck.reports,
      io: io.view,
    });

    this.perfModeRightButton = new PerformanceRightButton(
      deck,
      io.performanceModeRight
    );

    this.triggerComponents();
  }

  setPlaylistStatus(isActive: boolean) {
    if (!isActive) {
      this.isSorting = false;
      this.perfModeLeftButton.output(0);
      engine.setValue('[Skin]', 'show_maximized_library', 0);
    }
    this.isPlaylistSelected = isActive;
  }

  togglePlaylistStatus() {
    this.setPlaylistStatus(!this.isPlaylistSelected);
  }
}
