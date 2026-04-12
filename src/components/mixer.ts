import type { S5 } from '../s5';
import { settings } from '../settings';
import type { S5MixerMapping } from '../types/mapping';
// import { FXSelect } from './buttons/fx-select-button';
import { QuantizeButton } from './buttons/quantize-button';
import { ComponentContainer } from './component-container';
import { TempoEncoder } from './encoders/tempo-encoder';
import { Pot } from './pot';
import { S5MixerColumn } from './s5-mixer-column';

export class Mixer extends ComponentContainer<'[Master]'> {
	channelC: S5MixerColumn;
	channelA: S5MixerColumn;
	channelB: S5MixerColumn;
	channelD: S5MixerColumn;
	// fxSelects: FXSelect[] = [];
	quantizeButton: QuantizeButton;
	tempoEncoder: TempoEncoder;
	crossfader: Pot<'[Master]'>;
	master?: Pot<'[Master]'>;
	booth?: Pot<'[Master]'>;
	cue?: Pot<'[Master]'>;
	cueGain?: Pot<'[Master]'>;

	constructor(s5: S5, io: S5MixerMapping) {
		super('[Master]');

		this.channelC = this.register(new S5MixerColumn(3, s5, io.channelC));
		this.channelA = this.register(new S5MixerColumn(1, s5, io.channelA));
		this.channelB = this.register(new S5MixerColumn(2, s5, io.channelB));
		this.channelD = this.register(new S5MixerColumn(4, s5, io.channelD));

		this.quantizeButton = this.register(new QuantizeButton(s5.reports, io.quantize));
		this.tempoEncoder = this.register(new TempoEncoder(s5.reports, io.tempo));

		this.crossfader = this.register(
			new Pot('[Master]', 'crossfader', s5.reports, io.cross)
		);

		if (settings.softwareMixerMain) {
			this.master = this.register(
				new Pot('[Master]', 'gain', s5.reports, io.mainGain)
			);
		}
		if (settings.softwareMixerBooth) {
			this.booth = this.register(
				new Pot('[Master]', 'booth_gain', s5.reports, io.boothGain)
			);
		}
		if (settings.softwareMixerHeadphone) {
			this.cue = this.register(
				new Pot('[Master]', 'headMix', s5.reports, io.cueMix)
			);

			this.cueGain = this.register(
				new Pot('[Master]', 'headGain', s5.reports, io.cueGain)
			);
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
	}
}
