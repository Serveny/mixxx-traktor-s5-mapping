import type { Btn } from '../../types/mapping';
import { Component, InMixin, ShiftMixin, SingleColorOutMixin } from '../component';
import type { S5Deck } from '../s5-deck';

export class ShiftButton extends SingleColorOutMixin(
	ShiftMixin(InMixin(Component))
) {
	constructor(
		private deck: S5Deck,
		io: Btn
	) {
		super({
			reports: deck.reports,
			io,
		});
	}

	onUnshift() {
		this.output(0);
	}

	onShift() {
		this.output(1);
	}

	input(pressed: number) {
		if (pressed) this.deck.shift();
		else this.deck.unshift();
	}
}
