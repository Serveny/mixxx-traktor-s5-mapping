import { Button } from './button';

export class QuickEffectButton extends Button {
  constructor(options) {
    super(options);
    if (this.mixer === undefined) {
      throw Error('The mixer must be specified');
    }
    if (
      this.number === undefined ||
      !Number.isInteger(this.number) ||
      this.number < 1
    ) {
      throw Error('number attribute must be an integer >= 1');
    }
    this.group = `[QuickEffectRack1_[Channel${this.number}]]`;
    this.outConnect();
  }
  onShortPress() {
    if (this.mixer.firstPressedFxSelector === null) {
      script.toggleControl(this.group, 'enabled');
    } else {
      const presetNumber = this.mixer.calculatePresetNumber();
      this.color = QuickEffectPresetColors[presetNumber - 1];
      engine.setValue(this.group, 'loaded_chain_preset', presetNumber);
      this.mixer.firstPressedFxSelector = null;
      this.mixer.secondPressedFxSelector = null;
      this.mixer.resetFxSelectorColors();
    }
  }
  onLongRelease() {
    if (this.mixer.firstPressedFxSelector === null) {
      script.toggleControl(this.group, 'enabled');
    }
  }
  output(enabled) {
    if (enabled) {
      this.send(this.color + this.brightnessOn);
    } else {
      // It is easy to mistake the dim state for the bright state, so turn
      // the LED fully off.
      this.send(this.color + this.brightnessOff);
    }
  }
  presetLoaded(presetNumber) {
    this.color = QuickEffectPresetColors[presetNumber - 1];
    this.outConnections[1].trigger();
  }
  outConnect() {
    if (this.group !== undefined) {
      const connection0 = engine.makeConnection(
        this.group,
        'loaded_chain_preset',
        this.presetLoaded.bind(this)
      );
      if (connection0) {
        this.outConnections[0] = connection0;
      } else {
        console.warn(
          `Unable to connect ${this.group}.loaded_chain_preset' to the controller output. The control appears to be unavailable.`
        );
      }
      const connection1 = engine.makeConnection(
        this.group,
        'enabled',
        this.output.bind(this)
      );
      if (connection1) {
        this.outConnections[1] = connection1;
      } else {
        console.warn(
          `Unable to connect ${this.group}.enabled' to the controller output. The control appears to be unavailable.`
        );
      }
    }
  }
}
