import type { HIDInputReport } from '../hid-input-record';
import type { HIDOutputReport } from '../hid-output-record';
import type { HIDReportHodler } from '../hid-report';
import { settings } from '../settings';
import type { S5MixerMapping } from '../types/mapping';
import { Button, QuantizeButton } from './buttons/button';
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
  cueGain?: Pot;

  constructor(reports: HIDReportHodler, io: S5MixerMapping) {
    super();

    this.outReport = reports.out[130];

    this.channelC = new S5MixerColumn(
      1,
      reports.in,
      this.outReport,
      io.channelC
    );
    this.channelA = new S5MixerColumn(
      2,
      reports.in,
      this.outReport,
      io.channelA
    );
    this.channelB = new S5MixerColumn(
      3,
      reports.in,
      this.outReport,
      io.channelB
    );
    this.channelD = new S5MixerColumn(
      4,
      reports.in,
      this.outReport,
      io.channelD
    );

    this.quantizeButton = new QuantizeButton({}, io.quantize);

    this.crossfader = new Pot('[Master]', 'crossfader', io.cross);

    if (settings.softwareMixerMain) {
      this.master = new Pot('[Master]', 'gain', io.mainGain);
    }
    if (settings.softwareMixerBooth) {
      this.booth = new Pot('[Master]', 'booth_gain', io.boothGain);
    }
    if (settings.softwareMixerHeadphone) {
      this.cue = new Pot('[Master]', 'headMix', io.cueMix);

      this.cueGain = new Pot('[Master]', 'headGain', io.cueGain);
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
}
