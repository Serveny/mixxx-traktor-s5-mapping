import type { S5 } from '../s5';
import { settings } from '../settings';
import type { S5MixerMapping } from '../types/mapping';
import { FXSelect } from './buttons/fx-select-button';
import { QuantizeButton } from './buttons/quantize-button';
import { ComponentContainer } from './component-container';
import { Pot } from './pot';
import { S5MixerColumn } from './s5-mixer-column';

export class Mixer extends ComponentContainer {
  channelC: S5MixerColumn;
  channelA: S5MixerColumn;
  channelB: S5MixerColumn;
  channelD: S5MixerColumn;
  fxSelects: FXSelect[] = [];
  quantizeButton: QuantizeButton;
  crossfader: Pot;
  master?: Pot;
  booth?: Pot;
  cue?: Pot;
  cueGain?: Pot;

  constructor(s5: S5, io: S5MixerMapping) {
    super('[Mixer]');

    this.channelC = new S5MixerColumn(
      1,
      s5.reports.in,
      s5.reports.out[130],
      s5,
      io.channelC
    );
    this.channelA = new S5MixerColumn(
      2,
      s5.reports.in,
      s5.reports.out[130],
      s5,
      io.channelA
    );
    this.channelB = new S5MixerColumn(
      3,
      s5.reports.in,
      s5.reports.out[130],
      s5,
      io.channelB
    );
    this.channelD = new S5MixerColumn(
      4,
      s5.reports.in,
      s5.reports.out[130],
      s5,
      io.channelD
    );

    this.quantizeButton = new QuantizeButton(s5.reports, io.quantize);

    this.crossfader = new Pot('[Master]', 'crossfader', s5.reports, io.cross);

    if (settings.softwareMixerMain) {
      this.master = new Pot('[Master]', 'gain', s5.reports, io.mainGain);
    }
    if (settings.softwareMixerBooth) {
      this.booth = new Pot('[Master]', 'booth_gain', s5.reports, io.boothGain);
    }
    if (settings.softwareMixerHeadphone) {
      this.cue = new Pot('[Master]', 'headMix', s5.reports, io.cueMix);

      this.cueGain = new Pot('[Master]', 'headGain', s5.reports, io.cueGain);
    }

    // TODO: Find out why?
    //for (const component of this) {
    //if (component.inReport === undefined) {
    //component.inReport = inReports[1];
    //}
    //component.outReport = this.outReport;
    //component.inConnect();
    //component.outConnect();
    //component.outTrigger();
    //}

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
