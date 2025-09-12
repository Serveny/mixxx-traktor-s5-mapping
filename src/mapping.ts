// In: from cotroller to software
export interface FullBytePosIn {
  inReportId: number;
  inByte: number;
}

export interface BytePosIn extends FullBytePosIn {
  inBit: number;
  inLengthBit: number;
}

// Out: from software to controller
export interface BytePosOut {
  outReportId: number;
  outByte: number;
  outLengthByte: number;
}

export interface BytePosInOut extends BytePosIn, BytePosOut {}

export type Button = BytePosInOut;
export type Meter = BytePosOut;

// Fader and Knobs (Report-ID 2) are always a 16bit int (in other words: inLengthBit is always 16)
export type Knob = FullBytePosIn;
export type Fader = FullBytePosIn;

export interface Encoder {
  touch: BytePosIn;
  press: BytePosIn;
  fade: BytePosIn;
}

export interface TouchKnob {
  touch: BytePosIn;
  fade: Fader;
}

/*
 * S% Mapping - Based on the official documentation:
 * https://www.native-instruments.com/fileadmin/ni_media/downloads/manuals/traktor/traktor_kontrol_s5_manual_german.pdf
 */
export interface S5Mapping {
  fxUnitLeft: S5FxUnitMapping;
  deckLeft: S5DeckMapping;
  mixer: S5MixerMapping;
  fxUnitRight: S5FxUnitMapping;
  deckRight: S5DeckMapping;
}

export interface S5MixerMapping {
  channelC: S5MixerChannelMapping;
  channelA: S5MixerChannelMapping;

  // Middle column
  mainGain: Knob;
  snap: Button;
  quantize: Button;
  boothGain: Knob;
  tempo: BytePosIn;
  cueMix: Knob;
  cueVol: Knob;
  aux: Button;
  auxToggle: Button;

  channelB: S5MixerChannelMapping;
  channelD: S5MixerChannelMapping;

  cross: Fader;
}

export interface S5MixerChannelMapping {
  gain: Knob;
  fxUnitAssignLeft: Button;
  fxUnitAssignRight: Button;
  volumeLevel: Meter;
  eqHigh: Knob;
  eqMid: Knob;
  eqLow: Knob;
  filter: Knob;
  filterBtn: Button;
  cue: Button;
  volume: Fader;
}

export interface S5DeckMapping {
  displayAreaAndControls: {
    settings: Button;
    display1: Button;
    display2: Button;
    performanceMode1: Button;
    view: Button;
    display3: Button;
    display4: Button;
    performanceMode2: Button;
  };
  browseControls: {
    browse: Encoder;
    back: Button;
  };
  modeSelect: {
    hotcue: Button;
    freeze: Button;
    remix: Button;
  };
  pads: [Button, Button, Button, Button, Button, Button, Button, Button];
  phase: Meter;
  transportControls: { shift: Button; sync: Button; cue: Button; play: Button };
  flux: Button;
  loop: Encoder;
  deck: Button;
}

export interface S5DisplayArea {
  settings: Button;
  display1: Button;
  display2: Button;
  performanceMode1: Button;
  view: Button;
  display3: Button;
  display4: Button;
  performanceMode2: Button;
}

export interface S5FxUnitMapping {
  knobs: [TouchKnob, TouchKnob, TouchKnob, TouchKnob];
  buttons: [Button, Button, Button, Button];
}
