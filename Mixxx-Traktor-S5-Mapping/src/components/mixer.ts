import { ComponentContainer } from './component-container';

export class Mixer extends ComponentContainer {
  constructor(inReports, outReports) {
    super();

    this.outReport = outReports[128];

    this.mixerColumnDeck1 = new S5MixerColumn(1, inReports, outReports[128], {
      saveGain: { inByte: 11, inBit: 0, outByte: 80 },
      effectUnit1Assign: { inByte: 2, inBit: 3, outByte: 78 },
      effectUnit2Assign: { inByte: 2, inBit: 4, outByte: 79 },
      gain: { inByte: 16 },
      eqHigh: { inByte: 44 },
      eqMid: { inByte: 46 },
      eqLow: { inByte: 48 },
      quickEffectKnob: { inByte: 64 },
      quickEffectButton: {},
      volume: { inByte: 2 },
      pfl: { inByte: 7, inBit: 3, outByte: 77 },
      // crossfaderSwitch: { inByte: 17, inBit: 4 },
    });
    this.mixerColumnDeck2 = new S5MixerColumn(2, inReports, outReports[128], {
      saveGain: { inByte: 11, inBit: 1, outByte: 84 },
      effectUnit1Assign: { inByte: 2, inBit: 5, outByte: 82 },
      effectUnit2Assign: { inByte: 2, inBit: 6, outByte: 83 },
      gain: { inByte: 18 },
      eqHigh: { inByte: 50 },
      eqMid: { inByte: 52 },
      eqLow: { inByte: 54 },
      quickEffectKnob: { inByte: 66 },
      volume: { inByte: 4 },
      pfl: { inByte: 7, inBit: 6, outByte: 81 },
      // crossfaderSwitch: { inByte: 17, inBit: 2 },
    });
    this.mixerColumnDeck3 = new S5MixerColumn(3, inReports, outReports[128], {
      saveGain: { inByte: 2, inBit: 1, outByte: 88 },
      effectUnit1Assign: { inByte: 2, inBit: 0, outByte: 86 },
      effectUnit2Assign: { inByte: 2, inBit: 2, outByte: 87 },
      gain: { inByte: 14 },
      eqHigh: { inByte: 38 },
      eqMid: { inByte: 40 },
      eqLow: { inByte: 42 },
      quickEffectKnob: { inByte: 62 },
      volume: { inByte: 6 },
      pfl: { inByte: 7, inBit: 2, outByte: 85 },
      // crossfaderSwitch: { inByte: 17, inBit: 6 },
    });
    this.mixerColumnDeck4 = new S5MixerColumn(4, inReports, outReports[128], {
      saveGain: { inByte: 11, inBit: 2, outByte: 92 },
      effectUnit1Assign: { inByte: 2, inBit: 7, outByte: 90 },
      effectUnit2Assign: { inByte: 11, inBit: 7, outByte: 91 },
      gain: { inByte: 20 },
      eqHigh: { inByte: 56 },
      eqMid: { inByte: 58 },
      eqLow: { inByte: 60 },
      quickEffectKnob: { inByte: 68 },
      volume: { inByte: 8 },
      pfl: { inByte: 7, inBit: 7, outByte: 89 },
      // crossfaderSwitch: { inByte: 17, inBit: 0 },
    });

    this.firstPressedFxSelector = null;
    this.secondPressedFxSelector = null;
    this.comboSelected = false;

    const fxSelectsInputs = [
      { inByte: 8, inBit: 5 },
      { inByte: 8, inBit: 1 },
      { inByte: 8, inBit: 6 },
      { inByte: 8, inBit: 0 },
      { inByte: 8, inBit: 7 },
    ];
    this.fxSelects = [];
    // FX SELECT buttons: Filter, 1, 2, 3, 4
    for (const i of [0, 1, 2, 3, 4]) {
      this.fxSelects[i] = new FXSelect(
        Object.assign(fxSelectsInputs[i], {
          number: i + 1,
          mixer: this,
        })
      );
    }

    const quickEffectInputs = [
      { inByte: 7, inBit: 0, outByte: 46 },
      { inByte: 7, inBit: 5, outByte: 47 },
      { inByte: 7, inBit: 1, outByte: 48 },
      { inByte: 7, inBit: 4, outByte: 49 },
    ];
    this.quickEffectButtons = [];
    // FX SELECT buttons: 1, 2, 3, 4
    for (const i of [0, 1, 2, 3]) {
      this.quickEffectButtons[i] = new QuickEffectButton(
        Object.assign(quickEffectInputs[i], {
          number: i + 1,
          mixer: this,
        })
      );
    }
    this.resetFxSelectorColors();

    this.quantizeButton = new Button({
      input: function (pressed) {
        if (pressed) {
          this.globalQuantizeOn = !this.globalQuantizeOn;
          for (let deckIdx = 1; deckIdx <= 4; deckIdx++) {
            engine.setValue(
              `[Channel${deckIdx}]`,
              'quantize',
              this.globalQuantizeOn
            );
          }
          this.send(this.globalQuantizeOn ? 127 : 0);
        }
      },
      globalQuantizeOn: false,
      inByte: 11,
      inBit: 6,
      outByte: 93,
    });

    this.crossfader = new Pot({
      group: '[Master]',
      inKey: 'crossfader',
      inByte: 0,
      inReport: inReports[2],
    });
    this.crossfaderCurveSwitch = new Component({
      inByte: 18,
      inBit: 0,
      inBitLength: 2,
      input: function (value) {
        switch (value) {
          case 0x00: // Picnic Bench / Fast Cut
            engine.setValue('[Mixer Profile]', 'xFaderMode', 0);
            engine.setValue('[Mixer Profile]', 'xFaderCurve', 7.0);
            break;
          case 0x01: // Constant Power
            engine.setValue('[Mixer Profile]', 'xFaderMode', 1);
            engine.setValue('[Mixer Profile]', 'xFaderCurve', 0.6);
            // Constant power requires to set an appropriate calibration value
            // in order to get a smooth curve.
            // This is the output of EngineXfader::getPowerCalibration() for
            // the "xFaderCurve" 0.6 (pow(0.5, 1.0 / 0.6))
            engine.setValue('[Mixer Profile]', 'xFaderCalibration', 0.31498);
            break;
          case 0x02: // Additive
            engine.setValue('[Mixer Profile]', 'xFaderMode', 0);
            engine.setValue('[Mixer Profile]', 'xFaderCurve', 0.9);
        }
      },
    });

    if (SoftwareMixerMain) {
      this.master = new Pot({
        group: '[Master]',
        inKey: 'gain',
        inByte: 22,
        bitLength: 12,
        inReport: inReports[2],
      });
    }
    if (SoftwareMixerBooth) {
      this.booth = new Pot({
        group: '[Master]',
        inKey: 'booth_gain',
        inByte: 24,
        bitLength: 12,
        inReport: inReports[2],
      });
    }
    if (SoftwareMixerHeadphone) {
      this.cue = new Pot({
        group: '[Master]',
        inKey: 'headMix',
        inByte: 28,
        bitLength: 12,
        inReport: inReports[2],
      });

      this.pflGain = new Pot({
        group: '[Master]',
        inKey: 'headGain',
        inByte: 26,
        bitLength: 12,
        inReport: inReports[2],
      });
    }

    for (const component of this) {
      if (component.inReport === undefined) {
        component.inReport = inReports[1];
      }
      component.outReport = this.outReport;
      component.inConnect();
      component.outConnect();
      component.outTrigger();
    }

    let lightQuantizeButton = true;
    for (let deckIdx = 1; deckIdx <= 4; deckIdx++) {
      if (!engine.getValue(`[Channel${deckIdx}]`, 'quantize')) {
        lightQuantizeButton = false;
      }
    }
    this.quantizeButton.send(lightQuantizeButton ? 127 : 0);
    this.quantizeButton.globalQuantizeOn = lightQuantizeButton;
  }

  calculatePresetNumber() {
    if (
      this.firstPressedFxSelector === this.secondPressedFxSelector ||
      this.secondPressedFxSelector === null
    ) {
      return this.firstPressedFxSelector;
    }
    let presetNumber =
      5 + 4 * (this.firstPressedFxSelector - 1) + this.secondPressedFxSelector;
    if (this.secondPressedFxSelector > this.firstPressedFxSelector) {
      presetNumber--;
    }
    return presetNumber;
  }

  resetFxSelectorColors() {
    for (const selector of [1, 2, 3, 4, 5]) {
      this.outReport.data[49 + selector] =
        QuickEffectPresetColors[selector - 1] + Button.prototype.brightnessOn;
    }
    this.outReport.send();
  }
}
