import type { HIDReportHodler } from '../hid-report';
import type { S5 } from '../s5';
import type { Meter } from '../types/mapping';
import type { MixxxChannelGroup, MixxxKey } from '../types/mixxx-controls';
import { ComponentOut } from './component';

type Group =
  | MixxxChannelGroup
  | `[Auxiliary${number}]`
  | `[Microphone${number}]`
  | `[Microphone]`;

export class LoudnessMeter extends ComponentOut<Group> {
  // Each column has 11 segments, but treat the top one specially for the clip indicator.
  private deckSegments = 10;
  private auxGroup: `[Auxiliary${number}]`;
  private micGroup: `[Microphone${number}]` | `[Microphone]`;

  constructor(
    private channelIdx: number,
    outKey: MixxxKey[Group],
    reports: HIDReportHodler,
    private s5: S5,
    io: Meter
  ) {
    super({
      group: `[Channel${channelIdx}]`,
      outKey,
      reports,
      io,
    });
    this.auxGroup = `[Auxiliary${channelIdx}]`;
    this.micGroup =
      this.channelIdx !== 1 ? `[Microphone${channelIdx}]` : '[Microphone]';
  }

  output() {
    const deckMeter = new Uint8Array(11).fill(0);
    let deckGroup = this.group;
    if (this.s5.deckLeft.isShifted || this.s5.deckRight.isShifted) {
      if (engine.getValue(this.auxGroup, 'input_configured')) {
        deckGroup = this.auxGroup;
      } else if (engine.getValue(this.micGroup, 'input_configured')) {
        deckGroup = this.micGroup;
      }
    }
    const deckLevel = engine.getValue(deckGroup, 'vu_meter');
    const columnBaseIndex = this.channelIdx * (this.deckSegments + 2);
    const scaledLevel = deckLevel * this.deckSegments;
    const segmentsToLightFully = Math.floor(scaledLevel);
    const partialSegmentValue = scaledLevel - segmentsToLightFully;
    if (segmentsToLightFully > 0) {
      // There are 3 brightness levels per segment: off, dim, and full.
      for (let i = 0; i <= segmentsToLightFully; i++) {
        deckMeter[columnBaseIndex + i] = 127;
      }
      if (
        partialSegmentValue > 0.5 &&
        segmentsToLightFully < this.deckSegments
      ) {
        deckMeter[columnBaseIndex + segmentsToLightFully + 1] = 125;
      }
    }
    if (engine.getValue(deckGroup, 'peak_indicator')) {
      deckMeter[columnBaseIndex + this.deckSegments + 1] = 127;
      this.sendArr(deckMeter);
    }
  }
}
