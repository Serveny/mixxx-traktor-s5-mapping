import type {
	DeckChannel,
	MixxxChannelGroup,
} from '../types/mixxx-controls';
import { channelGroup } from '../types/mixxx-controls';
import { createCompContainer } from './component-container';
import type { MoveMode, WheelMode } from '../settings';

export abstract class Deck extends createCompContainer<MixxxChannelGroup>() {
	declare group: MixxxChannelGroup;
	currentDeckIdx: 0 | 1 = 0;
	settings?: object;
	wheelMode: WheelMode = 1;
	moveMode: MoveMode = 0;
	keyboardPlayMode: number = 0;

	constructor(
		public decks: [DeckChannel, DeckChannel],
		settings: object
	) {
		super(Deck.groupForNumber(decks[0] ?? 1));
		this.settings = settings;
	}

	toggleDeck() {
		this.currentDeckIdx = this.currentDeckIdx === 1 ? 0 : 1;
		this.switchDeck(Deck.groupForNumber(this.decks[this.currentDeckIdx]));
	}

	switchDeck(newGroup: MixxxChannelGroup) {
		engine.setValue(this.group, 'scratch2_enable', 0);
		this.rebindGroupChildren(newGroup);
	}

	static groupForNumber(deckNumber: DeckChannel): MixxxChannelGroup {
		return channelGroup(deckNumber);
	}
}
