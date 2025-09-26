/*
 * Kontrol S5 hardware specific mapping logic
 */

import type { HIDReportHodler } from '../hid-report';
import type { S5FxUnitMapping } from '../types/mapping';
import { FxButton } from './buttons/fx-button';
import { PowerWindowButton } from './buttons/power-window-button';
import { createCompContainer } from './component-container';
import { Pot } from './pot';

type Group = `[EffectRack1_EffectUnit${number}]`;
type EffectGroup = `[EffectRack1_EffectUnit${number}_Effect${number}]`;
export class S5EffectUnit extends createCompContainer<Group>() {
  declare group: Group;
  focusedEffect: number | null = null;
  isFocusedEffectIndicator: boolean = false;
  mixKnob: Pot<Group>;
  mainButton: PowerWindowButton;
  knobs: Pot<EffectGroup>[] = [];
  buttons: FxButton[] = [];
  constructor(
    public unitNumber: number,
    reports: HIDReportHodler,
    io: S5FxUnitMapping
  ) {
    super(`[EffectRack1_EffectUnit${unitNumber}]`);

    this.mixKnob = new Pot(this.group, 'mix', reports, io.knobs[0].fade);
    this.mainButton = new PowerWindowButton(this, reports, io.buttons[0]);

    for (const index of [0, 1, 2]) {
      const effectGroup: EffectGroup = `[EffectRack1_EffectUnit${unitNumber}_Effect${
        index + 1
      }]`;
      this.knobs[index] = new Pot(
        effectGroup,
        'meta',
        reports,
        io.knobs[index + 1].fade
      );
      this.buttons[index] = new FxButton(
        effectGroup,
        this,
        reports,
        index,
        io.buttons
      );
    }
  }

  indicatorLoop() {
    this.isFocusedEffectIndicator = !this.isFocusedEffectIndicator;
    this.mainButton.output(1);
  }

  setFocusedEffect(effectIdx: number | null) {
    this.mainButton.indicator(effectIdx !== null);
    this.focusedEffect = effectIdx;
    engine.setValue(
      this.group,
      'show_parameters',
      this.focusedEffect !== null ? 1 : 0
    );

    //const effectGroup: EffectGroup = `[EffectRack1_EffectUnit${
    //this.unitNumber
    //}_Effect${this.focusedEffect ?? 0 + 1}]`;
    //for (const index of [0, 1, 2]) {
    //const unfocusGroup: EffectGroup = `[EffectRack1_EffectUnit${
    //this.unitNumber
    //}_Effect${index + 1}]`;
    //this.buttons[index].outDisconnect();
    //this.buttons[index].group =
    //this.focusedEffect === null ? unfocusGroup : effectGroup;
    //this.buttons[index].inKey =
    //this.focusedEffect === null
    //? 'enabled'
    //: `button_parameter${index + 1}`;
    //this.buttons[index].shift =
    //this.focusedEffect === null
    //? undefined
    //: function () {
    //this.setGroup(unfocusGroup);
    //this.setKey('enabled');
    //};
    //this.buttons[index].unshift =
    //this.focusedEffect === null
    //? undefined
    //: function () {
    //this.setGroup(effectGroup);
    //this.setKey('button_parameter' + (index + 1));
    //};
    //this.buttons[index].outKey = this.buttons[index].inKey;
    //this.knobs[index].group = this.buttons[index].group;
    //this.knobs[index].inKey =
    //this.focusedEffect === null ? 'meta' : 'parameter' + (index + 1);
    //this.knobs[index].shift =
    //this.focusedEffect === null
    //? undefined
    //: function () {
    //this.setGroupKey(unfocusGroup, 'meta');
    //};
    //this.knobs[index].unshift =
    //this.focusedEffect === null
    //? undefined
    //: function () {
    //this.setGroupKey(effectGroup, 'parameter' + (index + 1));
    //};
    //this.buttons[index].outConnect();
    //}
  }
}
