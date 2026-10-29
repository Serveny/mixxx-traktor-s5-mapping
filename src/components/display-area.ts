import type { S5DisplayArea as DisplayAreaMapping } from '../types/mapping';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import { PushButton } from './buttons/button';
import { PerformanceLeftButton } from './buttons/performance-left-button';
import { PerformanceRightButton } from './buttons/performance-right-button';
import {
	Component,
	InMixin,
	SingleColorOutMixin,
	OutMixin,
} from './component';
import type { HIDReportHodler } from '../hid-report';
import type { Btn as ButtonMapping } from '../types/mapping';
import { createCompContainer } from './component-container';
import type { S5Deck } from './s5-deck';

export const popupNames = {
	none: 'none',
	bpm: 'bpm',
	key: 'key',
	sliceSize: 'sliceSize',
	quantize: 'quantize',
} as const;

export type DisplayPopup = (typeof popupNames)[keyof typeof popupNames];

export class DisplayArea extends createCompContainer<MixxxChannelGroup>() {
	private deck: S5Deck;
	settingsButton: SettingsButton;
	displayButton1: PopupButton;
	displayButton2: PopupButton;
	perfModeLeftButton: PerformanceLeftButton;
	viewButton: ViewButton;
	displayButton3: PushButton;
	displayButton4: PushButton;
	perfModeRightButton: PerformanceRightButton;

	// Runtime variables
	isPlaylistSelected = false;
	isSorting = false;
	activePopup: DisplayPopup = popupNames.none;
	popupTimeoutMillis = 2000;
	private popupTimer = 0;

	constructor(deck: S5Deck, io: DisplayAreaMapping) {
		super(deck.group);
		this.deck = deck;

		this.settingsButton = this.register(
			new SettingsButton(deck.reports, io.settings),
			{ groupBound: true }
		);

		this.displayButton1 = this.register(
			new PopupButton(this, popupNames.bpm, deck.reports, io.display1),
			{ groupBound: true }
		);

		this.displayButton2 = this.register(
			new PopupButton(this, popupNames.key, deck.reports, io.display2),
			{ groupBound: true }
		);

		this.perfModeLeftButton = this.register(
			new PerformanceLeftButton(this, deck.reports, io.performanceModeLeft),
			{ groupBound: true }
		);

		// -- 🚜 S5 Docs 2.1.2
		// "Press the VIEW button. The display will return to Track view."
		this.viewButton = this.register(
			new ViewButton(this, deck.reports, io.view),
			{ groupBound: true }
		);

		// -- 🚜 S5 Docs 2.6
		// "To zoom into the waveform press Display Button 3"
		this.displayButton3 = this.register(
			new PushButton({
			group: this.group,
			inKey: 'waveform_zoom_down',
			outKey: 'waveform_zoom_down',
			reports: deck.reports,
			io: io.display3,
			}),
			{ groupBound: true }
		);

		// -- 🚜 S5 Docs 2.6
		// "To zoom out of the waveform press Display Button 4"
		this.displayButton4 = this.register(
			new PushButton({
			group: this.group,
			inKey: 'waveform_zoom_up',
			outKey: 'waveform_zoom_up',
			reports: deck.reports,
			io: io.display4,
			}),
			{ groupBound: true }
		);
		this.perfModeRightButton = this.register(
			new PerformanceRightButton(deck, io.performanceModeRight),
			{ groupBound: true }
		);

		this.triggerComponents();
	}

	rebindGroup(group: MixxxChannelGroup) {
		this.rebindGroupChildren(group);
	}

	openPopup(popup: Exclude<DisplayPopup, 'none'>, autoClose = true) {
		// -- 🚜 S5 Docs 2.8.2 / 2.9 / 3.3.2 / 3.5.3:
		// Keep exactly one popup lifecycle active per deck so encoder routing stays deterministic.
		if (this.popupTimer !== 0) {
			engine.stopTimer(this.popupTimer);
			this.popupTimer = 0;
		}
		if (this.activePopup === popup) {
			this.closePopup();
			return;
		}
		this.activePopup = popup;
		this.updatePopupOutputs();
		if (autoClose) {
			this.resetPopupTimer();
		}
	}

	closePopup() {
		if (this.popupTimer !== 0) {
			engine.stopTimer(this.popupTimer);
			this.popupTimer = 0;
		}
		this.activePopup = popupNames.none;
		this.updatePopupOutputs();
	}

	resetPopupTimer() {
		if (this.popupTimer !== 0) {
			engine.stopTimer(this.popupTimer);
		}
		this.popupTimer = engine.beginTimer(this.popupTimeoutMillis, () => {
			this.popupTimer = 0;
			this.closePopup();
		}, true);
	}

	popupForDisplayButton2() {
		// -- 🚜 S5 Docs 2.9 / 3.5.3:
		// Display Button 2 is context-sensitive: key on track decks, quantize in remix mode.
		return this.deck.performanceMode === 'remix'
			? popupNames.quantize
			: popupNames.key;
	}

	updatePopupOutputs() {
		this.displayButton1.output(this.activePopup === popupNames.bpm ? 1 : 0);
		this.displayButton2.output(
			this.activePopup === popupNames.key ||
				this.activePopup === popupNames.quantize
				? 1
				: 0
		);
		this.deck.publishScreenState();
	}

	setPlaylistStatus(isActive: boolean) {
		if (!isActive) {
			this.isSorting = false;
			this.perfModeLeftButton.output(0);
			engine.setValue('[Skin]', 'show_maximized_library', 0);
		}
		this.isPlaylistSelected = isActive;
	}

	togglePlaylistStatus() {
		this.setPlaylistStatus(!this.isPlaylistSelected);
	}
}

class PopupButton extends SingleColorOutMixin(InMixin(Component)) {
	constructor(
		private display: DisplayArea,
		private popup: Exclude<DisplayPopup, 'none'>,
		reports: HIDReportHodler,
		io: ButtonMapping
	) {
		super({ reports, io });
		this.output(0);
	}

	input(pressed: number) {
		if (!pressed) {
			return;
		}
		// -- 🚜 S5 Docs 2.8.2 / 2.9 / 3.5.3:
		// The physical button only selects popup mode; rendering is handled later by the display work.
		const popup =
			this.popup === popupNames.key ? this.display.popupForDisplayButton2() : this.popup;
		this.display.openPopup(popup);
	}
}

class SettingsButton extends SingleColorOutMixin(InMixin(Component)) {
	constructor(reports: HIDReportHodler, io: ButtonMapping) {
		super({ reports, io });
		this.output(0);
	}

	input(pressed: number) {
		if (!pressed) {
			return;
		}
		// -- 🚜 S5 Docs 4.2.1.1:
		// Until preferences are mapped explicitly, reuse the library layout toggle as a safe fallback.
		script.toggleControl('[Skin]', 'show_maximized_library');
	}
}

class ViewButton extends SingleColorOutMixin(InMixin(Component)) {
	constructor(
		private display: DisplayArea,
		reports: HIDReportHodler,
		io: ButtonMapping
	) {
		super({ reports, io });
	}

	input(pressed: number) {
		if (!pressed) {
			return;
		}
		// -- 🚜 S5 Docs 2.1.2 / 2.8.2 / 2.9:
		// VIEW should dismiss transient popup modes without also changing the browser layout.
		if (this.display.activePopup !== popupNames.none) {
			this.display.closePopup();
			return;
		}
		this.display.closePopup();
		script.toggleControl('[Skin]', 'show_maximized_library');
	}
}
