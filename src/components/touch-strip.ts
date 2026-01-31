import type { ControlOutOptions } from '../types/component';
import type { BlueRedLeds, TouchStripMapping } from '../types/mapping';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import {
  ControlComponent,
  ShiftMixin,
  ControlOutMixin,
  InMixin,
  Component,
} from './component';
import type { S5Deck } from './s5-deck';

export class TouchStrip extends ShiftMixin(InMixin(Component)) {
  private maxValue = 1024;
  private center = this.maxValue / 2;
  private oldTime = 0;
  private oldValue = 0;
  private bpm = 0;

  private leds: TouchStripLEDs;

  constructor(public deck: S5Deck, stripIo: TouchStripMapping) {
    super({
      reports: deck.reports,
      io: stripIo.touch,
    });
    this.leds = new TouchStripLEDs(this, stripIo.leds);
  }

  input(value: number) {
    if (this.isShifted) this.jumpToPos(value);
    else if (!engine.getValue(this.deck.group, 'play_indicator'))
      this.scratch(value);
    else this.adjustPlaybackSpeed(value);
  }

  onShift(): void {
    this.leds.setOutKey('playposition');
    this.leds.lightAll(127, 0); // light bar blue
    const playPos = engine.getValue(this.deck.group, 'playposition');
    this.leds.showPlayPositon(playPos);
  }

  onUnshift(): void {
    this.leds.setOutKey('scratch2');
    this.leds.lightAll(0, 0); // unlight bar

    // Light the middle segment red
    this.leds.lightRed(12, 127);
  }

  private jumpToPos(value: number) {
    if (value)
      engine.setValue(this.deck.group, 'playposition', value / this.maxValue);
  }

  private scratch(value: number) {
    const deckNum = this.deck.decks[this.deck.currentDeckIdx];
    if (!value) {
      engine.scratchDisable(deckNum);
      this.oldTime = 0;
      this.oldValue = 0;
      return;
    }
    if (!engine.isScratching(deckNum)) {
      // alpha: how much the input is filtered (higher = less filter, direct response; lower = more smoothing, less shaky)
      // beta: Weight of the turntable (higher = lighter; lower = heavier)
      engine.scratchEnable(deckNum, this.maxValue, 33.3, 0.125, 0.004);
    }
    const speed = this.calcSpeed(value) * -8;
    engine.scratchTick(deckNum, speed);
  }

  private adjustPlaybackSpeed(value: number) {
    if (this.bpm === 0) this.bpm = engine.getValue(this.deck.group, 'bpm');
    if (!value) {
      engine.setValue(this.deck.group, 'bpm', this.bpm);
      this.bpm = 0;
    } else {
      const bpmToAdd = ((value - this.center) * 8) / this.center;
      engine.setValue(this.deck.group, 'bpm', this.bpm + bpmToAdd);
    }
  }

  private calcSpeed(value: number): number {
    const time = Date.now();
    const deltaTime = time - this.oldTime;
    const deltaValue = value - this.oldValue;

    this.oldTime = time;
    this.oldValue = value;

    if (deltaTime === 0) return 0;
    return deltaValue / deltaTime;
  }
}

class TouchStripLEDs extends ControlOutMixin(
  ControlComponent<MixxxChannelGroup, ControlOutOptions<MixxxChannelGroup>>
) {
  private oldPlayIdx = 0;

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
    else console.log('scratch2', value);
  }

  // Light 3 red LEDs at the track play position
  showPlayPositon(value: number) {
    const playIdx = Math.ceil(value * this.stripSegments - 1) - 1;
    if (playIdx === this.oldPlayIdx) return;
    [127, 127, 127].forEach((b, i) => this.lightBlue(this.oldPlayIdx + i, b));
    [0, 0, 0].forEach((b, i) => this.lightRed(this.oldPlayIdx + i, b));
    this.oldPlayIdx = playIdx;

    [0, 0, 0].forEach((b, i) => this.lightBlue(playIdx + i, b));
    [31, 127, 31].forEach((b, i) => this.lightRed(playIdx + i, b));

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
