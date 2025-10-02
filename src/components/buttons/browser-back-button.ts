import type { HIDReportHodler } from '../../hid-report';
import type { BytePosInOut } from '../../types/mapping';
import type { BrowserEncoder } from '../encoders/browser-encoder';
import { PushButton } from './button';

export class BrowserBackButton extends PushButton {
  constructor(
    reports: HIDReportHodler,
    private browserEncoder: BrowserEncoder,
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

  // -- 🚜 S5 Docs 2.1.2
  input(pressed: number): void {
    if (!pressed) return;
    this.browserEncoder.setPlaylistStatus(
      engine.getValue('[Library]', 'focused_widget') === 3
    );
    if (this.browserEncoder.isPlaylistSelected) {
      engine.setValue('[Library]', 'focused_widget', 2);
    } else {
      engine.setValue('[Library]', 'MoveLeft', 1);
    }
    this.browserEncoder.setPlaylistStatus(
      !this.browserEncoder.isPlaylistSelected
    );

    // const currentWidget = engine.getValue('[Library]', 'focused_widget');
    //console.log('Back button', pressed, currentWidget);

    //if (currentWidget === 2) engine.setValue('[Library]', 'MoveLeft', 1);
    //else engine.setValue('[Library]', 'focused_widget', 2);
    //console.log('FOCUS: ', engine.getValue('[Library]', 'focused_widget'));
  }
}
