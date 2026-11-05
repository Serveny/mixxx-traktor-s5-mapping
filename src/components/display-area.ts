import type { S5DisplayArea as DisplayAreaMapping } from '../types/mapping';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import { PushButton } from './buttons/button';
import { PerformanceLeftButton } from './buttons/performance-left-button';
import { PerformanceRightButton } from './buttons/performance-right-button';
import { Component, InMixin, SingleColorOutMixin } from './component';
import type { HIDReportHolder } from '../hid-report';
import type { Btn as ButtonMapping } from '../types/mapping';
import { ComponentContainer } from './component-container';
import type { S5Deck } from './s5-deck';
import { BeatgridMode } from './beatgrid-mode';

export const popupNames = {
	none: 'none',
	bpm: 'bpm',
	key: 'key',
	sliceSize: 'sliceSize',
	quantize: 'quantize',
	beatgrid: 'beatgrid',
	browser: 'browser',
} as const;

export type DisplayPopup = (typeof popupNames)[keyof typeof popupNames];

export class DisplayArea extends ComponentContainer<MixxxChannelGroup> {
	readonly deck: S5Deck;
	settingsButton: SettingsButton;
	displayButton1: PopupButton;
	displayButton2: PopupButton;
	perfModeLeftButton: PerformanceLeftButton;
	viewButton: ViewButton;
	displayButton3: ZoomOrScrollButton;
	displayButton4: ZoomOrScrollButton;
	perfModeRightButton: PerformanceRightButton;

	// Runtime variables
	isPlaylistSelected = false;
	isSorting = false;
	activePopup: DisplayPopup = popupNames.none;
	beatgrid: BeatgridMode;
	popupTimeoutMillis = 2000;
	private popupTimer = 0;

	constructor(deck: S5Deck, io: DisplayAreaMapping) {
		super(deck.group);
		this.deck = deck;
		this.beatgrid = new BeatgridMode(deck);

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
			new ZoomOrScrollButton(deck, -1, {
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
			new ZoomOrScrollButton(deck, 1, {
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
		this.setActivePopup(popup);
		if (autoClose) {
			this.resetPopupTimer();
		}
	}

	closePopup() {
		if (this.popupTimer !== 0) {
			engine.stopTimer(this.popupTimer);
			this.popupTimer = 0;
		}
		this.setActivePopup(popupNames.none);
	}

	private setActivePopup(popup: DisplayPopup) {
		const closesBrowser = this.activePopup === popupNames.browser && popup !== popupNames.browser;
		this.activePopup = popup;
		if (closesBrowser) this.deck.browser.onClosed();
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
		this.viewButton.flash(this.activePopup !== popupNames.none);
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
		reports: HIDReportHolder,
		io: ButtonMapping
	) {
		super({ reports, io });
		this.output(0);
	}

	input(pressed: number) {
		if (!pressed) {
			return;
		}
		if (this.display.activePopup === popupNames.beatgrid) {
			// -- 🚜 S5 Docs 3.9.3: "Press Display Button 1 (LOCK)." Display Button 2 (Tick) is not available.
			if (this.popup === popupNames.bpm && !this.display.deck.isShifted) this.display.beatgrid.lock();
			else if (this.popup === popupNames.bpm) this.display.closePopup();
			return;
		}
		if (this.popup === popupNames.bpm && this.display.deck.isShifted) {
			// -- 🚜 S5 Docs 3.9.2: "Press the SHIFT button and the Display Button 1. The Beatgrid mode opens in the display."
			this.display.openPopup(popupNames.beatgrid, false);
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
	constructor(reports: HIDReportHolder, io: ButtonMapping) {
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
	private blinkTimer = 0;
	private blinkOn = false;

	constructor(
		private display: DisplayArea,
		reports: HIDReportHolder,
		io: ButtonMapping
	) {
		super({ reports, io });
	}

	// -- 🚜 S5 Docs 4.2.1.4: "Whenever you open a pop-up from a Deck view [...] the View button starts flashing."
	flash(on: boolean) {
		if (on && this.blinkTimer === 0) {
			this.blinkTimer = engine.beginTimer(250, () => {
				this.blinkOn = !this.blinkOn;
				this.output(this.blinkOn ? 1 : 0);
			});
		} else if (!on && this.blinkTimer !== 0) {
			engine.stopTimer(this.blinkTimer);
			this.blinkTimer = 0;
		}
		this.blinkOn = on;
		this.output(on ? 1 : 0);
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
		script.toggleControl('[Skin]', 'show_maximized_library');
	}
}

// -- 🚜 S5 Docs 4.2.1.2: Display Buttons 3/4 zoom the waveform on Track Decks and
// "scroll up/down in the Sample Grid in steps of two" in REMIX mode.
class ZoomOrScrollButton extends PushButton {
	constructor(
		private deck: S5Deck,
		private direction: 1 | -1,
		options: ConstructorParameters<typeof PushButton>[0]
	) {
		super(options);
	}

	input(pressed: number) {
		if (this.deck.display.activePopup === popupNames.beatgrid) {
			// -- 🚜 S5 Docs 3.9.3: Display Button 3 = TAP, Display Button 4 = RST.
			if (pressed && this.direction < 0) this.deck.display.beatgrid.tap();
			else if (pressed) this.deck.display.beatgrid.reset();
			return;
		}
		if (this.deck.performanceMode === 'remix' && !this.deck.stems.available()) {
			if (pressed) {
				this.deck.remix.scroll(this.direction);
				this.deck.refreshModePads();
			}
			return;
		}
		super.input(pressed);
	}
}
