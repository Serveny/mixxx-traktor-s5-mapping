/*
 * Kontrol S5 hardware specific mapping logic
 */

import type { HIDInputReport } from '../hid-input-record';
import type { HIDOutputReport } from '../hid-output-record';
import type { S5FxUnitMapping } from '../types/mapping';
import { PowerWindowButton } from './buttons/button';
import { ComponentContainer } from './component-container';
import { Pot } from './pot';

export class S5EffectUnit extends ComponentContainer {
  focusedEffect = null;
  mixKnob: Pot;
  mainButton: PowerWindowButton;
  constructor(
    public unitNumber: number,
    inReports: HIDInputReport[],
    outReport: HIDOutputReport,
    io: S5FxUnitMapping
  ) {
    super();
    this.group = `[EffectRack1_EffectUnit${unitNumber}]`;

    this.mixKnob = new Pot({
      inKey: 'mix',
      group: this.group,
      inReport: inReports[2],
      inByte: io.mixKnob.inByte,
    });

    this.mainButton = new PowerWindowButton({
      unit: this,
      inReport: inReports[1],
      inByte: io.mainButton.inByte,
      inBit: io.mainButton.inBit,
      outByte: io.mainButton.outByte,
      outReport: outReport,
      shift: function () {
        this.group = this.unit.group;
        this.outKey = 'group_[Master]_enable';
        this.outConnect();
        this.outTrigger();
      },
      unshift: function () {
        this.outDisconnect();
        this.outKey = undefined;
        this.group = undefined;
        this.output(false);
      },
      input: function (pressed) {
        if (!this.shifted) {
          for (const index of [0, 1, 2]) {
            const effectGroup = `[EffectRack1_EffectUnit${unitNumber}_Effect${index + 1}]`;
            engine.setValue(effectGroup, 'enabled', pressed);
          }
          this.output(pressed);
        } else if (pressed) {
          if (this.unit.focusedEffect !== null) {
            this.unit.setFocusedEffect(null);
          } else {
            script.toggleControl(this.unit.group, 'group_[Master]_enable');
            this.shift();
          }
        }
      },
    });

    this.knobs = [];
    this.buttons = [];
    for (const index of [0, 1, 2]) {
      const effectGroup = `[EffectRack1_EffectUnit${unitNumber}_Effect${index + 1}]`;
      this.knobs[index] = new Pot({
        inKey: 'meta',
        group: effectGroup,
        inReport: inReports[2],
        inByte: io.knobs[index].inByte,
      });
      this.buttons[index] = new Button({
        unit: this,
        key: 'enabled',
        group: effectGroup,
        inReport: inReports[1],
        inByte: io.buttons[index].inByte,
        inBit: io.buttons[index].inBit,
        outByte: io.buttons[index].outByte,
        outReport: outReport,
        onShortPress: function () {
          if (!this.shifted || this.unit.focusedEffect !== null) {
            script.toggleControl(this.group, this.inKey);
          }
        },
        onLongPress: function () {
          if (this.shifted) {
            this.unit.setFocusedEffect(index);
          }
        },
        onShortRelease: function () {
          if (this.shifted && this.unit.focusedEffect === null) {
            script.triggerControl(this.group, 'next_effect');
          }
        },
        onLongRelease: function () {
          if (!this.shifted) {
            script.toggleControl(this.group, this.inKey);
          }
        },
      });
    }

    for (const component of this) {
      component.inConnect();
      component.outConnect();
      component.outTrigger();
    }
  }
  indicatorLoop() {
    this.focusedEffectIndicator = !this.focusedEffectIndicator;
    this.mainButton.output(true);
  }
  setFocusedEffect(effectIdx) {
    this.mainButton.indicator(effectIdx !== null);
    this.focusedEffect = effectIdx;
    engine.setValue(this.group, 'show_parameters', this.focusedEffect !== null);

    const effectGroup = `[EffectRack1_EffectUnit${this.unitNumber}_Effect${
      this.focusedEffect + 1
    }]`;
    for (const index of [0, 1, 2]) {
      const unfocusGroup = `[EffectRack1_EffectUnit${this.unitNumber}_Effect${index + 1}]`;
      this.buttons[index].outDisconnect();
      this.buttons[index].group = this.focusedEffect === null ? unfocusGroup : effectGroup;
      this.buttons[index].inKey =
        this.focusedEffect === null ? 'enabled' : 'button_parameter' + (index + 1);
      this.buttons[index].shift =
        this.focusedEffect === null
          ? undefined
          : function () {
              this.setGroup(unfocusGroup);
              this.setKey('enabled');
            };
      this.buttons[index].unshift =
        this.focusedEffect === null
          ? undefined
          : function () {
              this.setGroup(effectGroup);
              this.setKey('button_parameter' + (index + 1));
            };
      this.buttons[index].outKey = this.buttons[index].inKey;
      this.knobs[index].group = this.buttons[index].group;
      this.knobs[index].inKey = this.focusedEffect === null ? 'meta' : 'parameter' + (index + 1);
      this.knobs[index].shift =
        this.focusedEffect === null
          ? undefined
          : function () {
              this.setGroupKey(unfocusGroup, 'meta');
            };
      this.knobs[index].unshift =
        this.focusedEffect === null
          ? undefined
          : function () {
              this.setGroupKey(effectGroup, 'parameter' + (index + 1));
            };
      this.buttons[index].outConnect();
    }
  }
}
