import { PushButton } from './button';

/*
 * Represent a pad button that interact with a hotcue (set, activate or clear)
 */
export class HotcueButton extends PushButton {
  constructor(options) {
    super(options);
    if (
      this.number === undefined ||
      !Number.isInteger(this.number) ||
      this.number < 1 ||
      this.number > 32
    ) {
      throw Error(
        'HotcueButton must have a number property of an integer between 1 and 32'
      );
    }
    this.outKey = `hotcue_${this.number}_status`;
    this.colorKey = `hotcue_${this.number}_color`;
    this.outConnect();
  }
  unshift() {
    this.inKey = `hotcue_${this.number}_activate`;
  }
  shift() {
    this.inKey = `hotcue_${this.number}_clear`;
  }
  input(pressed) {
    engine.setValue(this.group, 'scratch2_enable', false);
    engine.setValue(this.group, this.inKey, pressed);
  }
  output(value) {
    if (value) {
      this.send(this.color + this.brightnessOn);
    } else {
      this.send(LedColors.off);
    }
  }
  outConnect() {
    if (undefined !== this.group) {
      const connection0 = engine.makeConnection(
        this.group,
        this.outKey,
        this.output.bind(this)
      );
      if (connection0) {
        this.outConnections[0] = connection0;
      } else {
        console.warn(
          `Unable to connect ${this.group}.${this.outKey}' to the controller output. The control appears to be unavailable.`
        );
      }
      const connection1 = engine.makeConnection(
        this.group,
        this.colorKey,
        (colorCode) => {
          this.color = this.colorMap.getValueForNearestColor(colorCode);
          this.output(engine.getValue(this.group, this.outKey));
        }
      );
      if (connection1) {
        this.outConnections[1] = connection1;
      } else {
        console.warn(
          `Unable to connect ${this.group}.${this.colorKey}' to the controller output. The control appears to be unavailable.`
        );
      }
    }
  }
}
