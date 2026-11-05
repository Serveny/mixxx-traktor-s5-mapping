import { TouchEncoder } from './encoder';
import type { TouchEncoder as EncoderMapping } from '../../types/mapping';
import { S5Deck } from '../s5-deck';
import { settings } from '../../settings';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';

export class loopEncoder extends TouchEncoder<MixxxChannelGroup> {
	// -- 🚜 S5 Docs 2.1.5
	// "you can sort the tracks by categories TITLE, ARTIST, BPM, IMPORT DATE, #, and KEY"
	sortCategories = [2, 1, 15, 17, 9, 20];
	sortCategoryIdx = 0;
	private isFluxLoopHeld = false;

	constructor(
		private deck: S5Deck,
		io: EncoderMapping
	) {
		super(deck.group, 'loop_in', deck.reports, io);
	}

	onChange(isRight: boolean) {
		// -- 🚜 S5 Docs 2.1.5
		// "Rotate the LOOP encoder until the desired category is selected in the SORT BY pop-up window. The tracks will then be resorted."
		if (this.deck.display.activePopup === 'browser' && this.deck.browser.isSorting) {
			this.deck.browser.cycleSortColumn(isRight ? 1 : -1);
		}
		else if (this.deck.display.activePopup === 'browser' && this.deck.browser.isPreviewMode) {
			this.deck.browser.seekPreview(isRight ? 1 : -1);
		}
		else if (this.deck.display.isSorting) {
			this.switchSortCategory(isRight);
		}
		else if (this.deck.mixer.auxButton.isHeld) {
			// -- 🚜 S5 Docs 4.4.2.8: while AUX is held, the left/right LOOP encoder sets the AUX 1/2 volume.
			const aux = this.deck.decks[0] === 1 ? '[Auxiliary1]' : '[Auxiliary2]';
			const volume = engine.getValue(aux, 'volume') + (isRight ? 0.05 : -0.05);
			engine.setValue(aux, 'volume', Math.max(0, Math.min(1, volume)));
		}
		else if (this.deck.display.activePopup === 'beatgrid') {
			// -- 🚜 S5 Docs 3.9.2: the LOOP encoder adjusts the selected beatgrid parameter.
			this.deck.display.beatgrid.turn(isRight ? 1 : -1);
		}
		else if (this.deck.performanceMode === 'remix' && this.deck.remix.remixButtonHeld) {
			// -- 🚜 S5 Docs 3.5.2: "hold the REMIX button while turning the Deck's LOOP encoder" to change the page.
			this.deck.remix.scroll(isRight ? 1 : -1);
			this.deck.refreshModePads();
		}
		else if (this.deck.isStemMode() && this.deck.stems.page === 'filter' && this.deck.stems.hasSelection()) {
			// -- 🚜 S5 Docs 3.8.3: "Rotate the LOOP encoder to apply a high-pass or a low-pass filter."
			this.deck.stems.adjustFilter(isRight ? 1 : -1);
		}
		else if (this.deck.display.activePopup === 'sliceSize') {
			// -- 🚜 S5 Docs 3.3.2:
			// While SLICE SIZE is held open, loop turns should not leak into beatloop controls.
			this.deck.adjustSliceSize(isRight ? 1 : -1);
		}
		else if (this.deck.loopMoveMode) {
			const moveFactor = this.isShifted
				? settings.loopEncoderShiftMoveFactor
				: settings.loopEncoderMoveFactor;
			const delta = isRight ? moveFactor : -moveFactor;
			for (const key of ['loop_start_position', 'loop_end_position'] as const) {
				engine.setValue(this.group, key, engine.getValue(this.group, key) + delta);
			}
		} else if (this.isShifted) {
			// -- 🚜 S5 Docs 3.2.2:
			// Shift turns reuse the currently selected loop size as the beatjump distance.
			const size = this.deck.currentLoopSize();
			engine.setValue(
				this.group,
				`beatjump_${size}_${isRight ? 'forward' : 'backward'}`,
				1
			);
		} else {
			// -- 🚜 S5 Docs 3.2.1:
			// Unshifted turns walk the fixed S5 loop size preset list.
			this.deck.adjustLoopSize(isRight ? 1 : -1);
		}
	}

	private isFluxActive() {
		return (
			!this.isShifted &&
			!this.deck.display.isSorting &&
			this.deck.display.activePopup !== 'browser' &&
			engine.getValue(this.group, 'slip_enabled') !== 0
		);
	}

	private switchSortCategory(isRight: boolean) {
		const len = this.sortCategories.length;
		const change = isRight ? 1 : -1;
		this.sortCategoryIdx = (this.sortCategoryIdx + change + len) % len;
		const newCat = this.sortCategories[this.sortCategoryIdx];
		engine.setValue('[Library]', 'sort_column', newCat);
	}

	onTouch(pressed: number): void {
		// -- 🚜 S5 Docs 3.3.2:
		// Freeze + loop touch temporarily hands the encoder over to slice-size selection.
		if (this.deck.freezeButton.isPressed && pressed) {
			this.deck.display.openPopup('sliceSize', false);
			return;
		}
		if (!pressed && this.deck.display.activePopup === 'sliceSize') {
			this.deck.display.closePopup();
		}
	}

	// originally onShortPress
	onPress(pressed: number): void {
		if (this.isFluxLoopHeld || (pressed && this.isFluxActive())) {
			// -- 🚜 S5 Docs 4.2.8:
			// "You cannot permanently engage a loop when Flux mode is active. The loop only remains
			// engaged for as long as you hold the Loop encoder and turns off again when released."
			this.isFluxLoopHeld = pressed !== 0;
			engine.setValue(this.group, 'beatlooproll_activate', pressed ? 1 : 0);
			return;
		}
		if (!pressed) {
			return;
		}
		// -- 🚜 S5 Docs 2.1.5:
		// "Press the LOOP encoder to switch between ascending and descending order"
		if (this.deck.display.activePopup === 'browser' && this.deck.browser.isSorting) {
			this.deck.browser.toggleSortOrder();
		}
		else if (this.deck.display.activePopup === 'browser' && this.deck.browser.isPreviewMode) {
			this.deck.browser.togglePreview();
		}
		else if (this.deck.display.isSorting) {
			script.toggleControl('[Library]', 'sort_order');
		}
		else if (!this.isShifted && this.deck.isStemMode() && this.deck.stems.page === 'filter' && this.deck.stems.hasSelection()) {
			// -- 🚜 S5 Docs 3.8.3: "Press the LOOP encoder to activate FILTER on the Stem Part."
			this.deck.stems.toggleFilter();
		}
		else if (!this.isShifted && this.deck.performanceMode === 'freeze') {
			// -- 🚜 S5 Docs 4.2.3.2: "A press on the LOOP button while in Freeze mode" toggles Slicer mode.
			this.deck.freezeSlicer.toggleSlicer();
			this.deck.redrawPads();
		}
		else if (!this.isShifted) {
			script.triggerControl(this.group, 'beatloop_activate', 50);
		} else {
			script.triggerControl(this.group, 'reloop_toggle', 50);
		}
	}
}
