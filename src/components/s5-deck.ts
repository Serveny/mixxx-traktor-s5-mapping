import type { HIDReportHolder } from '../hid-report';
import { channels } from '../settings';
import type { S5DeckMapping } from '../types/mapping';
import { BrowserEncoder } from './encoders/browser-encoder';
import { BrowserBackButton } from './buttons/browser-back-button';
import { CueButton } from './buttons/cue-button';
import { DeckButton } from './buttons/deck-button';
import { FluxButton } from './buttons/flux-button';
import { PlayButton } from './buttons/play-button';
import { ShiftButton } from './buttons/shift-button';
import { SyncButton } from './buttons/sync-button';
import { Deck } from './deck';
import type { Mixer } from './mixer';
import { loopEncoder } from './encoders/loop-encoder';
import type { S5EffectUnit } from './s5-effect-unit';
import { TouchStrip } from './touch-strip';
import { DisplayArea } from './display-area';
import { publishScreenState } from '../screen-state';
import { PadButton } from './buttons/pad-button';
import { HotcueModeButton } from './buttons/hotcue-mode-button';
import type {
	DeckChannel,
	MixxxChannelGroup,
} from '../types/mixxx-controls';
import { FreezeButton } from './buttons/freeze-button';
import { RemixModeButton } from './buttons/remix-mode-button';
import { LoopLed } from './loop-led';
import { FreezeSlicer } from './freeze-slicer';
import { RemixSamplers } from './remix-samplers';
import { StemPads } from './stem-pads';
import { ScreenBrowser } from './screen-browser';

export class S5Deck extends Deck {
	display: DisplayArea;
	browserEncoder: BrowserEncoder;
	browserBackButton: BrowserBackButton;
	deckButton: DeckButton;
	loopEncoder: loopEncoder;
	loopLed: LoopLed;
	hotcueModeButton: HotcueModeButton;
	freezeButton: FreezeButton;
	remixModeButton: RemixModeButton;
	fluxButton: FluxButton;
	pads: PadButton[] = [];
	touchStrip: TouchStrip;
	shiftButton: ShiftButton;
	syncButton: SyncButton;
	cueButton: CueButton;
	playButton: PlayButton;
	performanceMode: 'hotcue' | 'freeze' | 'remix' = 'hotcue';
	hotcuePage: 1 | 2 | 3 = 1;
	loopSizePresets = [1 / 32, 1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 16, 32] as const;
	loopSizeIndex = 5;
	sliceSizePresets = [1 / 4, 1 / 2, 1, 2, 4] as const;
	sliceSizeIndex = 2;
	quantizeSizes = [1 / 4, 1 / 2, 1, 2, 4, 8, 16] as const;
	quantizeSizeIndex = 2;
	freezeSlicer = new FreezeSlicer(this);
	remix = new RemixSamplers(this);
	stems = new StemPads(this);
	browser = new ScreenBrowser(this);
	// The deck on the other side of the controller, set by S5.
	otherSide?: S5Deck;
	constructor(
		decks: [DeckChannel, DeckChannel],
		public effectUnit: S5EffectUnit,
		public mixer: Mixer,
		public reports: HIDReportHolder,
		io: S5DeckMapping
	) {
		super(decks);

		this.display = this.register(new DisplayArea(this, io.displayAreaAndControls), {
			groupBound: true,
		});

		this.browserEncoder = this.register(
			new BrowserEncoder(this, io.browseControls.browse)
		);
		this.browserBackButton = this.register(
			new BrowserBackButton(this.display, this.reports, io.browseControls.back)
		);
		this.deckButton = this.register(new DeckButton(this, io.deck));
		this.loopEncoder = this.register(new loopEncoder(this, io.loop), {
			groupBound: true,
		});
		this.loopLed = this.register(new LoopLed(this, io.loopLed), {
			groupBound: true,
		});
		this.freezeButton = this.register(new FreezeButton(this, io.modeSelect.freeze), {
			groupBound: true,
		});
		this.remixModeButton = this.register(
			new RemixModeButton(this, io.modeSelect.remix),
			{ groupBound: true }
		);

		this.hotcueModeButton = this.register(
			new HotcueModeButton(this, io.modeSelect.hotcueMode),
			{ groupBound: true }
		);

		this.fluxButton = this.register(new FluxButton(this, io.flux), {
			groupBound: true,
		});

		this.touchStrip = this.register(new TouchStrip(this, io.touchStrip), {
			groupBound: true,
		});

		const transCltr = io.transportControls;
		this.shiftButton = this.register(new ShiftButton(this, transCltr.shift));
		this.syncButton = this.register(new SyncButton(this, reports, transCltr.sync), {
			groupBound: true,
		});
		this.cueButton = this.register(new CueButton(this, transCltr.cue), {
			groupBound: true,
		});
		this.playButton = this.register(new PlayButton(this, reports, transCltr.play), {
			groupBound: true,
		});

		for (let padNum = 1; padNum < 9; padNum++) {
			this.pads.push(
				this.register(new PadButton(padNum, this, io.pads[padNum - 1]), {
					groupBound: true,
				})
			);
		}

		this.triggerComponents();
		this.updateModeButtons();
	}

