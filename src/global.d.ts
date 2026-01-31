declare namespace MixxxControls {
  interface Config {
    strict: true;
  }
}

declare var script: {
  LIBRARY_COLUMNS: Readonly<{
    ARTIST: 1;
    TITLE: 2;
    ALBUM: 3;
    ALBUM_ARTIST: 4;
    YEAR: 5;
    GENRE: 6;
    COMPOSER: 7;
    GROUPING: 8;
    TRACK_NUMBER: 9;
    FILETYPE: 10;
    NATIVE_LOCATION: 11;
    COMMENT: 12;
    DURATION: 13;
    BITRATE: 14;
    BPM: 15;
    REPLAY_GAIN: 16;
    DATETIME_ADDED: 17;
    TIMES_PLAYED: 18;
    RATING: 19;
    KEY: 20;
    PREVIEW: 21;
    COVERART: 22;
    TRACK_COLOR: 30;
    LAST_PLAYED: 31;
  }>;
  debug: (
    channel: any,
    control: any,
    value: any,
    status: any,
    group: any
  ) => void;
  midiDebug: (
    channel: any,
    control: any,
    value: any,
    status: any,
    group: any
  ) => void;
  pitch: (LSB: any, MSB: any, status: any) => any;
  midiPitch:
    | ((LSB: any, MSB: any, status: any) => number | false)
    | ((arg0: any, arg1: any, arg2: any) => any);
  absoluteSlider: (
    group: any,
    key: any,
    value: any,
    low: any,
    high: any,
    min: any,
    max: any
  ) => void;
  absoluteLin:
    | ((value: any, low: any, high: any, min: any, max: any) => any)
    | ((arg0: any, arg1: number, arg2: number, arg3: any, arg4: any) => number);
  deckFromGroup: (group: any) => number;
  bindConnections: (group: any, controlsToFunctions: any, remove: any) => void;
  toggleControl: (group: any, control: any) => void;
  triggerControl: (group: any, control: any, delay: any) => void;
  absoluteLinInverse: (
    value: any,
    low: any,
    high: any,
    min: any,
    max: any
  ) => any;
  absoluteNonLin: (
    value: any,
    low: any,
    mid: any,
    high: any,
    min: any,
    max: any
  ) => any;
  absoluteNonLinInverse: (
    value: any,
    low: any,
    mid: any,
    high: any,
    min: any,
    max: any
  ) => any;
  crossfaderCurve: (value: any, min: any, max: any) => void;
  posMod: (a: any, m: any) => number;
  loopMove: (group: any, direction: any, numberOfBeats: any) => void;
  spinback: (
    channel: any,
    control: any,
    value: any,
    status: any,
    group: any,
    factor: any,
    rate: any
  ) => void;
  brake: (
    channel: any,
    control: any,
    value: any,
    status: any,
    group: any,
    factor: any
  ) => void;
  softStart: (
    channel: any,
    control: any,
    value: any,
    status: any,
    group: any,
    factor: any
  ) => void;
  samplerRegEx: RegExp;
  channelRegEx: RegExp;
  eqRegEx: RegExp;
  quickEffectRegEx: RegExp;
  effectUnitRegEx: RegExp;
  individualEffectRegEx: RegExp;
};
