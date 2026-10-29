import { ButtonBrightnessOff, ButtonBrightnessOn } from '../../settings';
import type { BytePosInOut } from '../../types/mapping';
import {
	Component,
	DoubleColorOutMixin,
	InMixin,
	OutMixin,
} from '../component';
import type { S5Deck } from '../s5-deck';

export class RemixModeButton extends DoubleColorOutMixin(
	OutMixin(InMixin(Component))
) {
	constructor(
		private deck: S5Deck,
		io: BytePosInOut
	) {
		super({
			reports: deck.reports,
			io,
		});
		this.output(0);
	}

	output(isOn: number) {
		if (this.deck.currentDeckIdx === 0) {
			this.outputDoubleColor(0, isOn ? ButtonBrightnessOn : ButtonBrightnessOff);
		} else {
			this.outputDoubleColor(isOn ? ButtonBrightnessOn : ButtonBrightnessOff, 0);
		}
	}

	input(pressed: number) {
		// -- 🚜 S5 Docs 3.5.4: holding REMIX turns the pads into slot mute buttons.
		this.deck.remix.remixButtonHeld = pressed !== 0;
		this.deck.remix.invalidate();
		if (pressed && this.deck.performanceMode !== 'remix') {
			this.deck.setPerformanceMode('remix');
		}
		this.deck.refreshModePads();
	}
}