	// -- 🚜 S5 Docs 3.7.2: the deck's SHIFT also shifts the FX Unit above it ("SHIFT button + Button 1 of FX Unit 1").
	onShift() {
		super.onShift();
		this.effectUnit.shift();
	}

	onUnshift() {
		super.onUnshift();
		this.effectUnit.unshift();
	}

	switchDeck(newGroup: MixxxChannelGroup) {
		// Freeze slices belong to the track of the previously focused deck.
		if (this.performanceMode === 'freeze') this.setPerformanceMode('hotcue');
		this.display.closePopup();
		super.switchDeck(newGroup);
		this.deckButton.output();
		this.updateModeButtons();
		this.redrawPads();
		this.publishScreenState();
	}

	publishScreenState() {
		publishScreenState(this.decks[0] === 1 ? 'leftdeck' : 'rightdeck', {
			group: this.group,
			popup: this.display.activePopup,
			sliceSize: this.sliceSizePresets[this.sliceSizeIndex],
			quantizeSize: this.quantizeSizes[this.quantizeSizeIndex],
			browserScrollRequest: this.browser.scrollRequest,
			browserLoadRequest: this.browser.loadRequest,
			browserPreviewRequest: this.browser.previewRequest,
			browserSorting: this.browser.isSorting,
			browserSortColumn: this.browser.sortColumn,
			browserSortDescending: this.browser.sortDescending,
			browserPreviewMode: this.browser.isPreviewMode,
		});
	}

	// -- 🚜 S5 Docs 3.1.2 / 4.2.5:
	// Beat phase offset against the tempo master (or, without one, another playing deck), in beats.
	phaseOffset(): number | null {
		if (!engine.getValue(this.group, 'play') || engine.getValue(this.group, 'sync_leader')) {
			return null;
		}
		const others = channels.filter(
			(c) => c !== this.group && engine.getValue(c, 'play')
		);
		const reference =
			others.find((c) => engine.getValue(c, 'sync_leader')) ?? others[0];
		if (!reference) return null;
		let offset =
			engine.getValue(this.group, 'beat_distance') -
			engine.getValue(reference, 'beat_distance');
		if (offset > 0.5) offset -= 1;
		else if (offset < -0.5) offset += 1;
		return offset;
	}

	updatePhase() {
		const offset = this.phaseOffset();
		this.syncButton.setPhaseOffset(offset);
		this.touchStrip.showPhase(offset);
		this.refreshModePads();
	}

	setPerformanceMode(mode: 'hotcue' | 'freeze' | 'remix') {
		// -- 🚜 S5 Docs 2.5 / 3.3 / 3.5:
		// Mode changes invalidate any popup semantics that belonged to the previous deck context.
		this.display.closePopup();
		if (this.performanceMode === 'freeze' && mode !== 'freeze') this.freezeSlicer.exit();
		if (mode !== 'remix') this.stems.clearSelection();
		if (mode === 'freeze' && this.performanceMode !== 'freeze') this.freezeSlicer.freeze();
		this.performanceMode = mode;
		if (mode !== 'hotcue') {
			this.hotcuePage = 1;
			this.refreshPads();
		}
		this.updateModeButtons();
		this.redrawPads();
	}

