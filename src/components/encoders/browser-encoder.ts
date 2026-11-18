import { settings } from '../../settings';
import { TouchEncoder } from './encoder';
import type { S5Deck } from '../s5-deck';
import type { TouchEncoder as EncoderMapping } from '../../types/mapping';
import type { DisplayPopup } from '../display-area';

const libraryFocus = {
	none: 0,
	sidebar: 2,
	tracksTable: 3,
	contextMenu: 4,
	dialog: 5,
} as const;

export class BrowserEncoder extends TouchEncoder<'[Library]'> {
	constructor(
		private deck: S5Deck,
		io: EncoderMapping
	) {
		super('[Library]', 'MoveFocus', deck.reports, io);
	}

	onChange(isRight: boolean) {
		const popup = this.deck.display.activePopup;
		if (popup !== 'none') {
			this.handlePopupChange(isRight, popup);
			return;
		}

		if (this.deck.isStemMode() && this.deck.stems.page === 'volume' && this.deck.stems.hasSelection()) {
			// -- 🚜 S5 Docs 3.8.3: "Rotate the BROWSE encoder to adjust the volume of Stem Part 1."
			this.deck.stems.adjustVolume(isRight ? 1 : -1);
			return;
		}

		const focused = engine.getValue('[Library]', 'focused_widget');
		const targetFocus = this.isShifted
			? libraryFocus.sidebar
			: libraryFocus.tracksTable;

		if (focused === libraryFocus.none) {
			engine.setValue(
				'[Playlist]',
				this.isShifted
					? isRight
						? 'SelectNextPlaylist'
						: 'SelectPrevPlaylist'
					: isRight
						? 'SelectNextTrack'
						: 'SelectPrevTrack',
				1
			);
			this.deck.display.isPlaylistSelected =
				targetFocus === libraryFocus.tracksTable;
			return;
		}

		if (
			focused !== libraryFocus.contextMenu &&
			focused !== libraryFocus.dialog
		) {
			this.deck.display.isPlaylistSelected =
				targetFocus === libraryFocus.tracksTable;
		}

		if (
			focused !== libraryFocus.contextMenu &&
			focused !== libraryFocus.dialog &&
			focused !== targetFocus
		) {
			engine.setValue('[Library]', 'focused_widget', targetFocus);
		}

		engine.setValue('[Library]', isRight ? 'MoveDown' : 'MoveUp', 1);

	}

	private handlePopupChange(isRight: boolean, popup: Exclude<DisplayPopup, 'none'>) {
		if (popup === 'browser') {
			// -- 🚜 S5 Docs 2.1.2: "Rotate the BROWSE encoder. The selected entry will be highlighted"
			this.deck.browser.scroll(isRight ? 1 : -1, this.isShifted);
			return;
		}

		if (popup === 'bpm') {
			// -- 🚜 S5 Docs 2.8.2:
			// BPM popup mirrors deck tempo nudging on the browse encoder while it is visible.
			const currentBpm = engine.getValue(this.deck.group, 'bpm');
			const step = this.isShifted ? 1 : 0.1;
			engine.setValue(this.deck.group, 'bpm', currentBpm + (isRight ? step : -step));
			this.deck.display.resetPopupTimer();
			return;
		}

		if (popup === 'key') {
			// -- 🚜 S5 Docs 2.9:
			// Only apply semitone steps once Keylock is on, matching the staged Traktor workflow.
			if (engine.getValue(this.deck.group, 'keylock')) {
				engine.setValue(this.deck.group, isRight ? 'pitch_up' : 'pitch_down', 1);
			}
			this.deck.display.resetPopupTimer();
			return;
		}

		if (popup === 'quantize') {
			// -- 🚜 S5 Docs 3.5.3:
			// Quantize selection is deck-local controller state until remix playback wiring exists.
			this.deck.adjustQuantizeSize(isRight ? 1 : -1);
			this.deck.display.resetPopupTimer();
		}
	}

	onTouch(pressed: number): void {
		if (this.deck.browser.enabled) {
			this.deck.browser.touch(pressed !== 0);
			return;
		}
		const focused = engine.getValue('[Library]', 'focused_widget');
		this.deck.display.isPlaylistSelected = focused === libraryFocus.tracksTable;

		if (
			!pressed ||
			this.deck.display.isPlaylistSelected ||
			focused === libraryFocus.sidebar ||
			!settings.autoOpenBrowserOnTouch
		)
			return;
		engine.setValue('[Library]', 'focused_widget', libraryFocus.tracksTable);
	}

	onPress(pressed: number): void {
		if (!pressed) return;

		if (this.deck.display.activePopup === 'beatgrid') return;

		if (this.deck.display.activePopup === 'key') {
			// -- 🚜 S5 Docs 2.9:
			// Pressing browse inside KEY mode toggles Keylock instead of loading a library item.
			script.toggleControl(this.deck.group, 'keylock');
			this.deck.display.resetPopupTimer();
			return;
		}

		if (this.deck.isStemMode() && this.deck.stems.page === 'volume' && this.deck.stems.hasSelection()) {
			// -- 🚜 S5 Docs 3.8.3: "Press the BROWSE encoder to reset the volume to maximum level."
			this.deck.stems.resetVolume();
			return;
		}

		if (this.deck.display.activePopup === 'browser') {
			this.deck.browser.activate();
			return;
		}

		if (this.deck.browser.enabled) {
			this.deck.browser.open();
			return;
		}

		const focused = engine.getValue('[Library]', 'focused_widget');
		if (focused === libraryFocus.tracksTable) {
			this.deck.display.isPlaylistSelected = true;
		} else if (focused === libraryFocus.sidebar) {
			this.deck.display.isPlaylistSelected = false;
		}

		// -- 🚜 S5 Docs 2.1.2
		// "Press the BROWSE encoder to load a track"
		if (this.deck.display.isPlaylistSelected) {
			engine.setValue(this.deck.group, 'LoadSelectedTrack', 1);

			// -- 🚜 S5 Docs 2.7
			// "On a Track Deck in HOTCUE mode, pad 1 always represents the Start Cue Point that will be assigned automatically as soon as a track is loaded."
			if (engine.getValue(this.deck.group, 'hotcue_1_status') === 0)
				engine.setValue(this.deck.group, 'hotcue_1_activate', 1);
			this.deck.display.setPlaylistStatus(false);
		}

		// -- 🚜 S5 Docs 2.1.2
		// "Press the BROWSE encoder to open a folder."
		else {
			engine.setValue('[Library]', 'focused_widget', libraryFocus.tracksTable);
			this.deck.display.setPlaylistStatus(true);
		}

	}
}
