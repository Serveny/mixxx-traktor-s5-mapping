import { ButtonBrightnessOff, ButtonBrightnessOn } from '../../settings';
import type { BytePosInOut } from '../../types/mapping';
import {
	Component,
	DoubleColorOutMixin,
	InMixin,
	LongPressMixin,
	OutMixin,
	ShiftMixin,
} from '../component';
import type { S5Deck } from '../s5-deck';

export class HotcueModeButton extends DoubleColorOutMixin(
	LongPressMixin(ShiftMixin(OutMixin(InMixin(Component))))
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

	// -- 🚜 S5 Docs 2.5:
	// "If Deck A,B is focused the HOTCUE button will be lit in blue. If Deck C,D is focused, the DECK button be lit in white."
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

	onShortPress() {
		// TODO
		//if (!this.isShifted) {
		//if (this.deck.currentPadLayer !== this.deck.padLayers.hotcuePage2) {
		//switchPadLayer(this.deck, hotcuePage2);
		//this.deck.currentPadLayer = this.deck.padLayers.hotcuePage2;
		//} else {
		//switchPadLayer(this.deck, defaultPadLayer);
		//this.deck.currentPadLayer = this.deck.padLayers.defaultLayer;
		//}
		//this.deck.lightPadMode();
		//} else {
		//switchPadLayer(this.deck, hotcuePage3);
		//this.deck.currentPadLayer = this.deck.padLayers.hotcuePage3;
		//this.deck.lightPadMode();
		//}
	}
}
