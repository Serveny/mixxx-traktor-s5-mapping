import type { DeckModes } from '../types/component';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import { createCompContainer } from './component-container';

export class Deck extends createCompContainer<MixxxChannelGroup>() {
  declare group: MixxxChannelGroup;
  currentDeckIdx: number = 0;
  color?: number;
  settings?: object;
  groupsToColors: { [key: string]: number } = {};
  wheelMode: number = 0;
  moveMode: number = 0;
  secondDeckModes: DeckModes | null = null;
  keyboardPlayMode: number = 0;

  constructor(private decks: number[], colors: number[], settings: object) {
    super(Deck.groupForNumber(decks[0] ?? 1));
    for (const i in this.decks) {
      this.groupsToColors[Deck.groupForNumber(this.decks[i])] = colors[i];
    }
    this.color = colors[0];
    this.settings = settings;
    this.secondDeckModes = null;
  }

  toggleDeck() {
    this.currentDeckIdx = this.currentDeckIdx === 1 ? 0 : 1;
    this.switchDeck(Deck.groupForNumber(this.decks[this.currentDeckIdx]));
  }

  switchDeck(newGroup: MixxxChannelGroup) {
    const currentModes: DeckModes = {
      moveMode: this.moveMode,
      wheelMode: this.wheelMode,
    };

    engine.setValue(this.group, 'scratch2_enable', 0);
    this.group = newGroup;
    this.color = this.groupsToColors[newGroup];

    if (this.secondDeckModes !== null) {
      this.wheelMode = this.secondDeckModes.wheelMode;
      this.moveMode = this.secondDeckModes.moveMode;
    }
    this.reconnectComponents(function (this: Deck, component) {
      if (
        component.group === undefined ||
        component.group.search(script.channelRegEx) !== -1
      ) {
        component.group = newGroup;
      } else if (component.group.search(script.eqRegEx) !== -1) {
        component.group = `[EqualizerRack1_${newGroup}_Effect1]`;
      } else if (component.group.search(script.quickEffectRegEx) !== -1) {
        component.group = `[QuickEffectRack1_${newGroup}]`;
      }

      component.color = this.groupsToColors[newGroup];
    });
    this.secondDeckModes = currentModes;
  }

  static groupForNumber(deckNumber: number): MixxxChannelGroup {
    return `[Channel${deckNumber}]`;
  }
}
