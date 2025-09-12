/// Created by Be <be@mixxx.org> and A. Colombier <mixxx@acolombier.dev>
import type { S5Mapping } from './mapping';
import { S5 } from './s5';

// prettier-ignore
export const mapping: S5Mapping = {
  /*
   * Left side
   */
  fxUnitLeft: {
    knobs: [
      {
        touch: { inReportId: 1, inByte: 3, inBit: 3, inLengthBit: 1 },
        fade : { inReportId: 2, inByte: 58 },
      },
      {
        touch: { inReportId: 1, inByte: 3, inBit: 2, inLengthBit: 1 },
        fade : { inReportId: 2, inByte: 60 },
      },
      {
        touch: { inReportId: 1, inByte: 3, inBit: 1, inLengthBit: 1 },
        fade : { inReportId: 2, inByte: 62 },
      },
      {
        touch: { inReportId: 1, inByte: 3, inBit: 0, inLengthBit: 1 },
        fade : { inReportId: 2, inByte: 64 },
      },
    ],
    buttons: [
      { inReportId: 1, inByte: 5, inBit: 2, inLengthBit: 1, outReportId: 128, outByte: 24, outLengthByte: 1 },
      { inReportId: 1, inByte: 5, inBit: 5, inLengthBit: 1, outReportId: 128, outByte: 25, outLengthByte: 1 },
      { inReportId: 1, inByte: 5, inBit: 3, inLengthBit: 1, outReportId: 128, outByte: 26, outLengthByte: 1 },
      { inReportId: 1, inByte: 5, inBit: 4, inLengthBit: 1, outReportId: 128, outByte: 27, outLengthByte: 1 },
    ],
  },
  deckLeft: {
    displayAreaAndControls: {
      settings        : { inReportId: 1, inByte: 7, inBit: 6, inLengthBit: 1, outReportId: 128, outByte: 28, outLengthByte: 1 },
      display1        : { inReportId: 1, inByte: 7, inBit: 1, inLengthBit: 1, outReportId: 128, outByte: 29, outLengthByte: 1 },
      display2        : { inReportId: 1, inByte: 7, inBit: 7, inLengthBit: 1, outReportId: 128, outByte: 30, outLengthByte: 1 },
      performanceMode1: { inReportId: 1, inByte: 7, inBit: 0, inLengthBit: 1, outReportId: 128, outByte: 31, outLengthByte: 1 },
      view            : { inReportId: 1, inByte: 6, inBit: 4, inLengthBit: 1, outReportId: 128, outByte: 32, outLengthByte: 1 },
      display3        : { inReportId: 1, inByte: 6, inBit: 3, inLengthBit: 1, outReportId: 128, outByte: 33, outLengthByte: 1 },
      display4        : { inReportId: 1, inByte: 6, inBit: 5, inLengthBit: 1, outReportId: 128, outByte: 34, outLengthByte: 1 },
      performanceMode2: { inReportId: 1, inByte: 6, inBit: 2, inLengthBit: 1, outReportId: 128, outByte: 35, outLengthByte: 1 },
    },
    browseControls: {
      browse: {
        touch: { inReportId: 1, inByte: 13, inBit: 4, inLengthBit: 1 },
        press: { inReportId: 1, inByte: 6, inBit: 1, inLengthBit: 1 },
        fade : { inReportId: 1, inByte: 0, inBit: 0, inLengthBit: 4  },
      },
      back: { inReportId: 1, inByte: 6, inBit: 0, inLengthBit: 1, outReportId: 128, outByte: 36, outLengthByte: 1 },
    },
    modeSelect: {
      hotcue: { inReportId: 1, inByte: 9, inBit: 6, inLengthBit: 1, outReportId: 128, outByte: 42, outLengthByte: 2 },
      freeze: { inReportId: 1, inByte: 9, inBit: 1, inLengthBit: 1, outReportId: 128, outByte: 44, outLengthByte: 2 },
      remix : { inReportId: 1, inByte: 9, inBit: 7, inLengthBit: 1, outReportId: 128, outByte: 46, outLengthByte: 2 },
    },
    pads: [
      { inReportId: 1, inByte: 9, inBit: 4, inLengthBit: 1, outReportId: 128, outByte: 0, outLengthByte: 3 },
      { inReportId: 1, inByte: 9, inBit: 3, inLengthBit: 1, outReportId: 128, outByte: 3, outLengthByte: 3 },
      { inReportId: 1, inByte: 9, inBit: 5, inLengthBit: 1, outReportId: 128, outByte: 6, outLengthByte: 3 },
      { inReportId: 1, inByte: 9, inBit: 2, inLengthBit: 1, outReportId: 128, outByte: 9, outLengthByte: 3 },
      { inReportId: 1, inByte: 8, inBit: 6, inLengthBit: 1, outReportId: 128, outByte: 12, outLengthByte: 3 },
      { inReportId: 1, inByte: 8, inBit: 1, inLengthBit: 1, outReportId: 128, outByte: 15, outLengthByte: 3 },
      { inReportId: 1, inByte: 8, inBit: 7, inLengthBit: 1, outReportId: 128, outByte: 18, outLengthByte: 3 },
      { inReportId: 1, inByte: 8, inBit: 0, inLengthBit: 1, outReportId: 128, outByte: 21, outLengthByte: 3 },
    ],
    phase            : { outReportId: 128, outByte: 54, outLengthByte: 50, },
    transportControls: {
      shift: { inReportId: 1, inByte: 8, inBit: 4, inLengthBit: 1, outReportId: 128, outByte: 49, outLengthByte: 1 },
      sync : { inReportId: 1, inByte: 8, inBit: 3, inLengthBit: 1, outReportId: 128, outByte: 50, outLengthByte: 2 },
      cue  : { inReportId: 1, inByte: 8, inBit: 5, inLengthBit: 1, outReportId: 128, outByte: 52, outLengthByte: 1 },
      play : { inReportId: 1, inByte: 8, inBit: 2, inLengthBit: 1, outReportId: 128, outByte: 53, outLengthByte: 1 },
    },
    flux: { inReportId: 1, inByte: 9, inBit: 0, inLengthBit: 1, outReportId: 128, outByte: 48, outLengthByte: 1 },
    loop: {
      touch: { inReportId: 1, inByte: 13, inBit: 5, inLengthBit: 1 },
      press: { inReportId: 1, inByte: 6, inBit: 6, inLengthBit: 1 },
      fade : { inReportId: 1, inByte: 0, inBit: 4, inLengthBit: 4 },
    },
    deck: { inReportId: 1, inByte: 6, inBit: 7, inLengthBit: 1, outReportId: 128, outByte: 38, outLengthByte: 2 },
  },
              /*
   * Middle (Mixer)
   */
  mixer: {
    channelC: {
      gain             : { inReportId: 2, inByte: 38 },
      fxUnitAssignLeft : { inReportId: 1, inByte: 4, inBit: 3, inLengthBit: 1, outReportId: 130, outByte: 0, outLengthByte: 1 },
      fxUnitAssignRight: { inReportId: 1, inByte: 4, inBit: 2, inLengthBit: 1, outReportId: 130, outByte: 1, outLengthByte: 1 },
      volumeLevel      : {                                                     outReportId: 130, outByte: 19, outLengthByte: 11 },
      eqHigh           : { inReportId: 2, inByte: 20 },
      eqMid            : { inReportId: 2, inByte: 22 },
      eqLow            : { inReportId: 2, inByte: 24 },
      filter           : { inReportId: 2, inByte: 26 },
      filterBtn        : { inReportId: 1, inByte: 4, inBit: 5, inLengthBit: 1, outReportId: 130, outByte: 10, outLengthByte: 1 },
      cue              : { inReportId: 1, inByte: 4, inBit: 4, inLengthBit: 1, outReportId: 130, outByte: 14, outLengthByte: 1 },
      volume           : { inReportId: 2, inByte: 4, },
    },
    channelA: {
      gain             : { inReportId: 2, inByte: 38 },
      fxUnitAssignLeft : { inReportId: 1, inByte: 4, inBit: 1, inLengthBit: 1, outReportId: 130, outByte: 2, outLengthByte: 1 },
      fxUnitAssignRight: { inReportId: 1, inByte: 4, inBit: 6, inLengthBit: 1, outReportId: 130, outByte: 3, outLengthByte: 1 },
      volumeLevel      : {                                                     outReportId: 130, outByte: 30, outLengthByte: 11 },
      eqHigh           : { inReportId: 2, inByte: 20 },
      eqMid            : { inReportId: 2, inByte: 22 },
      eqLow            : { inReportId: 2, inByte: 24 },
      filter           : { inReportId: 2, inByte: 26 },
      filterBtn        : { inReportId: 1, inByte: 5, inBit: 1, inLengthBit: 1, outReportId: 130, outByte: 11, outLengthByte: 1 },
      cue              : { inReportId: 1, inByte: 5, inBit: 0, inLengthBit: 1, outReportId: 130, outByte: 15, outLengthByte: 1 },
      volume           : { inReportId: 2, inByte: 0 },
    },
    mainGain : { inReportId: 2, inByte: 10 },
    snap     : { inReportId: 1, inByte: 4, inBit: 0, inLengthBit: 1, outReportId: 130, outByte: 4, outLengthByte: 1 },
    quantize : { inReportId: 1, inByte: 4, inBit: 7, inLengthBit: 1, outReportId: 130, outByte: 5, outLengthByte: 1 },
    boothGain: { inReportId: 2, inByte: 12 },
    tempo    : { inReportId: 1, inByte: 2, inBit: 0, inLengthBit: 4 },
    cueMix   : { inReportId: 2, inByte: 14 },
    cueVol   : { inReportId: 2, inByte: 16 },
    aux      : { inReportId: 1, inByte: 11, inBit: 0, inLengthBit: 1, outReportId: 130, outByte: 16, outLengthByte: 1 },
    auxToggle: { inReportId: 1, inByte: 10, inBit: 3, inLengthBit: 1, outReportId: 130, outByte: 16, outLengthByte: 1 },
    channelB : {
      gain             : { inReportId: 2, inByte: 28 },
      fxUnitAssignLeft : { inReportId: 1, inByte: 12, inBit: 0, inLengthBit: 1, outReportId: 130, outByte: 6, outLengthByte: 1 },
      fxUnitAssignRight: { inReportId: 1, inByte: 12, inBit: 1, inLengthBit: 1, outReportId: 130, outByte: 7, outLengthByte: 1 },
      volumeLevel      : {                                                      outReportId: 130, outByte: 41, outLengthByte: 11 },
      eqHigh           : { inReportId: 2, inByte: 30 },
      eqMid            : { inReportId: 2, inByte: 32 },
      eqLow            : { inReportId: 2, inByte: 34 },
      filter           : { inReportId: 2, inByte: 36 },
      filterBtn        : { inReportId: 1, inByte: 10, inBit: 2, inLengthBit: 1, outReportId: 130, outByte: 12, outLengthByte: 1 },
      cue              : { inReportId: 1, inByte: 10, inBit: 5, inLengthBit: 1, outReportId: 130, outByte: 17, outLengthByte: 1 },
      volume           : { inReportId: 2, inByte: 2 },
    },
    channelD: {
      gain             : { inReportId: 2, inByte: 48 },
      fxUnitAssignLeft : { inReportId: 1, inByte: 12, inBit: 2, inLengthBit: 1, outReportId: 130, outByte: 8, outLengthByte: 1 },
      fxUnitAssignRight: { inReportId: 1, inByte: 12, inBit: 3, inLengthBit: 1, outReportId: 130, outByte: 9, outLengthByte: 1 },
      volumeLevel      : {                                                      outReportId: 130, outByte: 52, outLengthByte: 11 },
      eqHigh           : { inReportId: 2, inByte: 50 },
      eqMid            : { inReportId: 2, inByte: 52 },
      eqLow            : { inReportId: 2, inByte: 54 },
      filter           : { inReportId: 2, inByte: 56 },
      filterBtn        : { inReportId: 1, inByte: 10, inBit: 6, inLengthBit: 1, outReportId: 130, outByte: 13, outLengthByte: 1 },
      cue              : { inReportId: 1, inByte: 10, inBit: 4, inLengthBit: 1, outReportId: 130, outByte: 18, outLengthByte: 1 },
      volume           : { inReportId: 2, inByte: 6 },
    },
    cross: { inReportId: 2, inByte: 8 },
  },
              /*
   * Right side
   */
  fxUnitRight: {
    knobs: [
      {
        touch: { inReportId: 1, inByte: 3, inBit: 7, inLengthBit: 1 },
        fade : { inReportId: 2, inByte: 66 },
      },
      {
        touch: { inReportId: 1, inByte: 3, inBit: 6, inLengthBit: 1 },
        fade : { inReportId: 2, inByte: 68 },
      },
      {
        touch: { inReportId: 1, inByte: 3, inBit: 5, inLengthBit: 1 },
        fade : { inReportId: 2, inByte: 70 },
      },
      {
        touch: { inReportId: 1, inByte: 3, inBit: 4, inLengthBit: 1 },
        fade : { inReportId: 2, inByte: 72 },
      },
    ],
    buttons: [
      { inReportId: 1, inByte: 13, inBit: 0, inLengthBit: 1, outReportId: 129, outByte: 24, outLengthByte: 1 },
      { inReportId: 1, inByte: 13, inBit: 1, inLengthBit: 1, outReportId: 129, outByte: 25, outLengthByte: 1 },
      { inReportId: 1, inByte: 13, inBit: 2, inLengthBit: 1, outReportId: 129, outByte: 26, outLengthByte: 1 },
      { inReportId: 1, inByte: 13, inBit: 3, inLengthBit: 1, outReportId: 129, outByte: 27, outLengthByte: 1 },
    ],
  },
  deckRight: {
    displayAreaAndControls: {
      settings        : { inReportId: 1, inByte: 12, inBit: 4, inLengthBit: 1, outReportId: 129, outByte: 28, outLengthByte: 1 },
      display1        : { inReportId: 1, inByte: 12, inBit: 5, inLengthBit: 1, outReportId: 129, outByte: 29, outLengthByte: 1 },
      display2        : { inReportId: 1, inByte: 12, inBit: 6, inLengthBit: 1, outReportId: 129, outByte: 30, outLengthByte: 1 },
      performanceMode1: { inReportId: 1, inByte: 12, inBit: 7, inLengthBit: 1, outReportId: 129, outByte: 31, outLengthByte: 1 },
      view            : { inReportId: 1, inByte: 16, inBit: 5, inLengthBit: 1, outReportId: 129, outByte: 32, outLengthByte: 1 },
      display3        : { inReportId: 1, inByte: 16, inBit: 2, inLengthBit: 1, outReportId: 129, outByte: 33, outLengthByte: 1 },
      display4        : { inReportId: 1, inByte: 16, inBit: 6, inLengthBit: 1, outReportId: 129, outByte: 34, outLengthByte: 1 },
      performanceMode2: { inReportId: 1, inByte: 16, inBit: 1, inLengthBit: 1, outReportId: 129, outByte: 35, outLengthByte: 1 },
    },
    browseControls: {
      browse: {
        touch: { inReportId: 1, inByte: 13, inBit: 6, inLengthBit: 1 },
        press: { inReportId: 1, inByte: 14, inBit: 0, inLengthBit: 1 },
        fade : { inReportId: 1, inByte: 1, inBit: 0, inLengthBit: 4 },
      },
      back: { inReportId: 1, inByte: 14, inBit: 1, inLengthBit: 1, outReportId: 129, outByte: 36, outLengthByte: 1 },
    },
    modeSelect: {
      hotcue: { inReportId: 1, inByte: 16, inBit: 0, inLengthBit: 1, outReportId: 129, outByte: 42, outLengthByte: 2 },
      freeze: { inReportId: 1, inByte: 16, inBit: 7, inLengthBit: 1, outReportId: 129, outByte: 44, outLengthByte: 2 },
      remix : { inReportId: 1, inByte: 15, inBit: 7, inLengthBit: 1, outReportId: 129, outByte: 46, outLengthByte: 2 },
    },
    pads: [
      { inReportId: 1, inByte: 15, inBit: 3, inLengthBit: 1, outReportId: 129, outByte: 0, outLengthByte: 3 },
      { inReportId: 1, inByte: 15, inBit: 5, inLengthBit: 1, outReportId: 129, outByte: 3, outLengthByte: 3 },
      { inReportId: 1, inByte: 15, inBit: 1, inLengthBit: 1, outReportId: 129, outByte: 6, outLengthByte: 3 },
      { inReportId: 1, inByte: 16, inBit: 4, inLengthBit: 1, outReportId: 129, outByte: 9, outLengthByte: 3 },
      { inReportId: 1, inByte: 15, inBit: 4, inLengthBit: 1, outReportId: 129, outByte: 12, outLengthByte: 3 },
      { inReportId: 1, inByte: 15, inBit: 2, inLengthBit: 1, outReportId: 129, outByte: 15, outLengthByte: 3 },
      { inReportId: 1, inByte: 15, inBit: 6, inLengthBit: 1, outReportId: 129, outByte: 18, outLengthByte: 3 },
      { inReportId: 1, inByte: 16, inBit: 3, inLengthBit: 1, outReportId: 129, outByte: 21, outLengthByte: 3 },
    ],
    phase            : { outReportId: 129, outByte: 54, outLengthByte: 50, },
    transportControls: {
      shift: { inReportId: 1, inByte: 11, inBit: 4, inLengthBit: 1, outReportId: 129, outByte: 49, outLengthByte: 1 },
      sync : { inReportId: 1, inByte: 11, inBit: 1, inLengthBit: 1, outReportId: 129, outByte: 50, outLengthByte: 2 },
      cue  : { inReportId: 1, inByte: 11, inBit: 2, inLengthBit: 1, outReportId: 129, outByte: 52, outLengthByte: 1 },
      play : { inReportId: 1, inByte: 11, inBit: 5, inLengthBit: 1, outReportId: 129, outByte: 53, outLengthByte: 1 },
    },
    flux: { inReportId: 1, inByte: 15, inBit: 0, inLengthBit: 1, outReportId: 129, outByte: 48, outLengthByte: 1 },
    loop: {
      touch: { inReportId: 1, inByte: 13, inBit: 7, inLengthBit: 1 },
      press: { inReportId: 1, inByte: 14, inBit: 3, inLengthBit: 1 },
      fade : { inReportId: 1, inByte: 1, inBit: 4, inLengthBit: 4 },
    },
    deck: { inReportId: 1, inByte: 14, inBit: 2, inLengthBit: 1, outReportId: 129, outByte: 38, outLengthByte: 2 },
  },
};

/* eslint no-unused-vars: "off", no-var: "off" */
export var TraktorS5 = new S5(mapping);
