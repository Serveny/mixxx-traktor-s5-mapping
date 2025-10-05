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
  fxAssignleft: ToggleButton;
  fxAssignRight: ToggleButton;
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

    this.pfl = new ToggleButton({
      group: this.group,
      inKey: 'pfl',
      outKey: 'pfl',
      reports: s5.reports,
      io: io.cue,
    });

    const assginKey: `group_[Channel${number}]_enable` = `group_${this.group}_enable`;
    this.fxAssignleft = new ToggleButton({
      group: '[EffectRack1_EffectUnit1]',
      inKey: assginKey,
      outKey: assginKey,
      reports: s5.reports,
      io: io.fxUnitAssignLeft,
    });
    this.fxAssignRight = new ToggleButton({
      group: '[EffectRack1_EffectUnit2]',
      inKey: assginKey,
      outKey: assginKey,
      reports: s5.reports,
      io: io.fxUnitAssignRight,
    });

    // Assign to crossfader left/right
    engine.setValue(
      this.group,
      'orientation',
      this.deckNum === 1 || this.deckNum === 3 ? 0 : 2
    );

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
