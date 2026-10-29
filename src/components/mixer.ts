import type { S5 } from '../s5';
import { ButtonBrightnessOn, settings } from '../settings';
import type { S5MixerMapping } from '../types/mapping';
// import { FXSelect } from './buttons/fx-select-button';
import { QuantizeButton } from './buttons/quantize-button';
import { AuxButton } from './buttons/aux-button';
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
	auxButton: AuxButton;
	tempoEncoder: TempoEncoder;
	crossfader: Pot<'[Master]'>;
	master?: Pot<'[Master]'>;
	booth?: Pot<'[Master]'>;
	cue?: Pot<'[Master]'>;
	cueGain?: Pot<'[Master]'>;

	private lastMainLevel = [-1, -1];

	constructor(
		private s5: S5,
		private io: S5MixerMapping
	) {
		super('[Master]');

		this.channelC = this.register(new S5MixerColumn(3, s5, io.channelC));
		this.channelA = this.register(new S5MixerColumn(1, s5, io.channelA));
		this.channelB = this.register(new S5MixerColumn(2, s5, io.channelB));
		this.channelD = this.register(new S5MixerColumn(4, s5, io.channelD));

		this.quantizeButton = this.register(new QuantizeButton(s5.reports, io.quantize));
		this.auxButton = this.register(new AuxButton(s5.reports, io.aux));
		this.tempoEncoder = this.register(
			new TempoEncoder(s5.reports, io.tempo, () => s5.deckLeft.isShifted || s5.deckRight.isShifted)
		);

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

	// -- 🚜 S5 Docs 4.4.2.7:
	// The MAIN meters are driven by the hardware; only their top (clip) LEDs are addressable.
	// Returns true when the report changed.
	updateMainLevel(): boolean {
		const report = this.s5.reports.out[this.io.mainLevel.outReportId];
		let changed = false;
		(['peak_indicator_left', 'peak_indicator_right'] as const).forEach((key, i) => {
			const level = engine.getValue('[Main]', key) ? ButtonBrightnessOn : 0;
			if (level === this.lastMainLevel[i]) return;
			this.lastMainLevel[i] = level;
			report.data[this.io.mainLevel.outByte + i] = level;
			changed = true;
		});
		return changed;
	}
}
