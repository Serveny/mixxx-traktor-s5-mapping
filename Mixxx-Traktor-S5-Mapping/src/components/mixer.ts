import { QuickEffectPresetColors } from '../color';
import type { HIDInputReport } from '../hid-input-record';
import type { HIDOutputReport } from '../hid-output-record';
import { settings } from '../settings';
import { Button } from './buttons/button';
import { FXSelect } from './buttons/fx-select-button';
import { ComponentContainer } from './component-container';
import { Pot } from './pot';
import { S5MixerColumn } from './s5-mixer-column';

export class Mixer extends ComponentContainer {
  mixerColumnDeck1: S5MixerColumn;
  mixerColumnDeck2: S5MixerColumn;
  mixerColumnDeck3: S5MixerColumn;
  mixerColumnDeck4: S5MixerColumn;
  fxSelects: FXSelect[] = [];
  quantizeButton: Button;
  crossfader: Pot;
  master?: Pot;
  booth?: Pot;
  cue?: Pot;
  pflGain?: Pot;

  constructor(inReports: HIDInputReport[], outReports: HIDOutputReport[]) {
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
    });

    const fxSelectsInputs = [
      { inByte: 8, inBit: 5 },
      { inByte: 8, inBit: 1 },
      { inByte: 8, inBit: 6 },
      { inByte: 8, inBit: 0 },
      { inByte: 8, inBit: 7 },
    ];

    // FX SELECT buttons: Filter, 1, 2, 3, 4
    for (const i of [0, 1, 2, 3, 4]) {
      this.fxSelects[i] = new FXSelect(
        Object.assign(fxSelectsInputs[i], {
          number: i + 1,
          mixer: this,
        })
      );
    }

    this.resetFxSelectorColors();

    this.quantizeButton = new Button({
      input: function (this: Button, pressed) {
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

    if (settings.softwareMixerMain) {
      this.master = new Pot({
        group: '[Master]',
        inKey: 'gain',
        inByte: 22,
        bitLength: 12,
        inReport: inReports[2],
      });
    }
    if (settings.softwareMixerBooth) {
      this.booth = new Pot({
        group: '[Master]',
        inKey: 'booth_gain',
        inByte: 24,
        bitLength: 12,
        inReport: inReports[2],
      });
    }
    if (settings.softwareMixerHeadphone) {
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

  resetFxSelectorColors() {
    if (!this.outReport) return;
    for (const selector of [1, 2, 3, 4, 5]) {
      this.outReport.data[49 + selector] =
        QuickEffectPresetColors[selector - 1] + Button.prototype.brightnessOn;
    }
    this.outReport.send();
  }
}
