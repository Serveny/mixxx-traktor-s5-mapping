import type { BytePosInOut } from '../../types/mapping';
import type { S5Deck } from '../s5-deck';
import { PushButton } from './button';

export class CueButton extends PushButton {
	constructor(
		deck: S5Deck,
		io: BytePosInOut
	) {
		super({
			group: deck.group,
			inKey: 'cue_default',
			outKey: 'cue_indicator',
			reports: deck.reports,
			io,
		});
	}

	onUnshift() {
		this.inKey = 'cue_default';
	}

	// -- 🚜 S5 Docs 4.2.6:
	// "Press SHIFT + CUE to skip back to the beginning of the track and playback continuous immediately."
	onShift() {
		this.inKey = 'start_play';
	}
}
