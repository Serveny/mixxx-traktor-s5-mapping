import type { S5 } from '../s5';
import { settings } from '../settings';
import { PushButton, ToggleButton } from './buttons/button';
import { Component } from './component';
import { ComponentContainer } from './component-container';
import { LoudnessMeter } from './loudness-meter';
import { Pot } from './pot';
import type { S5MixerColumnMapping } from '../types/mapping';
import type { HIDReportHodler } from '../hid-report';

export class S5MixerColumn extends ComponentContainer {
  gain: Pot;
  eqHigh: Pot;
  eqMid: Pot;
  eqLow: Pot;
  // quickEffectKnob: Pot;
  volume: Pot;
  loudnessMeter: LoudnessMeter;
  constructor(
    private idx: number,
    reports: HIDReportHodler,
    io: S5MixerColumnMapping
  ) {
    super(`[Channel${idx}]`);

    this.idx = idx;

    this.gain = new Pot(this.group, 'pregain', reports, io.gain);
    this.eqHigh = new Pot(
      `[EqualizerRack1_${this.group}_Effect1]`,
      'parameter3',
      reports,
      io.eqHigh
    );
    this.eqMid = new Pot(
      `[EqualizerRack1_${this.group}_Effect1]`,
      'parameter2',
      reports,
      io.eqMid
    );
    this.eqLow = new Pot(
      `[EqualizerRack1_${this.group}_Effect1]`,
      'parameter1',
      reports,
      io.eqLow
    );
    //this.quickEffectKnob = new Pot(
    //`[QuickEffectRack1_${this.group}]`,
    //'super1', s5.reports, io.q
    //);
    this.volume = new Pot({
      inKey: 'volume',
      mixer: this,
      input: settings.mixerControlsMixAuxOnShift
        ? function (this: S5, value) {
            if (this.mixer.isShifted && this.group !== `[Channel${idx}]`) {
              // FIXME only if group != [ChannelX]
              const controlKey =
                this.group === `[Microphone${idx}]` ||
                this.group === '[Microphone]'
                  ? 'talkover'
                  : 'main_mix';
              const isPlaying = engine.getValue(this.group, controlKey);
              if ((value !== 0) !== isPlaying) {
                engine.setValue(this.group, controlKey, value !== 0);
              }
            }
            this.defaultInput(value);
          }
        : undefined,
    });

    this.pfl = new ToggleButton({
      inKey: 'pfl',
      outKey: 'pfl',
    });

    this.effectUnit1Assign = new PowerWindowButton({
      group: '[EffectRack1_EffectUnit1]',
      key: `group_${this.group}_enable`,
    });

    this.effectUnit2Assign = new PowerWindowButton({
      group: '[EffectRack1_EffectUnit2]',
      key: `group_${this.group}_enable`,
    });

    // FIXME: Why is output not working for these?
    this.saveGain = new PushButton({
      key: 'update_replaygain_from_pregain',
    });

    this.crossfaderSwitch = new Component({
      inBitLength: 2,
      input: function (value) {
        if (value === 0) {
          engine.setValue(this.group, 'orientation', 2);
        } else if (value === 1) {
          engine.setValue(this.group, 'orientation', 1);
        } else if (value === 2) {
          engine.setValue(this.group, 'orientation', 0);
        }
      },
    });

    for (const property in this) {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        const component = this[property];
        if (component instanceof Component) {
          Object.assign(component, io[property]);
          if (component instanceof Pot) {
            component.inReport = inReports[2];
          } else {
            component.inReport = inReports[1];
          }
          component.outReport = outReport;

          if (component.group === undefined) {
            component.group = this.group;
          }

          component.inConnect();
          component.outConnect();
          component.outTrigger();
        }
      }
    }

    if (settings.mixerControlsMixAuxOnShift) {
      this.shift = function () {
        engine.setValue('[Microphone]', 'show_microphone', 1);
        this.updateGroup(true);
      };

      this.unshift = function () {
        engine.setValue('[Microphone]', 'show_microphone', 0);
        this.updateGroup(false);
      };
    }

    this.loudnessMeter = new LoudnessMeter(
      this.idx,
      `loudness_meter_${this.idx}`,
      this.outReport,
      s5,
      io.volumeLevel
    );
  }

  updateGroup(shifted: boolean) {
    let alternativeInput = null;
    if (engine.getValue(`[Auxiliary${this.idx}]`, 'input_configured')) {
      alternativeInput = `[Auxiliary${this.idx}]`;
    } else if (
      engine.getValue(
        this.idx !== 1 ? `[Microphone${this.idx}]` : '[Microphone]',
        'input_configured'
      )
    ) {
      alternativeInput =
        this.idx !== 1 ? `[Microphone${this.idx}]` : '[Microphone]';
    }

    if (!alternativeInput) {
      return;
    }
    this.group = shifted ? alternativeInput : `[Channel${this.idx}]`;
    for (const property of ['gain', 'volume', 'pfl', 'crossfaderSwitch']) {
      const component = (this as any)[property];
      if (component instanceof Component) {
        component.outDisconnect();
        component.inDisconnect();
        component.group = this.group;
        component.inConnect();
        component.outConnect();
        component.outTrigger();
      }
    }
    for (const property of ['effectUnit1Assign', 'effectUnit2Assign']) {
      const component = (this as any)[property];
      if (component instanceof Component) {
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
