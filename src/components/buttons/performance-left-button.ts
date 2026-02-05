import type { Btn as ButtonMapping } from '../../types/mapping';
import type { S5Deck } from '../s5-deck';
import { Component, InMixin, SingleColorOutMixin } from '../component';
import type { ComponentOptions } from '../../types/component';
import type { DisplayArea } from '../display-area';
import type { HIDReportHodler } from '../../hid-report';

export class PerformanceLeftButton extends SingleColorOutMixin(
	InMixin(Component<ComponentOptions>)
) {
	constructor(
		private display: DisplayArea,
		reports: HIDReportHodler,
		io: ButtonMapping
	) {
		super({
			reports,
			io,
		});
		this.output(0);
	}

	// -- 🚜 S5 Docs 2.1.5
	// "Press the left Performance Mode button to enable SORT BY in the left bottom on the display"
	input(pressed: number) {
		if (!pressed || !this.display.isPlaylistSelected) return;
		this.display.isSorting = !this.display.isSorting;
		this.output(this.display.isSorting ? 1 : 0);
	}
}
