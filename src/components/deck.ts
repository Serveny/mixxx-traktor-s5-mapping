import type { DeckModes } from '../types/component';
import { ComponentContainer } from './component-container';

/* eslint no-redeclare: "off" */
export class Deck extends ComponentContainer {
  decks?: number[];
  currentDeckNumber: number = 0;
  color?: string;
  settings?: object;
  groupsToColors: { [key: string]: string } = {};
  wheelMode: number = 0;
  moveMode: number = 0;
  secondDeckModes: DeckModes | null = null;
  keyboardPlayMode: number = 0;
  constructor(decks: number | number[], colors: string[], settings: object) {
    super(Deck.groupForNumber(typeof decks === 'number' ? decks : decks[0]));
    if (Array.isArray(decks)) {
      this.decks = decks;
      this.currentDeckNumber = decks[0];
    }
    if (this.decks) {
      for (const i in this.decks) {
        this.groupsToColors[Deck.groupForNumber(this.decks[i])] = colors[i];
      }
    }
    this.color = colors[0];
    this.settings = settings;
    this.secondDeckModes = null;
  }
  toggleDeck() {
    if (this.decks === undefined) {
      throw Error(
        'toggleDeck can only be used with Decks constructed with an Array of deck numbers, for example [1, 3]'
      );
    }

    const currentDeckIndex = this.decks.indexOf(this.currentDeckNumber);
    let newDeckIndex = currentDeckIndex + 1;
    if (currentDeckIndex >= this.decks.length) {
      newDeckIndex = 0;
    }

    this.switchDeck(Deck.groupForNumber(this.decks[newDeckIndex]));
  }
  switchDeck(newGroup: string) {
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
  static groupForNumber(deckNumber: number) {
    return `[Channel${deckNumber}]`;
  }
}
