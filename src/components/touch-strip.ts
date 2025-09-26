import type { HIDOutputReport } from '../hid-report';
import { settings, wheelModes } from '../settings';
import type {
  ComponentInOptions,
  ComponentOutGroupOptions,
} from '../types/component';
import type { BlueRedLeds, TouchStripMapping } from '../types/mapping';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import {
  GroupComponent,
  ControlInMixin,
  ShiftMixin,
  ControlOutMixin,
  InMixin,
  SetInOutKeyMixin,
  Component,
} from './component';
import type { S5Deck } from './s5-deck';

const wheelRelativeMax = 2 ** 32 - 1;
const wheelAbsoluteMax = 2879;

const wheelTimerMax = 2 ** 32 - 1;
const wheelTimerTicksPerSecond = 100000000; // One tick every 10ns

const baseRevolutionsPerSecond = settings.baseRevolutionsPerMinute / 60;
const wheelTicksPerTimerTicksToRevolutionsPerSecond =
  wheelTimerTicksPerSecond / wheelAbsoluteMax;

export class TouchStrip extends ShiftMixin(InMixin(Component)) {
  maxValue = 1024;
  speed: number = 0;
  oldValue: [number, number, number] | null = null;

  private phase: TouchStripPhase;

  constructor(public deck: S5Deck, public stripIo: TouchStripMapping) {
    super({
      reports: deck.reports,
      io: stripIo.touch,
    });
    this.phase = new TouchStripPhase(this, stripIo.phase);
  }

  input(value: number) {
    if (!value) return;
    if (this.isShifted) {
      engine.setValue(this.deck.group, 'playposition', value / this.maxValue);
      return;
    }
  }

  onShift(): void {
    this.phase.setOutKey('playposition');
    this.phase.lightAll(127, 0); // light bar blue
  }

  onUnshift(): void {
    this.phase.setOutKey('scratch2');
    this.phase.lightAll(0, 0); // unlight bar

    // Light the middle segment red
    this.phase.lightRed(12, 127);
  }
}

class TouchStripPhase extends ControlOutMixin(
  GroupComponent<MixxxChannelGroup>
) {
  oldSegmentIdx = 0;

  private stripSegments = 25;

  constructor(private strip: TouchStrip, private brIo: BlueRedLeds) {
    super({
      group: strip.deck.group,
      outKey: 'scratch2',
      io: brIo.blue,
      reports: strip.deck.reports,
    });

    this.outReport.data[brIo.red.outByte + 12] = 127;
  }

  output(value: number) {
    if (this.strip.isShifted) {
      const segmentToLightRed = Math.floor(value * (this.stripSegments - 1));
      if (segmentToLightRed === this.oldSegmentIdx) return;

      this.lightBlue(this.oldSegmentIdx, 127);
      this.lightRed(this.oldSegmentIdx, 0);
      this.oldSegmentIdx = segmentToLightRed;

      this.lightBlue(segmentToLightRed, 0);
      this.lightRed(segmentToLightRed, 127);
      this.outReport.send();
    }
  }

  lightAll(blueBrightness: number, redBrightness: number) {
    for (let i = 0; i < this.stripSegments; i++) {
      this.lightBlue(i, blueBrightness);
      this.lightRed(i, redBrightness);
    }
  }
  lightBlue(idx: number, brightness: number) {
    this.outReport.data[this.brIo.blue.outByte + idx] = brightness;
  }
  lightRed(idx: number, brightness: number) {
    this.outReport.data[this.brIo.red.outByte + idx] = brightness;
  }
}
