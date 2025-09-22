import { Mixer } from './components/mixer';
import { S5Deck } from './components/s5-deck';
import type { S5Mapping } from './types/mapping';
import { settings } from './settings';
import { HIDReportHodler } from './hid-report';
import { S5EffectUnit } from './components/s5-effect-unit';

export class S5 {
  reports = new HIDReportHodler();
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

    this.fxUnitLeft = new S5EffectUnit(1, this.reports, io.fxUnitLeft);
    this.fxUnitRight = new S5EffectUnit(2, this.reports, io.fxUnitRight);

    this.mixer = new Mixer(this, io.mixer);

    // There is no consistent offset between the left and right deck,
    // so every single components' IO needs to be specified individually
    // for both decks.
    this.deckLeft = new S5Deck(
      [1, 3],
      [settings.deckColors[0], settings.deckColors[2]],

      this.fxUnitLeft,
      this.mixer,
      this.reports,
      io.deckLeft
    );

    this.deckRight = new S5Deck(
      [2, 4],
      [settings.deckColors[1], settings.deckColors[3]],
      this.fxUnitRight,
      this.mixer,
      this.reports,
      io.deckRight
    );

    const volumeMeter = [
      this.mixer.channelA.loudnessMeter,
      this.mixer.channelC.loudnessMeter,
      this.mixer.channelB.loudnessMeter,
      this.mixer.channelD.loudnessMeter,
    ];

    engine.makeConnection('[App]', 'gui_tick_50ms_period_s', (_value) => {
      for (const meter of volumeMeter) meter.output();
      this.reports.out[130].send();
    });
  }

  incomingData(data: Uint8Array) {
    const reportId = data[0];

    if (reportId in this.reports.in) {
      this.reports.in[reportId].handleInput(data.buffer.slice(1));
    } else {
      console.warn(
        `Unsupported HID repord with ID ${reportId}. Contains: ${data}`
      );
    }
  }

  init() {
    // get state of knobs and faders
    for (const repordId of [1, 2]) {
      this.reports.in[repordId].handleInput(
        controller.getInputReport(repordId)
      );
    }
  }

  shutdown() {
    // left LEDs
    controller.sendOutputReport(128, new Uint8Array(104).fill(0).buffer);

    // mixer LEDs
    controller.sendOutputReport(130, new Uint8Array(73).fill(0).buffer);

    // right LEDs
    controller.sendOutputReport(129, new Uint8Array(104).fill(0).buffer);
  }
}