	// -- 🚜 S5 Docs 3.8: a deck with a stem file loaded is a Stem Deck; its REMIX mode controls the stems.
	isStemMode() {
		return this.performanceMode === 'remix' && this.stems.available();
	}

	padInput(padNumber: number, pressed: boolean) {
		if (this.performanceMode === 'freeze') {
			this.freezeSlicer.pad(padNumber, pressed);
		} else if (this.isStemMode()) {
			this.stems.pad(padNumber, pressed, this.isShifted);
		} else if (this.performanceMode === 'remix') {
			this.remix.pad(padNumber, pressed, this.isShifted);
		}
		this.refreshModePads();
	}

	private modePads() {
		if (this.performanceMode === 'freeze') return this.freezeSlicer;
		if (this.performanceMode === 'remix') return this.stems.available() ? this.stems : this.remix;
		return null;
	}

	redrawPads() {
		if (this.performanceMode === 'hotcue') {
			for (const pad of this.pads) pad.redraw();
			return;
		}
		this.refreshModePads(true);
	}

	// Called from the 50 ms GUI tick and after pad presses; only sends when colours changed.
	refreshModePads(force = false) {
		const source = this.modePads();
		if (!source) return;
		const colors = force ? source.padColors() : source.changedPadColors();
		if (!colors) return;
		this.pads.forEach((pad, i) => pad.paint(colors[i]));
	}

	currentSliceSize() {
		return this.sliceSizePresets[this.sliceSizeIndex];
	}

	cycleHotcuePage() {
		// -- 🚜 S5 Docs 2.7:
		// The S5 reuses one physical mode button to page through three hotcue banks.
		this.performanceMode = 'hotcue';
		this.hotcuePage = ((this.hotcuePage % 3) + 1) as 1 | 2 | 3;
		this.refreshPads();
		this.updateModeButtons();
	}

	refreshPads() {
		for (const pad of this.pads) {
			pad.updateBindings();
		}
	}

	hotcueNumberForPad(padNumber: number) {
		// -- 🚜 S5 Docs 2.7:
		// Page 2 overlaps 5-8 on purpose, matching the controller's progressive hotcue banks.
		if (this.hotcuePage === 1) {
			return padNumber;
		}
		if (this.hotcuePage === 2) {
			return padNumber + 4;
		}
		return padNumber + 12;
	}

	adjustLoopSize(direction: 1 | -1) {
		// -- 🚜 S5 Docs 3.2.1 / 3.2.2:
		// Keep preset selection explicit so loop turns and shifted beatjumps always agree.
		this.loopSizeIndex = Math.max(
			0,
			Math.min(this.loopSizePresets.length - 1, this.loopSizeIndex + direction)
		);
		const size = this.loopSizePresets[this.loopSizeIndex];
		engine.setValue(this.group, 'beatloop_size', size);
		return size;
	}

	currentLoopSize() {
		return engine.getValue(this.group, 'beatloop_size') || this.loopSizePresets[this.loopSizeIndex];
	}

	adjustSliceSize(direction: 1 | -1) {
		this.sliceSizeIndex = Math.max(
			0,
			Math.min(this.sliceSizePresets.length - 1, this.sliceSizeIndex + direction)
		);
		if (this.performanceMode === 'freeze') this.freezeSlicer.resize();
		this.publishScreenState();
		return this.sliceSizePresets[this.sliceSizeIndex];
	}

	adjustQuantizeSize(direction: 1 | -1) {
		this.quantizeSizeIndex = Math.max(
			0,
			Math.min(this.quantizeSizes.length - 1, this.quantizeSizeIndex + direction)
		);
		this.publishScreenState();
		return this.quantizeSizes[this.quantizeSizeIndex];
	}

	updateModeButtons() {
		this.hotcueModeButton.output(this.performanceMode === 'hotcue' ? 1 : 0);
		this.freezeButton.output(this.performanceMode === 'freeze' ? 1 : 0);
		this.remixModeButton.output(this.performanceMode === 'remix' ? 1 : 0);
	}
}
