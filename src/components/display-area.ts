import type { S5DisplayArea as DisplayAreaMapping } from '../types/mapping';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import { PushButton, ToggleButton } from './buttons/button';
import { PerformanceRightButton } from './buttons/performance-right-button';
import { ComponentContainer } from './component-container';
import type { S5Deck } from './s5-deck';

export class DisplayArea extends ComponentContainer<MixxxChannelGroup> {
  // settingsButton: PushButton;
  displayButton1: PushButton;
  // displayButton2: PushButton;
  // perfModeRightLeftButton: PerformanceRightButton;
  viewButton: ToggleButton;
  // displayButton3: PushButton;
  // displayButton4: PushButton;
  perfModeRightButton: PerformanceRightButton;
  constructor(deck: S5Deck, io: DisplayAreaMapping) {
    super(deck.group);

    this.displayButton1 = new PushButton({
      group: deck.group,
      inKey: 'beats_translate_curpos',
      outKey: 'beats_translate_curpos',
      reports: deck.reports,
      io: io.display1,
    });

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
  }
}
