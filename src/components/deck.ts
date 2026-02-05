import type { MixxxChannelGroup } from '../types/mixxx-controls';
import { createCompContainer } from './component-container';

export abstract class Deck extends createCompContainer<MixxxChannelGroup>() {
	declare group: MixxxChannelGroup;
	currentDeckIdx: number = 0;
	settings?: object;
	wheelMode: number = 1;
	moveMode: number = 0;
	keyboardPlayMode: number = 0;

	constructor(
		public decks: number[],
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
		this.group = newGroup;
		this.reconnectComponents(function (component) {
			if (component.group == null) return false;
			if (component.group.search(script.channelRegEx) !== -1)
				component.group = newGroup;
			else if (component.group.search(script.eqRegEx) !== -1)
				component.group = `[EqualizerRack1_${newGroup}_Effect1]`;
			else if (component.group.search(script.quickEffectRegEx) !== -1)
				component.group = `[QuickEffectRack1_${newGroup}]`;
			return true;
		});
	}

	static groupForNumber(deckNumber: number): MixxxChannelGroup {
		return `[Channel${deckNumber}]`;
	}
}
