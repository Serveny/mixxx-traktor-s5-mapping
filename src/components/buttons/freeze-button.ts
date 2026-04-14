import { ButtonBrightnessOff, ButtonBrightnessOn } from '../../settings';
import type { BytePosInOut } from '../../types/mapping';
import {
	Component,
	DoubleColorOutMixin,
	InMixin,
	OutMixin,
} from '../component';
import type { S5Deck } from '../s5-deck';

export class FreezeButton extends DoubleColorOutMixin(
	OutMixin(InMixin(Component))
) {
	isPressed = false;
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

	// -- 🚜 S5 Docs 2.5:
	// "If Deck A,B is focused the FREEZE button will be lit in blue. If Deck C,D is focused, the DECK button be lit in white."
	output(isOn: number) {
		if (this.deck.currentDeckIdx === 0)
			this.outputDoubleColor(
				0,
				isOn ? ButtonBrightnessOn : ButtonBrightnessOff
			);
		else
			this.outputDoubleColor(
				isOn ? ButtonBrightnessOn : ButtonBrightnessOff,
				0
			);
	}

	input(pressed: number) {
		this.isPressed = pressed !== 0;
		if (pressed) {
			this.deck.setPerformanceMode('freeze');
		}
		if (!pressed && this.deck.display.activePopup === 'sliceSize') {
			this.deck.display.closePopup();
		}
	}
}
