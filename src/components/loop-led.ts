import { ButtonBrightnessOff, ButtonBrightnessOn } from '../settings';
import type { ControlOutOptions } from '../types/component';
import type { Meter } from '../types/mapping';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import { ControlComponent, ControlOutMixin } from './component';
import type { S5Deck } from './s5-deck';

// -- 🚜 S5 Docs 3.2.1 / 4.2.8:
// "The LED next to the LOOP encoder flashes to indicate the loop is activated."
// Blue on Deck A/B, white on Deck C/D.
export class LoopLed extends ControlOutMixin(
	ControlComponent<MixxxChannelGroup, ControlOutOptions<MixxxChannelGroup>>
) {
	declare group: MixxxChannelGroup;
	private blinkTimer = 0;
	private blinkOn = false;

	constructor(
		private deck: S5Deck,
		io: Meter
	) {
		super({ group: deck.group, outKey: 'loop_enabled', reports: deck.reports, io });
	}

	output(loopEnabled: number) {
		if (loopEnabled && this.blinkTimer === 0) {
			this.blinkTimer = engine.beginTimer(250, () => {
				this.blinkOn = !this.blinkOn;
				this.render(this.blinkOn);
			});
		} else if (!loopEnabled && this.blinkTimer !== 0) {
			engine.stopTimer(this.blinkTimer);
			this.blinkTimer = 0;
		}
		this.blinkOn = loopEnabled !== 0;
		this.render(this.blinkOn);
	}

	private render(on: boolean) {
		const level = on ? ButtonBrightnessOn : ButtonBrightnessOff;
		const isPrimaryDeck = this.deck.currentDeckIdx === 0;
		this.outReport.data[this.io.outByte] = isPrimaryDeck ? 0 : level;
		this.outReport.data[this.io.outByte + 1] = isPrimaryDeck ? level : 0;
		this.outReport.send();
	}
}
