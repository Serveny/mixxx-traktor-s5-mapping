import { PushButton } from './button';

/*
 * Represent a pad button that acts as a keyboard key. Depending the deck keyboard mode, it will either change the key, or play the cue with the button's key
 */
export class KeyboardButton extends PushButton {
  constructor(options) {
    super(options);
    if (
      this.number === undefined ||
      !Number.isInteger(this.number) ||
      this.number < 1 ||
      this.number > 8
    ) {
      throw Error(
        'KeyboardButton must have a number property of an integer between 1 and 8'
      );
    }
    if (this.deck === undefined) {
      throw Error('KeyboardButton must have a deck attached to it');
    }
    this.outConnect();
  }
  unshift() {
    this.outTrigger();
  }
  shift() {
    this.outTrigger();
  }
  input(pressed) {
    const offset = this.deck.keyboardOffset - (this.shifted ? 8 : 0);
    if (this.number + offset < 1 || this.number + offset > 24) {
      return;
    }
    if (pressed) {
      engine.setValue(this.group, 'key', this.number + offset);
    }
    if (this.deck.keyboardPlayMode !== null) {
      if (this.deck.keyboardPlayMode.activeKey && pressed) {
        engine.setValue(this.deck.keyboardPlayMode.group, 'cue_goto', pressed);
      } else if (
        !this.deck.keyboardPlayMode.activeKey ||
        this.deck.keyboardPlayMode.activeKey === this
      ) {
        script.toggleControl(
          this.deck.keyboardPlayMode.group,
          this.deck.keyboardPlayMode.action,
          true
        );
      }
      if (!pressed && this.deck.keyboardPlayMode.activeKey === this) {
        this.deck.keyboardPlayMode.activeKey = undefined;
      } else if (pressed) {
        this.deck.keyboardPlayMode.activeKey = this;
      }
    }
  }
  output(value) {
    const offset = this.deck.keyboardOffset - (this.shifted ? 8 : 0);
    const colorIdx = (this.number - 1 + offset) % KeyboardColors.length;
    const color = KeyboardColors[colorIdx];
    if (this.number + offset < 1 || this.number + offset > 24) {
      this.send(0);
    } else {
      this.send(color + (value ? this.brightnessOn : this.brightnessOff));
    }
  }
  outConnect() {
    if (undefined !== this.group) {
      const connection = engine.makeConnection(this.group, 'key', (key) => {
        const offset = this.deck.keyboardOffset - (this.shifted ? 8 : 0);
        this.output(key === this.number + offset);
      });
      if (connection) {
        this.outConnections[0] = connection;
      } else {
        console.warn(
          `Unable to connect ${this.group}.key' to the controller output. The control appears to be unavailable.`
        );
      }
    }
  }
}
