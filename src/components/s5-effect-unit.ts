import type { HIDReportHolder } from '../hid-report';
import type { S5FxUnitMapping } from '../types/mapping';
import { FxButton } from './buttons/fx-button';
import { PowerWindowButton } from './buttons/power-window-button';
import { ComponentContainer } from './component-container';
import { Pot } from './pot';
import { Component, InMixin } from './component';
import type { EffectUnitGroup } from '../types/mixxx-controls';

type Group = EffectUnitGroup<1 | 2>;
type EffectGroup = `[EffectRack1_EffectUnit${1 | 2}_Effect${1 | 2 | 3}]`;
export type FxUnitMode = 'group' | 'single';

export class S5EffectUnit extends ComponentContainer<Group> {
	declare group: Group;
	// -- 🚜 S5 Docs 4.3: Group Mode = three effects with one knob/button each,
	// Single Mode = one effect whose parameters are on the knobs. Mixxx units are Group Mode by default.
	mode: FxUnitMode = 'group';
	focusedEffect: number | null = null;
	mixKnob: Pot<Group>;
	mainButton: PowerWindowButton;
	knobs: Pot<EffectGroup>[] = [];
	buttons: FxButton[] = [];
	constructor(
		public unitNumber: 1 | 2,
		reports: HIDReportHolder,
		io: S5FxUnitMapping
	) {
		super(`[EffectRack1_EffectUnit${unitNumber}]`);

		this.mixKnob = this.register(
			new Pot(this.group, 'mix', reports, io.knobs[0].fade)
		);
		this.mainButton = this.register(
			new PowerWindowButton(this, reports, io.buttons[0])
		);

		for (const effectNumber of [1, 2, 3] as const) {
			const effectGroup = this.effectGroup(effectNumber);
			this.knobs[effectNumber - 1] = this.register(new Pot(
				effectGroup,
				'meta',
				reports,
				io.knobs[effectNumber].fade
			));
			this.buttons[effectNumber - 1] = this.register(new FxButton(
				effectGroup,
				this,
				reports,
				effectNumber - 1,
				io.buttons
			));
		}

		// -- 🚜 S5 Docs 4.3: "The knobs in this section are sensitive to touch. Touch any of them to open the FX drop-down menu"
		const KnobTouch = InMixin(Component);
		// Mixxx's JS engine throws "this is not defined" for `this` in arrow functions created in derived constructors.
		const group = this.group;
		for (const knob of io.knobs) {
			this.register(
				new KnobTouch({
					reports,
					io: knob.touch,
					input: (touched: number) => engine.setValue(group, 'show_parameters', touched ? 1 : 0),
				})
			);
		}

		this.triggerComponents();
	}

	effectGroup(effectNumber: 1 | 2 | 3): EffectGroup {
		return `[EffectRack1_EffectUnit${this.unitNumber}_Effect${effectNumber}]`;
	}

	// -- 🚜 S5 Docs 3.7.2: SHIFT + FX Button 1 opens the FX Unit menu to choose Single or Group.
	// Without an on-screen menu the combination toggles between both modes.
	toggleMode() {
		this.mode = this.mode === 'group' ? 'single' : 'group';
		this.knobs.forEach((knob, i) => {
			const effectNumber = (i + 1) as 1 | 2 | 3;
			knob.group = this.mode === 'single' ? this.effectGroup(1) : this.effectGroup(effectNumber);
			knob.inKey = (this.mode === 'single' ? `parameter${effectNumber}` : 'meta') as typeof knob.inKey;
			engine.softTakeover(knob.group, knob.inKey, true);
		});
		this.buttons.forEach((button, i) => button.applyMode(this.mode, i));
		this.mainButton.output(engine.getValue(this.effectGroup(1), 'enabled'));
	}

	// -- 🚜 S5 Docs 4.3 (Single Mode): "FX Button 2: Reset all FX parameters to their default value."
	resetParameters() {
		for (const parameter of [1, 2, 3]) {
			engine.setValue(this.effectGroup(1), `parameter${parameter}_set_default` as any, 1);
		}
	}

	setFocusedEffect(effectIdx: number | null) {
		this.mainButton.indicator(effectIdx !== null);
		this.focusedEffect = effectIdx;
		engine.setValue(
			this.group,
			'show_parameters',
			this.focusedEffect !== null ? 1 : 0
		);
	}
}
