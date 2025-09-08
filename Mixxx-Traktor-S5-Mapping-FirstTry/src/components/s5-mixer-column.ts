import { ComponentContainer } from './component-container';

export class S5MixerColumn extends ComponentContainer {
  constructor(idx, inReports, outReport, io) {
    super();

    this.idx = idx;
    this.group = `[Channel${idx}]`;

    this.gain = new Pot({
      inKey: 'pregain',
    });
    this.eqHigh = new Pot({
      group: `[EqualizerRack1_${this.group}_Effect1]`,
      inKey: 'parameter3',
    });
    this.eqMid = new Pot({
      group: `[EqualizerRack1_${this.group}_Effect1]`,
      inKey: 'parameter2',
    });
    this.eqLow = new Pot({
      group: `[EqualizerRack1_${this.group}_Effect1]`,
      inKey: 'parameter1',
    });
    this.quickEffectKnob = new Pot({
      group: `[QuickEffectRack1_${this.group}]`,
      inKey: 'super1',
    });
    this.volume = new Pot({
      inKey: 'volume',
      mixer: this,
      input: MixerControlsMixAuxOnShift
        ? function (value) {
            if (this.mixer.shifted && this.group !== `[Channel${idx}]`) {
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

    if (MixerControlsMixAuxOnShift) {
      this.shift = function () {
        engine.setValue('[Microphone]', 'show_microphone', true);
        this.updateGroup(true);
      };

      this.unshift = function () {
        engine.setValue('[Microphone]', 'show_microphone', false);
        this.updateGroup(false);
      };
    }
  }

  updateGroup(shifted) {
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
      const component = this[property];
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
      const component = this[property];
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
