import { TouchEncoder } from './encoder';
import type { TouchEncoder as EncoderMapping } from '../../types/mapping';
import { S5Deck } from '../s5-deck';
import { settings, wheelModes } from '../../settings';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';

export class loopEncoder extends TouchEncoder<MixxxChannelGroup> {
	// -- 🚜 S5 Docs 2.1.5
	// "you can sort the tracks by categories TITLE, ARTIST, BPM, IMPORT DATE, #, and KEY"
	sortCategories = [2, 1, 15, 17, 9, 20];
	sortCategoryIdx = 0;

	constructor(
		private deck: S5Deck,
		io: EncoderMapping
	) {
		super(deck.group, 'loop_in', deck.reports, io);
	}

	onChange(isRight: boolean) {
		// -- 🚜 S5 Docs 2.1.5
		// "Rotate the LOOP encoder until the desired category is selected in the SORT BY pop-up window. The tracks will then be resorted."
		if (this.deck.display.isSorting) {
			this.switchSortCategory(isRight);
		}
		else if (this.deck.display.activePopup === 'sliceSize') {
			this.deck.adjustSliceSize(isRight ? 1 : -1);
		}

		// -- 🚜 S5 Docs 2.1.4
		// "Press the LOOP encoder to start preview of the selected track."
		// TODO: Disabled because this should only work in combination with the displays
		//else if (this.deck.display.isPlaylistSelected)
		//this.browsePreviewTrack(isRight);
		else if (
			this.deck.wheelMode === wheelModes.loopIn ||
			this.deck.wheelMode === wheelModes.loopOut
		) {
			const moveFactor = this.isShifted
				? settings.loopEncoderShiftMoveFactor
				: settings.loopEncoderMoveFactor;
			const loopStartPos = engine.getValue(this.group, 'loop_start_position');
			const valueIn =
				loopStartPos + (isRight ? (moveFactor as number) : -moveFactor);
			const loopEndPos = engine.getValue(this.group, 'loop_end_position');
			const valueOut =
				loopEndPos + (isRight ? (moveFactor as number) : -moveFactor);
			engine.setValue(this.group, 'loop_start_position', valueIn);
			engine.setValue(this.group, 'loop_end_position', valueOut);
		} else if (this.isShifted) {
			const size = this.deck.currentLoopSize();
			engine.setValue(
				this.group,
				`beatjump_${size}_${isRight ? 'forward' : 'backward'}`,
				1
			);
		} else {
			this.deck.adjustLoopSize(isRight ? 1 : -1);
		}
	}

	private browsePreviewTrack(isRight: boolean) {
		engine.setValue('[PreviewDeck1]', 'beatjump', isRight ? 16 : -16);
	}

	private switchSortCategory(isRight: boolean) {
		const len = this.sortCategories.length;
		const change = isRight ? 1 : -1;
		this.sortCategoryIdx = (this.sortCategoryIdx + change + len) % len;
		const newCat = this.sortCategories[this.sortCategoryIdx];
		engine.setValue('[Library]', 'sort_column', newCat);
	}

	onTouch(pressed: number): void {
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
		if (!pressed) {
			return;
		}
		//if (this.deck.display.isPlaylistSelected) {
		// -- 🚜 S5 Docs 2.1.5:
		// "Press the LOOP encoder to switch between ascending and descending order"
		if (this.deck.display.isSorting) {
			script.toggleControl('[Library]', 'sort_order');
		}

		// -- 🚜 S5 Docs 2.1.4:
		// "Press the LOOP encoder to start preview of the selected track."
		// TODO: Disabled until solution for library focus was found
		//  else {
		//this.previewTrack();
		//}
		//}
		else if (!this.isShifted) {
			script.triggerControl(this.group, 'beatloop_activate', 50);
		} else {
			script.triggerControl(this.group, 'reloop_toggle', 50);
		}
	}

	private previewTrack() {
		// TODO: Check original behavior in Traktor Pro
		const isPlaying = engine.getValue('[PreviewDeck1]', 'play');
		script.triggerControl(
			'[PreviewDeck1]',
			isPlaying ? 'stop' : 'LoadSelectedTrackAndPlay',
			50
		);
	}
}
