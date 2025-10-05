import type { HIDReportHodler } from '../../hid-report';
import type { BytePosInOut } from '../../types/mapping';
import type { DisplayArea } from '../display-area';
import { PushButton } from './button';

export class BrowserBackButton extends PushButton {
  constructor(
    private display: DisplayArea,
    reports: HIDReportHodler,
    io: BytePosInOut
  ) {
    const key = 'show_maximized_library';
    super({
      group: '[Skin]',
      inKey: key,
      outKey: key,
      reports,
      io,
    });
  }

  input(pressed: number): void {
    if (!pressed) return;
    const isFocusTrackTable =
      engine.getValue('[Library]', 'focused_widget') === 3;

    this.display.setPlaylistStatus(isFocusTrackTable);

    if (this.display.isPlaylistSelected) {
      engine.setValue('[Library]', 'focused_widget', 2);
    } else {
      engine.setValue('[Library]', 'MoveLeft', 1);
    }

    // -- 🚜 S5 Docs 2.1.2
    // "Press the BACK button to exit the Browser"
    this.display.togglePlaylistStatus();

    // const currentWidget = engine.getValue('[Library]', 'focused_widget');
    //console.log('Back button', pressed, currentWidget);

    //if (currentWidget === 2) engine.setValue('[Library]', 'MoveLeft', 1);
    //else engine.setValue('[Library]', 'focused_widget', 2);
    //console.log('FOCUS: ', engine.getValue('[Library]', 'focused_widget'));
  }
}
