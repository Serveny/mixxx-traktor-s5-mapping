import { PushButton } from './button';

/*
 * Represent a pad button that interact with a intro/extra special markers (set, activate, clear)
 */
export class IntroOutroButton extends PushButton {
  constructor(options) {
    super(options);
    if (
      this.cueBaseName === undefined ||
      typeof this.cueBaseName !== 'string'
    ) {
      throw Error(
        'must specify cueBaseName as intro_start, intro_end, outro_start, or outro_end'
      );
    }
    this.outKey = `${this.cueBaseName}_enabled`;
    this.outConnect();
  }
  unshift() {
    this.inKey = `${this.cueBaseName}_activate`;
  }
  shift() {
    this.inKey = `${this.cueBaseName}_clear`;
  }
  output(value) {
    if (value) {
      this.send(this.color + this.brightnessOn);
    } else {
      this.send(0);
    }
  }
}
