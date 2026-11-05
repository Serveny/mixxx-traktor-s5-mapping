import type {
	DeckChannel,
	MixxxChannelGroup,
} from '../types/mixxx-controls';
import { channelGroup } from '../types/mixxx-controls';
import { ComponentContainer } from './component-container';

export abstract class Deck extends ComponentContainer<MixxxChannelGroup> {
	declare group: MixxxChannelGroup;
	currentDeckIdx: 0 | 1 = 0;
	// SHIFT + FLUX on an active loop: the LOOP encoder moves the loop instead of resizing it.
	loopMoveMode = false;

	constructor(public decks: [DeckChannel, DeckChannel]) {
		super(channelGroup(decks[0]));
	}

	toggleDeck() {
		this.currentDeckIdx = this.currentDeckIdx === 1 ? 0 : 1;
		this.switchDeck(channelGroup(this.decks[this.currentDeckIdx]));
	}

	switchDeck(newGroup: MixxxChannelGroup) {
		engine.setValue(this.group, 'scratch2_enable', 0);
		this.rebindGroupChildren(newGroup);
	}
}
