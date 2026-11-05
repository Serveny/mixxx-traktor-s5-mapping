import type { Btn as ButtonMapping } from '../../types/mapping';
import { Component, InMixin, SingleColorOutMixin } from '../component';
import type { ComponentOptions } from '../../types/component';
import type { DisplayArea } from '../display-area';
import type { HIDReportHolder } from '../../hid-report';

export class PerformanceLeftButton extends SingleColorOutMixin(
	InMixin(Component<ComponentOptions>)
) {
	constructor(
		private display: DisplayArea,
		reports: HIDReportHolder,
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
		// -- 🚜 S5 Docs 3.9.2: "Press the Performance Mode buttons to select the desired parameter OFFSET, BPM, FINE, or SCAN"
		if (this.display.activePopup === 'beatgrid') {
			if (pressed) this.display.beatgrid.cycle(-1);
			return;
		}
		// -- 🚜 S5 Docs 3.8.3: "Press the Performance Mode buttons until the VOLUME page is selected"
		if (pressed && this.display.deck.isStemMode()) {
			this.display.deck.stems.togglePage();
			return;
		}
		if (this.display.activePopup === 'browser') {
			if (pressed) this.display.deck.browser.toggleSorting();
			return;
		}
		if (!pressed || !this.display.isPlaylistSelected) return;
		this.display.isSorting = !this.display.isSorting;
		this.output(this.display.isSorting ? 1 : 0);
	}
}
