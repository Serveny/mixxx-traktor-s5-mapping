import type { S5 } from '../s5';
import { createCompContainer } from './component-container';
import { Pot } from './pot';
import type { S5MixerColumnMapping } from '../types/mapping';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import { VolumeMeter } from './volume-meter';
import { ToggleButton } from './buttons/button';

type EqualizerGroup = `[EqualizerRack1_[Channel${number}]_Effect1]`;
const CompContainer = createCompContainer<MixxxChannelGroup>();
export class S5MixerColumn extends CompContainer {
  declare group: MixxxChannelGroup;
  gain: Pot<MixxxChannelGroup>;
  eqHigh: Pot<EqualizerGroup>;
  eqMid: Pot<EqualizerGroup>;
  eqLow: Pot<EqualizerGroup>;
  filterKnob: Pot<`[QuickEffectRack1_[Channel${number}]]`>;
  filterButton: ToggleButton;
  volume: Pot<MixxxChannelGroup>;
  volumeMeter: VolumeMeter;
  pfl: ToggleButton; // Channel cue button

  constructor(private deckNum: number, s5: S5, io: S5MixerColumnMapping) {
    super(`[Channel${deckNum}]`);

    this.gain = new Pot(this.group, 'pregain', s5.reports, io.gain);

    this.eqHigh = new Pot(
      `[EqualizerRack1_${this.group}_Effect1]`,
      'parameter3',
      s5.reports,
      io.eqHigh
    );
    this.eqMid = new Pot(
      `[EqualizerRack1_${this.group}_Effect1]`,
      'parameter2',
      s5.reports,
      io.eqMid
    );
    this.eqLow = new Pot(
      `[EqualizerRack1_${this.group}_Effect1]`,
      'parameter1',
      s5.reports,
      io.eqLow
    );

    this.filterKnob = new Pot(
      `[QuickEffectRack1_${this.group}]`,
      'super1',
      s5.reports,
      io.filter
    );
    this.filterButton = new ToggleButton({
      group: `[QuickEffectRack1_${this.group}]`,
      inKey: 'enabled',
      outKey: 'enabled',
      reports: s5.reports,
      io: io.filterBtn,
    });

    this.volume = new Pot(this.group, 'volume', s5.reports, io.volume);
    this.volumeMeter = new VolumeMeter(deckNum, 'volume', s5, io.volumeLevel);
    //input: settings.mixerControlsMixAuxOnShift
    //? function (this: S5, value) {
    //if (this.mixer.isShifted && this.group !== `[Channel${idx}]`) {
    //// FIXME only if group != [ChannelX]
    //const controlKey =
    //this.group === `[Microphone${idx}]` ||
    //this.group === '[Microphone]'
    //? 'talkover'
    //: 'main_mix';
    //const isPlaying = engine.getValue(this.group, controlKey);
    //if ((value !== 0) !== isPlaying) {
    //engine.setValue(this.group, controlKey, value !== 0);
    //}
    //}
    //this.defaultInput(value);
    //}
    //: undefined,
    //});

    this.pfl = new ToggleButton({
      group: this.group,
      inKey: 'pfl',
      outKey: 'pfl',
      reports: s5.reports,
      io: io.cue,
    });

    //this.effectUnit1Assign = new PowerWindowButton({
    //group: '[EffectRack1_EffectUnit1]',
    //key: `group_${this.group}_enable`,
    //});

    //this.effectUnit2Assign = new PowerWindowButton({
    //group: '[EffectRack1_EffectUnit2]',
    //key: `group_${this.group}_enable`,
    //});

    //// FIXME: Why is output not working for these?
    //this.saveGain = new PushButton({
    //key: 'update_replaygain_from_pregain',
    //});

    //this.crossfaderSwitch = new Component({
    //inBitLength: 2,
    //input: function (value) {
    //if (value === 0) {
    //engine.setValue(this.group, 'orientation', 2);
    //} else if (value === 1) {
    //engine.setValue(this.group, 'orientation', 1);
    //} else if (value === 2) {
    //engine.setValue(this.group, 'orientation', 0);
    //}
    //},
    //});

    //for (const property in this) {
    //if (Object.prototype.hasOwnProperty.call(this, property)) {
    //const component = this[property];
    //if (component instanceof Component) {
    //Object.assign(component, io[property]);
    //if (component instanceof Pot) {
    //component.inReport = inReports[2];
    //} else {
    //component.inReport = inReports[1];
    //}
    //component.outReport = outReport;

    //if (component.group === undefined) {
    //component.group = this.group;
    //}

    //component.inConnect();
    //component.outConnect();
    //component.outTrigger();
    //}
    //}
    //}

    //if (settings.mixerControlsMixAuxOnShift) {
    //this.shift = function () {
    //engine.setValue('[Microphone]', 'show_microphone', 1);
    //this.updateGroup(true);
    //};

    //this.unshift = function () {
    //engine.setValue('[Microphone]', 'show_microphone', 0);
    //this.updateGroup(false);
    //};
    //}

    //this.loudnessMeter = new LoudnessMeter(
    //this.idx,
    //`loudness_meter_${this.idx}`,
    //this.outReport,
    //s5,
    //io.volumeLevel
    //);
    this.triggerComponents();
  }

  updateGroup(shifted: boolean) {
    let alternativeInput = null;
    if (engine.getValue(`[Auxiliary${this.deckNum}]`, 'input_configured')) {
      alternativeInput = `[Auxiliary${this.deckNum}]`;
    } else if (
      engine.getValue(
        this.deckNum !== 1 ? `[Microphone${this.deckNum}]` : '[Microphone]',
        'input_configured'
      )
    ) {
      alternativeInput =
        this.deckNum !== 1 ? `[Microphone${this.deckNum}]` : '[Microphone]';
    }

    if (!alternativeInput) {
      return;
    }
    this.group = shifted
      ? (alternativeInput as any)
      : `[Channel${this.deckNum}]`;
    for (const property of ['gain', 'volume', 'pfl', 'crossfaderSwitch']) {
      const component = (this as any)[property];
      if (component.group != null) {
        component.inDisconnect();
        component.group = this.group;
        component.inConnect();
      }
    }
    for (const property of ['effectUnit1Assign', 'effectUnit2Assign']) {
      const component = (this as any)[property];
      if (component.group != null) {
        component.outDisconnect();
        component.inDisconnect();
        component.inKey = `group_${this.group}_enable`;
        component.outKey = `group_${this.group}_enable`;
        component.inConnect();
        component.outConnect();
        component.outTrigger();
      }
    }
  }
}
