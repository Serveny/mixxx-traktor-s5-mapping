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
		const level =
			!isOn || this.deck.performanceMode !== 'hotcue'
				? ButtonBrightnessOff
				: this.deck.hotcuePage === 1
					? ButtonBrightnessOn
					: this.deck.hotcuePage === 2
						? 96
						: 64;
		if (this.deck.currentDeckIdx === 0)
			this.outputDoubleColor(0, level);
		else
			this.outputDoubleColor(level, 0);
	}

	onShortPress() {
		// -- 🚜 S5 Docs 2.7:
		// Re-enter hotcue mode on page 1 from other performance modes, then cycle on repeated presses.
		if (this.deck.performanceMode !== 'hotcue') {
			this.deck.hotcuePage = 1;
			this.deck.setPerformanceMode('hotcue');
			return;
		}
		this.deck.cycleHotcuePage();
	}
}
