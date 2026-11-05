import { RgbColor } from '../color';
import type { S5Deck } from './s5-deck';
import type { StemGroup, StemQuickEffectGroup } from '../types/mixxx-controls';

export type StemPage = 'volume' | 'filter';

// -- 🚜 S5 Docs 3.8.3: on a Stem Deck the upper pads mute/unmute the Stem Parts, the lower pads
// select them; BROWSE adjusts the volume (VOLUME page), LOOP the filter (FILTER page) of the
// selected parts. SHIFT + lower pad resets volume and filter.
// Not available in Mixxx: FX SEND per stem (SHIFT + upper pad), stems only have a quick effect.
export class StemPads {
	page: StemPage = 'volume';
	private selected = new Set<number>();
	private lastLeds = '';

	constructor(private deck: S5Deck) {}

	available() {
		return engine.getValue(this.deck.group, 'stem_count') > 0;
	}

	private stem(index: number): StemGroup {
		return `[Channel${this.deck.decks[this.deck.currentDeckIdx]}_Stem${index}]`;
	}

	private filter(index: number): StemQuickEffectGroup {
		return `[QuickEffectRack1_${this.stem(index)}]`;
	}

	private stemCount() {
		return Math.min(4, engine.getValue(this.deck.group, 'stem_count'));
	}

	hasSelection() {
		return this.selected.size > 0;
	}

	pad(padNumber: number, pressed: boolean, shifted: boolean) {
		if (!pressed) return;
		const index = ((padNumber - 1) % 4) + 1;
		if (index > this.stemCount()) return;
		if (padNumber <= 4) {
			if (!shifted) script.toggleControl(this.stem(index), 'mute');
		} else if (shifted) {
			this.reset(index);
		} else if (this.selected.has(index)) {
			this.selected.delete(index);
		} else {
			this.selected.add(index);
		}
		this.lastLeds = '';
	}

	togglePage() {
		this.page = this.page === 'volume' ? 'filter' : 'volume';
	}

	// BROWSE turn on the VOLUME page
	adjustVolume(direction: 1 | -1) {
		for (const index of this.selected) {
			const group = this.stem(index);
			engine.setValue(group, 'volume', clamp(engine.getValue(group, 'volume') + direction * 0.05));
		}
	}

	// "Press the BROWSE encoder to reset the volume to maximum level."
	resetVolume() {
		for (const index of this.selected) engine.setValue(this.stem(index), 'volume', 1);
	}

	// LOOP press / turn on the FILTER page
	toggleFilter() {
		for (const index of this.selected) script.toggleControl(this.filter(index), 'enabled');
	}

	adjustFilter(direction: 1 | -1) {
		for (const index of this.selected) {
			const group = this.filter(index);
			engine.setValue(group, 'super1', clamp(engine.getValue(group, 'super1') + direction * 0.05));
		}
	}

	private reset(index: number) {
		engine.setValue(this.stem(index), 'volume', 1);
		engine.setValue(this.filter(index), 'super1', 0.5);
		engine.setValue(this.filter(index), 'enabled', 0);
	}

	clearSelection() {
		this.selected.clear();
		this.lastLeds = '';
	}

	padColors(): RgbColor[] {
		const count = this.stemCount();
		return Array.from({ length: 8 }, (_, i) => {
			const index = (i % 4) + 1;
			if (index > count) return new RgbColor(0);
			if (i < 4) {
				// Stem colours are 0-255 per channel, the pads take 0-127.
				const color = Math.max(0, engine.getValue(this.stem(index), 'color'));
				return new RgbColor((color >> 1) & 0x7f7f7f).brightness(
					engine.getValue(this.stem(index), 'mute') ? 0.1 : 1
				);
			}
			return RgbColor.blue().brightness(this.selected.has(index) ? 1 : 0.15);
		});
	}

	changedPadColors(): RgbColor[] | null {
		const colors = this.padColors();
		const key = colors.map((c) => `${c.r()},${c.g()},${c.b()}`).join(';');
		if (key === this.lastLeds) return null;
		this.lastLeds = key;
		return colors;
	}

	invalidate() {
		this.lastLeds = '';
	}
}

function clamp(value: number) {
	return Math.max(0, Math.min(1, value));
}
