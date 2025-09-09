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
    script.toggleControl(this.group, this.inKey);
  }
  onLongPress() {
    if (this.shifted) {
      engine.setValue(this.group, this.inKey, 0);
      script.triggerControl(this.group, 'eject', 0);
    } else if (!engine.getValue(this.group, this.inKey)) {
      script.triggerControl(this.group, 'CloneFromDeck', 0);
    }
  }
}
