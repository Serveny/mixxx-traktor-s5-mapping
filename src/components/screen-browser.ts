import { channels, settings } from '../settings';
import { hasScreenApi } from '../screen-state';
import { popupNames } from './display-area';
import type { S5Deck } from './s5-deck';

// -- 🚜 S5 Docs 2.1.5: "TITLE, ARTIST, BPM, IMPORT DATE, #, and KEY".
// Mixxx has no import date for every folder; "#" is the order in Mixxx's library (playlist order).
// The order must match the sort columns in BrowserView.qml.
const browserSortColumns = ['TITLE', 'ARTIST', 'BPM', '#', 'KEY'] as const;
const defaultSortColumn = browserSortColumns.indexOf('#');

// Rows moved per detent while SHIFT is held.
const fastScrollRows = 8;
// A browser opened by touch closes this long after the last interaction once the finger is off.
const touchCloseDelayMillis = 3000;

// -- 🚜 S5 Docs 2.1: the Browser on the deck display.
// The folders and tracks live in the screen QML (Mixxx's library sidebar); the mapping owns the
// open/close state and sends scroll, open/load, back, preview and sort requests through the screen state.
export class ScreenBrowser {
	scrollRequest = 0;
	activateRequest = 0;
	backRequest = 0;
	previewRequest = 0;
	isSorting = false;
	sortColumn = defaultSortColumn;
	sortDescending = false;
	isPreviewMode = false;
	private openedByTouch = false;
	private closeTimer = 0;

	constructor(private deck: S5Deck) {
		// -- 🚜 S5 Docs 2.2.1: after loading "Its waveform and info appear in the display."
		// Only the screen knows whether BROWSE opened a folder or loaded a track, so a load closes the browser.
		for (const group of channels) {
			engine.makeConnection(group, 'track_loaded', (loaded) => {
				if (loaded && group === this.deck.group) this.close();
			});
		}
	}

	// Without the shared-data API the screens can't show a browser; the mapping falls back to the Mixxx GUI library.
	get enabled() {
		return hasScreenApi();
	}

	get isOpen() {
		return this.deck.display.activePopup === popupNames.browser;
	}

	// -- 🚜 S5 Docs 2.1.1: "Push the BROWSE encoder. The Browser will be displayed in the display."
	// -- 🚜 S5 Docs 2.1: "It is not possible to open the Browser on S5's left and right Decks simultaneously."
	open() {
		if (this.isOpen) return;
		this.deck.otherSide?.browser.close();
		this.openedByTouch = false;
		this.deck.display.openPopup(popupNames.browser, false);
	}

	close() {
		if (!this.isOpen) return;
		this.deck.display.closePopup();
	}

	// Called by DisplayArea whenever the browser pop-up closes (VIEW, BACK, deck switch, mode change).
	onClosed() {
		this.stopCloseTimer();
		this.isSorting = false;
		this.isPreviewMode = false;
		this.openedByTouch = false;
		this.deck.display.perfModeLeftButton.output(0);
	}

	// -- 🚜 S5 Docs 2.1.2: "Rotate the BROWSE encoder."
	scroll(direction: 1 | -1, fast: boolean) {
		this.scrollRequest += direction * (fast ? fastScrollRows : 1);
		this.keepOpen();
		this.deck.publishScreenState();
	}

	// -- 🚜 S5 Docs 2.1.2: "Press the BROWSE encoder to open a folder." / "Press the BROWSE encoder to load a track."
	activate() {
		this.activateRequest++;
		this.keepOpen();
		this.deck.publishScreenState();
	}

	// -- 🚜 S5 Docs 2.1.2: "To return to the previous folder: Press the BACK button."
	back() {
		this.backRequest++;
		this.keepOpen();
		this.deck.publishScreenState();
	}

	// -- 🚜 S5 Docs 2.1.3: with "Auto Open Browser on Touch", touching opens the Browser;
	// "Release the BROWSE encoder or stop interacting in the Browser" closes it again.
	touch(touched: boolean) {
		if (!settings.autoOpenBrowserOnTouch) return;
		if (touched) {
			this.stopCloseTimer();
			if (!this.isOpen && this.deck.display.activePopup === popupNames.none) {
				this.open();
				this.openedByTouch = true;
			}
		} else if (this.openedByTouch && this.isOpen) {
			this.startCloseTimer();
		}
	}

	// Any interaction restarts a pending close.
	private keepOpen() {
		if (this.closeTimer !== 0) this.startCloseTimer();
	}

	private startCloseTimer() {
		this.stopCloseTimer();
		this.closeTimer = engine.beginTimer(touchCloseDelayMillis, () => {
			this.closeTimer = 0;
			this.close();
		}, true);
	}

	private stopCloseTimer() {
		if (this.closeTimer !== 0) {
			engine.stopTimer(this.closeTimer);
			this.closeTimer = 0;
		}
	}

	// -- 🚜 S5 Docs 2.1.5: "Press the left Performance Mode button to enable SORT BY".
	toggleSorting() {
		this.isSorting = !this.isSorting;
		this.deck.display.perfModeLeftButton.output(this.isSorting ? 1 : 0);
		this.keepOpen();
		this.deck.publishScreenState();
	}

	// -- 🚜 S5 Docs 2.1.5: "Rotate the LOOP encoder until the desired category is selected".
	cycleSortColumn(direction: 1 | -1) {
		const count = browserSortColumns.length;
		this.sortColumn = (this.sortColumn + direction + count) % count;
		this.keepOpen();
		this.deck.publishScreenState();
	}

	// -- 🚜 S5 Docs 2.1.5: "Press the LOOP encoder to switch between ascending and descending order."
	toggleSortOrder() {
		this.sortDescending = !this.sortDescending;
		this.keepOpen();
		this.deck.publishScreenState();
	}

	// -- 🚜 S5 Docs 2.1.4: "Press the right Performance Mode button to enable PREVIEW".
	togglePreviewMode() {
		this.isPreviewMode = !this.isPreviewMode;
		if (!this.isPreviewMode) engine.setValue('[PreviewDeck1]', 'play', 0);
		this.keepOpen();
		this.deck.publishScreenState();
	}

	// -- 🚜 S5 Docs 2.1.4: "Press the LOOP encoder to start preview of the selected track."
	togglePreview() {
		if (engine.getValue('[PreviewDeck1]', 'play')) {
			engine.setValue('[PreviewDeck1]', 'play', 0);
			return;
		}
		this.previewRequest++;
		this.keepOpen();
		this.deck.publishScreenState();
	}

	// -- 🚜 S5 Docs 2.1.4: "Rotate LOOP encoder to seek within the track in preview."
	seekPreview(direction: 1 | -1) {
		engine.setValue('[PreviewDeck1]', 'beatjump', direction * 16);
		this.keepOpen();
	}
}
