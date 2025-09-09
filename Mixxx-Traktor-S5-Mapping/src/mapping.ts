// In: from cotroller to software
export interface BytePosIn {
  inByte: number;
  inBit: number;
}

// Out: from software to controller
export interface BytePosOut {
  outByte: number;
}

export interface BytePosInOut extends BytePosIn, BytePosOut {}

export interface Encoder {
  touch: BytePosIn;
  press: BytePosIn;
  fade: BytePosIn;
}

export type Button = BytePosInOut;
export type Fader = BytePosIn;
export type Knob = BytePosIn;

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
  mainVol: Knob;
  snap: Button;
  quantize: Button;
  boothVol: Knob;
  tempoEncoder: Encoder;
  cueMix: Knob;
  cueVol: Knob;
  aux: Button;
  auxToggle: Button;

  channelB: S5MixerChannelMapping;
  channelD: S5MixerChannelMapping;
}

export interface S5MixerChannelMapping {
  gain: Knob;
  fxUnit1Assign: Button;
  effectUnit2Assign: Button;
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
  knobs: [Knob, Knob, Knob, Knob];
  buttons: [Button, Button, Button, Button];
}
