import { settings } from '../settings';
import type { BlueRedLeds, TouchStripMapping } from '../types/mapping';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import {
  GroupComponent,
  ShiftMixin,
  ControlOutMixin,
  InMixin,
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
    const playPos = engine.getValue(this.deck.group, 'playposition');
    this.phase.showPlayPositon(playPos);
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
  private oldPlPosIdx = 0;

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
    if (this.strip.isShifted) this.showPlayPositon(value);
  }

  // Light the red LED at the track play position
  showPlayPositon(value: number) {
    const plPosIdx = Math.ceil(value * this.stripSegments - 1) - 1;
    if (plPosIdx === this.oldPlPosIdx) return;
    [127, 127, 127].forEach((b, i) => this.lightBlue(this.oldPlPosIdx + i, b));
    [0, 0, 0].forEach((b, i) => this.lightRed(this.oldPlPosIdx + i, b));
    this.oldPlPosIdx = plPosIdx;

    [0, 0, 0].forEach((b, i) => this.lightBlue(plPosIdx + i, b));
    [31, 127, 31].forEach((b, i) => this.lightRed(plPosIdx + i, b));

    this.outReport.send();
  }

  lightAll(blueBrightness: number, redBrightness: number) {
    for (let i = 0; i < this.stripSegments; i++) {
      this.lightBlue(i, blueBrightness);
      this.lightRed(i, redBrightness);
    }
  }

  lightBlue(idx: number, brightness: number) {
    if (idx >= 0 && idx < 25)
      this.outReport.data[this.brIo.blue.outByte + idx] = brightness;
  }

  lightRed(idx: number, brightness: number) {
    if (idx >= 0 && idx < 25)
      this.outReport.data[this.brIo.red.outByte + idx] = brightness;
  }
}
