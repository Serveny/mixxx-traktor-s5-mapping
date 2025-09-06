import { Button } from './button';

export class PlayButton extends Button {
  constructor(options: Partial<PlayButton>) {
    // Prevent accidental ejection/duplication accident
    options.longPressTimeOutMillis = 800;
    super(options);
    this.inKey = 'play';
    this.outKey = 'play_indicator';
    this.outConnect();
  }
  onShortPress() {
    script.toggleControl(this.group, this.inKey, true);
  }
  onLongPress() {
    if (this.shifted) {
      engine.setValue(this.group, this.inKey, false);
      script.triggerControl(this.group, 'eject');
    } else if (!engine.getValue(this.group, this.inKey)) {
      script.triggerControl(this.group, 'CloneFromDeck');
    }
  }
}
