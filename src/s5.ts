import { Mixer } from './components/mixer';
import { S5Deck } from './components/s5-deck';
import { S5EffectUnit } from './components/s5-effect-unit';
import { HIDInputReport } from './hid-input-record';
import { HIDOutputReport } from './hid-output-record';
import type { S5Mapping } from './mapping';
import { settings } from './settings';

export class S5 {
  inReports: HIDInputReport[] = [];
  outReports: HIDOutputReport[] = [];
  fxUnitLeft: S5EffectUnit;
  fxUnitRight: S5EffectUnit;
  deckLeft: S5Deck;
  deckRight: S5Deck;
  mixer: Mixer;
  constructor(io: S5Mapping) {
    if (engine.getValue('[App]', 'num_decks') < 4) {
      engine.setValue('[App]', 'num_decks', 4);
    }
    if (engine.getValue('[App]', 'num_samplers') < 16) {
      engine.setValue('[App]', 'num_samplers', 16);
    }

    this.inReports[1] = new HIDInputReport(1);
    this.inReports[2] = new HIDInputReport(2);

    // There are various of other HID report which doesn't seem to have any
    // immediate use but it is likely that some useful settings may be found
    // in them such as the wheel tension.
    this.outReports[128] = new HIDOutputReport(128, 94);

    this.fxUnitLeft = new S5EffectUnit(
      1,
      this.inReports,
      this.outReports[128],
      io.fxUnitLeft
    );
    this.fxUnitRight = new S5EffectUnit(
      2,
      this.inReports,
      this.outReports[128],
      io.fxUnitRight
    );

    // The interaction between the FX SELECT buttons and the QuickEffect enable buttons is rather complex.
    // It is easier to have this separate from the S5MixerColumn dhe FX SELECT buttons are not
    // really in the mixer columns.
    this.mixer = new Mixer(this.inReports, this.outReports);

    // There is no consistent offset between the left and right deck,
    // so every single components' IO needs to be specified individually
    // for both decks.
    this.deckLeft = new S5Deck(
      [1, 3],
      [settings.deckColors[0], settings.deckColors[2]],

      this.fxUnitLeft,
      this.mixer,
      this.inReports,
      this.outReports[128],
      io.deckLeft
    );

    this.deckRight = new S5Deck(
      [2, 4],
      [settings.deckColors[1], settings.deckColors[3]],
      this.fxUnitRight,
      this.mixer,
      this.inReports,
      this.outReports[128],
      io.deckRight
    );

    const that = this;
    /* eslint no-unused-vars: "off" */
    const meterConnection = engine.makeConnection(
      '[App]',
      'gui_tick_50ms_period_s',
      function (_value) {
        const deckMeters = new Uint8Array(78).fill(0);
        // Each column has 14 segments, but treat the top one specially for the clip indicator.
        const deckSegments = 13;
        for (let deckNum = 1; deckNum <= 4; deckNum++) {
          let deckGroup = `[Channel${deckNum}]`;
          if (that.deckLeft.shifted || that.deckRight.shifted) {
            if (engine.getValue(`[Auxiliary${deckNum}]`, 'input_configured')) {
              deckGroup = `[Auxiliary${deckNum}]`;
            } else if (
              engine.getValue(
                deckNum !== 1 ? `[Microphone${deckNum}]` : '[Microphone]',
                'input_configured'
              )
            ) {
              deckGroup =
                deckNum !== 1 ? `[Microphone${deckNum}]` : '[Microphone]';
            }
          }
          const deckLevel = engine.getValue(deckGroup, 'vu_meter');
          const columnBaseIndex = (deckNum - 1) * (deckSegments + 2);
          const scaledLevel = deckLevel * deckSegments;
          const segmentsToLightFully = Math.floor(scaledLevel);
          const partialSegmentValue = scaledLevel - segmentsToLightFully;
          if (segmentsToLightFully > 0) {
            // There are 3 brightness levels per segment: off, dim, and full.
            for (let i = 0; i <= segmentsToLightFully; i++) {
              deckMeters[columnBaseIndex + i] = 127;
            }
            if (
              partialSegmentValue > 0.5 &&
              segmentsToLightFully < deckSegments
            ) {
              deckMeters[columnBaseIndex + segmentsToLightFully + 1] = 125;
            }
          }
          if (engine.getValue(deckGroup, 'peak_indicator')) {
            deckMeters[columnBaseIndex + deckSegments + 1] = 127;
          }
        }
        // There are more bytes in the report which seem like they should be for the main
        // mix meters, but setting those bytes does not do anything, except for lighting
        // the clip lights on the main mix meters.
        // controller.sendOutputReport(129, deckMeters.buffer);
      }
    );
  }
  incomingData(data: Uint8Array) {
    const reportId = data[0];

    if (reportId === 1) {
      this.inReports[reportId].handleInput(data.buffer.slice(1));
    } else if (reportId === 2) {
      const view = new DataView(data.buffer);
      // TODO
    } else {
      console.warn(
        `Unsupported HID repord with ID ${reportId}. Contains: ${data}`
      );
    }
  }
  init() {
    // sending these magic reports is required for the jog wheel LEDs to work
    const wheelLEDinitReport = new Uint8Array(26).fill(0);
    wheelLEDinitReport[1] = 1;
    wheelLEDinitReport[2] = 3;
    controller.sendOutputReport(48, wheelLEDinitReport.buffer, true);
    wheelLEDinitReport[0] = 1;
    controller.sendOutputReport(48, wheelLEDinitReport.buffer);

    // get state of knobs and faders
    for (const repordId of [0x01, 0x02]) {
      this.inReports[repordId].handleInput(controller.getInputReport(repordId));
    }
  }
  shutdown() {
    // button LEDs
    controller.sendOutputReport(128, new Uint8Array(94).fill(0).buffer);

    // meter LEDs
    controller.sendOutputReport(129, new Uint8Array(78).fill(0).buffer);

    const wheelOutput = new Uint8Array(40).fill(0);
    // left wheel LEDs
    controller.sendOutputReport(50, wheelOutput.buffer, true);
    // right wheel LEDs
    wheelOutput[0] = 1;
    controller.sendOutputReport(50, wheelOutput.buffer, true);
  }
}
