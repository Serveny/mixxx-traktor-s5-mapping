import type { S5Deck } from './s5-deck';

export const beatgridParams = ['offset', 'bpm', 'fine', 'scan'] as const;
export type BeatgridParam = (typeof beatgridParams)[number];

// -- 🚜 S5 Docs 3.9.2 / 3.9.3: Beatgrid mode (SHIFT + Display Button 1).
// Performance Mode buttons select OFFSET, BPM, FINE or SCAN; the LOOP encoder adjusts it.
// Display Button 1 = LOCK, 3 = TAP, 4 = RST. The audible Tick (Display Button 2) has no Mixxx equivalent.
export class BeatgridMode {
	param: BeatgridParam = 'offset';

	constructor(private deck: S5Deck) {}

	cycle(direction: 1 | -1) {
		const count = beatgridParams.length;
		const index = beatgridParams.indexOf(this.param);
		this.param = beatgridParams[(index + direction + count) % count];
	}

	turn(direction: 1 | -1) {
		const group = this.deck.group;
		const up = direction > 0;
		switch (this.param) {
			case 'offset':
				engine.setValue(group, up ? 'beats_translate_later' : 'beats_translate_earlier', 1);
				break;
			case 'bpm':
				// Coarse steps of 0.1 BPM; Mixxx adjusts by 0.01 BPM per trigger.
				for (let i = 0; i < 10; i++) {
					engine.setValue(group, up ? 'beats_adjust_faster' : 'beats_adjust_slower', 1);
				}
				break;
			case 'fine':
				engine.setValue(group, up ? 'beats_adjust_faster' : 'beats_adjust_slower', 1);
				break;
			case 'scan':
				engine.setValue(group, up ? 'beatjump_4_forward' : 'beatjump_4_backward', 1);
				break;
		}
	}

	lock() {
		script.toggleControl(this.deck.group, 'bpmlock');
	}

	tap() {
		engine.setValue(this.deck.group, 'bpm_tap', 1);
	}

	reset() {
		engine.setValue(this.deck.group, 'beats_undo_adjustment', 1);
	}
}
