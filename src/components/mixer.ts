import { QuickEffectPresetColors } from '../color';
import type { HIDInputReport } from '../hid-input-record';
import type { HIDOutputReport } from '../hid-output-record';
import type { S5MixerMapping } from '../mapping';
import { settings } from '../settings';
import { Button } from './buttons/button';
import { FXSelect } from './buttons/fx-select-button';
import { ComponentContainer } from './component-container';
import { Pot } from './pot';
import { S5MixerColumn } from './s5-mixer-column';

export class Mixer extends ComponentContainer {
  channelC: S5MixerColumn;
  channelA: S5MixerColumn;
  channelB: S5MixerColumn;
  channelD: S5MixerColumn;
  fxSelects: FXSelect[] = [];
  quantizeButton: Button;
  crossfader: Pot;
  master?: Pot;
  booth?: Pot;
  cue?: Pot;
  pflGain?: Pot;

  constructor(
    inReports: HIDInputReport[],
    outReports: HIDOutputReport[],
    io: S5MixerMapping
  ) {
    super();

    this.outReport = outReports[128];

    this.channelC = new S5MixerColumn(
      1,
      inReports,
      outReports[128],
      io.channelC
    );
    this.channelA = new S5MixerColumn(
      2,
      inReports,
      outReports[128],
      io.channelA
    );
    this.channelB = new S5MixerColumn(
      3,
      inReports,
      outReports[128],
      io.channelB
    );
    this.channelD = new S5MixerColumn(
      4,
      inReports,
      outReports[128],
      io.channelD
    );

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
