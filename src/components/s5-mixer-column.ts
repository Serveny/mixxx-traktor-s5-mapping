import type { S5 } from '../s5';
import { ComponentContainer } from './component-container';
import { Pot } from './pot';
import type { S5MixerColumnMapping } from '../types/mapping';
import {
	channelGroup,
	equalizerGroup,
	quickEffectGroup,
	type DeckChannel,
	type EqualizerGroup,
	type MixxxChannelGroup,
	type QuickEffectGroup,
} from '../types/mixxx-controls';
import { VolumeMeter } from './volume-meter';
import { ToggleButton } from './buttons/button';

export class S5MixerColumn extends ComponentContainer<MixxxChannelGroup> {
	declare group: MixxxChannelGroup;
	gain: Pot<MixxxChannelGroup>;
	fxAssignleft: ToggleButton;
	fxAssignRight: ToggleButton;
	eqHigh: Pot<EqualizerGroup>;
	eqMid: Pot<EqualizerGroup>;
	eqLow: Pot<EqualizerGroup>;
	filterKnob: Pot<QuickEffectGroup>;
	filterButton: ToggleButton;
	volume: Pot<MixxxChannelGroup>;
	volumeMeter: VolumeMeter;
	pfl: ToggleButton; // Channel cue button

	constructor(
		private deckNum: DeckChannel,
		s5: S5,
		io: S5MixerColumnMapping
	) {
		super(channelGroup(deckNum));

		this.gain = this.register(new Pot(this.group, 'pregain', s5.reports, io.gain));

		this.eqHigh = this.register(new Pot(
			equalizerGroup(this.group),
			'parameter3',
			s5.reports,
			io.eqHigh
		));
		this.eqMid = this.register(new Pot(
			equalizerGroup(this.group),
			'parameter2',
			s5.reports,
			io.eqMid
		));
		this.eqLow = this.register(new Pot(
			equalizerGroup(this.group),
			'parameter1',
			s5.reports,
			io.eqLow
		));

		this.filterKnob = this.register(new Pot(
			quickEffectGroup(this.group),
			'super1',
			s5.reports,
			io.filter
		));
		this.filterButton = this.register(new ToggleButton({
			group: quickEffectGroup(this.group),
			inKey: 'enabled',
			outKey: 'enabled',
			reports: s5.reports,
			io: io.filterBtn,
		}));

		this.volume = this.register(
			new Pot(this.group, 'volume', s5.reports, io.volume)
		);
		this.volumeMeter = this.register(
			new VolumeMeter(deckNum, 'volume', s5, io.volumeLevel)
		);

		this.pfl = this.register(new ToggleButton({
			group: this.group,
			inKey: 'pfl',
			outKey: 'pfl',
			reports: s5.reports,
			io: io.cue,
		}));

		const assignKey = `group_${this.group}_enable` as const;
		this.fxAssignleft = this.register(new ToggleButton({
			group: '[EffectRack1_EffectUnit1]',
			inKey: assignKey,
			outKey: assignKey,
			reports: s5.reports,
			io: io.fxUnitAssignLeft,
		}));
		this.fxAssignRight = this.register(new ToggleButton({
			group: '[EffectRack1_EffectUnit2]',
			inKey: assignKey,
			outKey: assignKey,
			reports: s5.reports,
			io: io.fxUnitAssignRight,
		}));

		// Assign to crossfader left/right
		engine.setValue(
			this.group,
			'orientation',
			this.deckNum === 1 || this.deckNum === 3 ? 0 : 2
		);

		this.triggerComponents();
	}

}
