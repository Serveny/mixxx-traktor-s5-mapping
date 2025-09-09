import { Mixer } from './components/mixer';
import { S5Deck } from './components/s5-deck';
import { S5EffectUnit } from './components/s5-effect-unit';
import { HIDInputReport } from './hid-input-record';
import { HIDOutputReport } from './hid-output-record';
import { settings } from './settings';

export class S5 {
  inReports: HIDInputReport[];
  outReports: HIDOutputReport[];
  effectUnit1: S5EffectUnit;
  effectUnit2: S5EffectUnit;
  leftDeck: S5Deck;
  rightDeck: S5Deck;
  mixer: Mixer;
  constructor() {
    if (engine.getValue('[App]', 'num_decks') < 4) {
      engine.setValue('[App]', 'num_decks', 4);
    }
    if (engine.getValue('[App]', 'num_samplers') < 16) {
      engine.setValue('[App]', 'num_samplers', 16);
    }

    this.inReports = [];
    this.inReports[1] = new HIDInputReport(1);
    this.inReports[2] = new HIDInputReport(2);

    // There are various of other HID report which doesn't seem to have any
    // immediate use but it is likely that some useful settings may be found
    // in them such as the wheel tension.

    this.outReports = [];
    this.outReports[128] = new HIDOutputReport(128, 94);

    this.effectUnit1 = new S5EffectUnit(
      1,
      this.inReports,
      this.outReports[128],
      {
        mixKnob: { inByte: 30 },
        mainButton: { inByte: 1, inBit: 6, outByte: 62 },
        knobs: [{ inByte: 32 }, { inByte: 34 }, { inByte: 36 }],
        buttons: [
          { inByte: 1, inBit: 7, outByte: 63 },
          { inByte: 1, inBit: 3, outByte: 64 },
          { inByte: 1, inBit: 2, outByte: 65 },
        ],
      }
    );
    this.effectUnit2 = new S5EffectUnit(
      2,
      this.inReports,
      this.outReports[128],
      {
        mixKnob: { inByte: 70 },
        mainButton: { inByte: 9, inBit: 4, outByte: 73 },
        knobs: [{ inByte: 72 }, { inByte: 74 }, { inByte: 76 }],
        buttons: [
          { inByte: 9, inBit: 5, outByte: 74 },
          { inByte: 9, inBit: 6, outByte: 75 },
          { inByte: 9, inBit: 7, outByte: 76 },
        ],
      }
    );

    // The interaction between the FX SELECT buttons and the QuickEffect enable buttons is rather complex.
    // It is easier to have this separate from the S5MixerColumn dhe FX SELECT buttons are not
    // really in the mixer columns.
    this.mixer = new Mixer(this.inReports, this.outReports);

    // There is no consistent offset between the left and right deck,
    // so every single components' IO needs to be specified individually
    // for both decks.
    this.leftDeck = new S5Deck(
      [1, 3],
      [settings.deckColors[0], settings.deckColors[2]],

      this.effectUnit1,
      this.mixer,
      this.inReports,
      this.outReports[128],
      {
        playButton: { inByte: 17, inBit: 0, outByte: 55 },
        cueButton: { inByte: 17, inBit: 1, outByte: 8 },
        syncButton: { inByte: 5, inBit: 7, outByte: 14 },
        hotcuePadModeButton: { inByte: 4, inBit: 2, outByte: 9 },
        recordPadModeButton: { inByte: 4, inBit: 3, outByte: 56 },
        samplesPadModeButton: { inByte: 4, inBit: 4, outByte: 57 },
        mutePadModeButton: { inByte: 4, inBit: 5, outByte: 58 },
        stemsPadModeButton: { inByte: 5, inBit: 0, outByte: 10 },
        deckButtonLeft: { inByte: 5, inBit: 2 },
        deckButtonRight: { inByte: 5, inBit: 3 },
        deckButtonOutputByteOffset: 12,
        shiftButton: { inByte: 5, inBit: 1, outByte: 59 },
        leftEncoder: { inByte: 19, inBit: 0 },
        leftEncoderPress: { inByte: 6, inBit: 2 },
        rightEncoder: { inByte: 19, inBit: 4 },
        rightEncoderPress: { inByte: 6, inBit: 5 },
        libraryEncoder: { inByte: 20, inBit: 0 },
        libraryEncoderPress: { inByte: 0, inBit: 1 },
        turntableButton: { inByte: 5, inBit: 5, outByte: 17 },
        jogButton: { inByte: 5, inBit: 4, outByte: 16 },
        gridButton: { inByte: 5, inBit: 6, outByte: 18 },
        reverseButton: { inByte: 1, inBit: 4, outByte: 60 },
        fluxButton: { inByte: 1, inBit: 5, outByte: 61 },
        libraryPlayButton: { inByte: 0, inBit: 5, outByte: 22 },
        libraryStarButton: { inByte: 0, inBit: 4, outByte: 21 },
        libraryPlaylistButton: { inByte: 1, inBit: 1, outByte: 20 },
        libraryViewButton: { inByte: 1, inBit: 0, outByte: 19 },
        pads: [
          { inByte: 3, inBit: 5, outByte: 0 },
          { inByte: 3, inBit: 4, outByte: 1 },
          { inByte: 3, inBit: 7, outByte: 2 },
          { inByte: 3, inBit: 6, outByte: 3 },

          { inByte: 3, inBit: 3, outByte: 4 },
          { inByte: 3, inBit: 2, outByte: 5 },
          { inByte: 3, inBit: 1, outByte: 6 },
          { inByte: 3, inBit: 0, outByte: 7 },
        ],
      }
    );

    this.rightDeck = new S5Deck(
      [2, 4],
      [settings.deckColors[1], settings.deckColors[3]],
      this.effectUnit2,
      this.mixer,
      this.inReports,
      this.outReports[128],
      {
        playButton: { inByte: 17, inBit: 3, outByte: 66 },
        cueButton: { inByte: 17, inBit: 2, outByte: 31 },
        syncButton: { inByte: 14, inBit: 4, outByte: 37 },
        syncMasterButton: { inByte: 10, inBit: 0, outByte: 38 },
        hotcuePadModeButton: { inByte: 12, inBit: 2, outByte: 32 },
        recordPadModeButton: { inByte: 12, inBit: 3, outByte: 67 },
        samplesPadModeButton: { inByte: 12, inBit: 4, outByte: 68 },
        mutePadModeButton: { inByte: 12, inBit: 5, outByte: 69 },
        stemsPadModeButton: { inByte: 12, inBit: 1, outByte: 33 },
        deckButtonLeft: { inByte: 14, inBit: 2 },
        deckButtonRight: { inByte: 14, inBit: 3 },
        deckButtonOutputByteOffset: 35,
        shiftButton: { inByte: 14, inBit: 1, outByte: 70 },
        leftEncoder: { inByte: 20, inBit: 4 },
        leftEncoderPress: { inByte: 15, inBit: 5 },
        rightEncoder: { inByte: 21, inBit: 0 },
        rightEncoderPress: { inByte: 15, inBit: 2 },
        libraryEncoder: { inByte: 21, inBit: 4 },
        libraryEncoderPress: { inByte: 10, inBit: 1 },
        turntableButton: { inByte: 14, inBit: 6, outByte: 40 },
        jogButton: { inByte: 14, inBit: 0, outByte: 39 },
        gridButton: { inByte: 14, inBit: 7, outByte: 41 },
        reverseButton: { inByte: 10, inBit: 4, outByte: 71 },
        fluxButton: { inByte: 10, inBit: 5, outByte: 72 },
        libraryPlayButton: { inByte: 9, inBit: 2, outByte: 45 },
        libraryStarButton: { inByte: 9, inBit: 1, outByte: 44 },
        libraryPlaylistButton: { inByte: 9, inBit: 3, outByte: 43 },
        libraryViewButton: { inByte: 9, inBit: 0, outByte: 42 },
        pads: [
          { inByte: 13, inBit: 5, outByte: 23 },
          { inByte: 13, inBit: 4, outByte: 24 },
          { inByte: 13, inBit: 7, outByte: 25 },
          { inByte: 13, inBit: 6, outByte: 26 },

          { inByte: 13, inBit: 3, outByte: 27 },
          { inByte: 13, inBit: 2, outByte: 28 },
          { inByte: 13, inBit: 1, outByte: 29 },
          { inByte: 13, inBit: 0, outByte: 30 },
        ],
      }
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
          if (that.leftDeck.shifted || that.rightDeck.shifted) {
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
