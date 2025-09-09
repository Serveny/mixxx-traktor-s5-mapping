import type { Mixer } from '../mixer';
import { Button } from './button';

export class FXSelect extends Button {
  mixer: Mixer;
  constructor(options: Partial<FXSelect>) {
    super(options);

    if (options.mixer === undefined) {
      throw Error('The mixer must be specified');
    }

    this.mixer = options.mixer;
  }

  onShortPress() {
    if (this.mixer.firstPressedFxSelector === null) {
      this.mixer.firstPressedFxSelector = this.number;
      for (const selector of [1, 2, 3, 4, 5]) {
        if (selector !== this.number) {
          let presetNumber =
            5 + 4 * (this.mixer.firstPressedFxSelector - 1) + selector;
          if (selector > this.number) {
            presetNumber--;
          }
          this.outReport.data[49 + selector] =
            QuickEffectPresetColors[presetNumber - 1] + this.brightnessOn;
        }
      }
      this.outReport.send();
    } else {
      this.mixer.secondPressedFxSelector = this.number;
    }
  }

  onShortRelease() {
    // After a second selector was released, avoid loading a different preset when
    // releasing the first pressed selector.
    if (
      this.mixer.comboSelected &&
      this.number === this.mixer.firstPressedFxSelector
    ) {
      this.mixer.comboSelected = false;
      this.mixer.firstPressedFxSelector = null;
      this.mixer.secondPressedFxSelector = null;
      this.mixer.resetFxSelectorColors();
      return;
    }
    // If mixer.firstPressedFxSelector === null, it was reset by the input handler for
    // a QuickEffect enable button to load the preset for only one deck.
    if (this.mixer.firstPressedFxSelector !== null) {
      for (const deck of [1, 2, 3, 4]) {
        const presetNumber = this.mixer.calculatePresetNumber();
        engine.setValue(
          `[QuickEffectRack1_[Channel${deck}]]`,
          'loaded_chain_preset',
          presetNumber
        );
      }
    }
    if (this.mixer.firstPressedFxSelector === this.number) {
      this.mixer.firstPressedFxSelector = null;
      this.mixer.resetFxSelectorColors();
    }
    if (this.mixer.secondPressedFxSelector !== null) {
      this.mixer.comboSelected = true;
    }
    this.mixer.secondPressedFxSelector = null;
  }
}
