/// Created by Be <be@mixxx.org> and A. Colombier <mixxx@acolombier.dev>
import { S5 } from './s5';

/* eslint no-unused-vars: "off", no-var: "off" */
// prettier-ignore
export var TraktorS5 = new S5({
    /*
   * Left side
   */
  fxUnitLeft: {
    knobs: [
      {
        touch: { inByte: 3, inBit: 3, inLengthBit: 1 },
        fade : { inByte: 0, inBit: 0, inLengthBit: 1 },
      },
      {
        touch: { inByte: 3, inBit: 2, inLengthBit: 1 },
        fade : { inByte: 0, inBit: 0, inLengthBit: 1 },
      },
      {
        touch: { inByte: 3, inBit: 1, inLengthBit: 1 },
        fade : { inByte: 0, inBit: 0, inLengthBit: 1 },
      },
      {
        touch: { inByte: 3, inBit: 0, inLengthBit: 1 },
        fade : { inByte: 0, inBit: 0, inLengthBit: 1 },
      },
    ],
    buttons: [
      { inByte: 5, inBit: 2, inLengthBit: 1, outByte: 24, outLengthByte: 1 },
      { inByte: 5, inBit: 5, inLengthBit: 1, outByte: 25, outLengthByte: 1 },
      { inByte: 5, inBit: 3, inLengthBit: 1, outByte: 26, outLengthByte: 1 },
      { inByte: 5, inBit: 4, inLengthBit: 1, outByte: 27, outLengthByte: 1 },
    ],
  },
  deckLeft: {
    displayAreaAndControls: {
      settings        : { inByte: 7, inBit: 6, inLengthBit: 1, outByte: 28, outLengthByte: 1 },
      display1        : { inByte: 7, inBit: 1, inLengthBit: 1, outByte: 29, outLengthByte: 1 },
      display2        : { inByte: 7, inBit: 7, inLengthBit: 1, outByte: 30, outLengthByte: 1 },
      performanceMode1: { inByte: 7, inBit: 0, inLengthBit: 1, outByte: 31, outLengthByte: 1 },
      view            : { inByte: 6, inBit: 4, inLengthBit: 1, outByte: 32, outLengthByte: 1 },
      display3        : { inByte: 6, inBit: 3, inLengthBit: 1, outByte: 33, outLengthByte: 1 },
      display4        : { inByte: 6, inBit: 5, inLengthBit: 1, outByte: 34, outLengthByte: 1 },
      performanceMode2: { inByte: 6, inBit: 2, inLengthBit: 1, outByte: 35, outLengthByte: 1 },
    },
    browseControls: {
      browse: {
        touch: { inByte: 13, inBit: 4, inLengthBit: 1 },
        press: { inByte: 6, inBit: 1, inLengthBit: 1 },
        fade : { inByte: 0, inBit: 0, inLengthBit: 4 },
      },
      back: { inByte: 6, inBit: 0, inLengthBit: 1, outByte: 36, outLengthByte: 1 },
    },
    modeSelect: {
      hotcue: { inByte: 9, inBit: 6, inLengthBit: 1, outByte: 42, outLengthByte: 2 },
      freeze: { inByte: 9, inBit: 1, inLengthBit: 1, outByte: 44, outLengthByte: 2 },
      remix : { inByte: 9, inBit: 7, inLengthBit: 1, outByte: 46, outLengthByte: 2 },
    },
    pads: [
      { inByte: 9, inBit: 4, inLengthBit: 1, outByte: 0, outLengthByte: 3 },
      { inByte: 9, inBit: 3, inLengthBit: 1, outByte: 3, outLengthByte: 3 },
      { inByte: 9, inBit: 5, inLengthBit: 1, outByte: 6, outLengthByte: 3 },
      { inByte: 9, inBit: 2, inLengthBit: 1, outByte: 9, outLengthByte: 3 },
      { inByte: 8, inBit: 6, inLengthBit: 1, outByte: 12, outLengthByte: 3 },
      { inByte: 8, inBit: 1, inLengthBit: 1, outByte: 15, outLengthByte: 3 },
      { inByte: 8, inBit: 7, inLengthBit: 1, outByte: 18, outLengthByte: 3 },
      { inByte: 8, inBit: 0, inLengthBit: 1, outByte: 21, outLengthByte: 3 },
    ],
    transportControls: {
      shift: { inByte: 8, inBit: 4, inLengthBit: 1, outByte: 49, outLengthByte: 1 },
      sync : { inByte: 8, inBit: 3, inLengthBit: 1, outByte: 50, outLengthByte: 2 },
      cue  : { inByte: 8, inBit: 5, inLengthBit: 1, outByte: 52, outLengthByte: 1 },
      play : { inByte: 8, inBit: 2, inLengthBit: 1, outByte: 53, outLengthByte: 1 },
    },
    flux: { inByte: 9, inBit: 0, inLengthBit: 1, outByte: 48, outLengthByte: 1 },
    loop: {
      touch: { inByte: 13, inBit: 5, inLengthBit: 1 },
      press: { inByte: 6, inBit: 6, inLengthBit: 1 },
      fade : { inByte: 0, inBit: 0, inLengthBit: 1 },
    },
    deck: { inByte: 6, inBit: 7, inLengthBit: 1, outByte: 38, outLengthByte: 2 },
  },
      /*
   * Middle (Mixer)
   */
  mixer: {
    channelC: {
      gain         : { inByte: 0, inBit: 0, inLengthBit: 1 },
      fxUnit1Assign: { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      fxUnit2Assign: { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      eqHigh       : { inByte: 0, inBit: 0, inLengthBit: 1 },
      eqMid        : { inByte: 0, inBit: 0, inLengthBit: 1 },
      eqLow        : { inByte: 0, inBit: 0, inLengthBit: 1 },
      filter       : { inByte: 0, inBit: 0, inLengthBit: 1 },
      filterBtn    : { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      cue          : { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      volume       : { inByte: 0, inBit: 0, inLengthBit: 1 },
    },
    channelA: {
      gain         : { inByte: 0, inBit: 0, inLengthBit: 1 },
      fxUnit1Assign: { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      fxUnit2Assign: { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      eqHigh       : { inByte: 0, inBit: 0, inLengthBit: 1 },
      eqMid        : { inByte: 0, inBit: 0, inLengthBit: 1 },
      eqLow        : { inByte: 0, inBit: 0, inLengthBit: 1 },
      filter       : { inByte: 0, inBit: 0, inLengthBit: 1 },
      filterBtn    : { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      cue          : { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      volume       : { inByte: 0, inBit: 0, inLengthBit: 1 },
    },
    mainVol     : { inByte: 0, inBit: 0, inLengthBit: 1 },
    snap        : { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
    quantize    : { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
    boothVol    : { inByte: 0, inBit: 0, inLengthBit: 1 },
    tempoEncoder: {
      touch: { inByte: 0, inBit: 0, inLengthBit: 1 },
      press: { inByte: 0, inBit: 0, inLengthBit: 1 },
      fade : { inByte: 0, inBit: 0, inLengthBit: 1 },
    },
    cueMix   : { inByte: 0, inBit: 0, inLengthBit: 1 },
    cueVol   : { inByte: 0, inBit: 0, inLengthBit: 1 },
    aux      : { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
    auxToggle: { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
    channelB : {
      gain         : { inByte: 0, inBit: 0, inLengthBit: 1 },
      fxUnit1Assign: { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      fxUnit2Assign: { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      eqHigh       : { inByte: 0, inBit: 0, inLengthBit: 1 },
      eqMid        : { inByte: 0, inBit: 0, inLengthBit: 1 },
      eqLow        : { inByte: 0, inBit: 0, inLengthBit: 1 },
      filter       : { inByte: 0, inBit: 0, inLengthBit: 1 },
      filterBtn    : { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      cue          : { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      volume       : { inByte: 0, inBit: 0, inLengthBit: 1 },
    },
    channelD: {
      gain         : { inByte: 0, inBit: 0, inLengthBit: 1 },
      fxUnit1Assign: { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      fxUnit2Assign: { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      eqHigh       : { inByte: 0, inBit: 0, inLengthBit: 1 },
      eqMid        : { inByte: 0, inBit: 0, inLengthBit: 1 },
      eqLow        : { inByte: 0, inBit: 0, inLengthBit: 1 },
      filter       : { inByte: 0, inBit: 0, inLengthBit: 1 },
      filterBtn    : { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      cue          : { inByte: 0, inBit: 0, inLengthBit: 1, outByte: 0, outLengthByte: 1 },
      volume       : { inByte: 0, inBit: 0, inLengthBit: 1 },
    },
    cross: { inByte: 0, inBit: 0, inLengthBit: 1 },
  },
      /*
   * Right side
   */
  fxUnitRight: {
    knobs: [
      {
        touch: { inByte: 3, inBit: 7, inLengthBit: 1 },
        fade : { inByte: 0, inBit: 0, inLengthBit: 1 },
      },
      {
        touch: { inByte: 3, inBit: 6, inLengthBit: 1 },
        fade : { inByte: 0, inBit: 0, inLengthBit: 1 },
      },
      {
        touch: { inByte: 3, inBit: 5, inLengthBit: 1 },
        fade : { inByte: 0, inBit: 0, inLengthBit: 1 },
      },
      {
        touch: { inByte: 3, inBit: 4, inLengthBit: 1 },
        fade : { inByte: 0, inBit: 0, inLengthBit: 1 },
      },
    ],
    buttons: [
      { inByte: 13, inBit: 0, inLengthBit: 1, outByte: 24, outLengthByte: 1 },
      { inByte: 13, inBit: 1, inLengthBit: 1, outByte: 25, outLengthByte: 1 },
      { inByte: 13, inBit: 2, inLengthBit: 1, outByte: 26, outLengthByte: 1 },
      { inByte: 13, inBit: 3, inLengthBit: 1, outByte: 27, outLengthByte: 1 },
    ],
  },
  deckRight: {
    displayAreaAndControls: {
      settings        : { inByte: 12, inBit: 4, inLengthBit: 1, outByte: 28, outLengthByte: 1 },
      display1        : { inByte: 12, inBit: 5, inLengthBit: 1, outByte: 29, outLengthByte: 1 },
      display2        : { inByte: 12, inBit: 6, inLengthBit: 1, outByte: 30, outLengthByte: 1 },
      performanceMode1: { inByte: 12, inBit: 7, inLengthBit: 1, outByte: 31, outLengthByte: 1 },
      view            : { inByte: 16, inBit: 5, inLengthBit: 1, outByte: 32, outLengthByte: 1 },
      display3        : { inByte: 16, inBit: 2, inLengthBit: 1, outByte: 33, outLengthByte: 1 },
      display4        : { inByte: 16, inBit: 6, inLengthBit: 1, outByte: 34, outLengthByte: 1 },
      performanceMode2: { inByte: 16, inBit: 1, inLengthBit: 1, outByte: 35, outLengthByte: 1 },
    },
    browseControls: {
      browse: {
        touch: { inByte: 13, inBit: 6, inLengthBit: 1 },
        press: { inByte: 14, inBit: 0, inLengthBit: 1 },
        fade : { inByte: 0, inBit: 0, inLengthBit: 4 },
      },
      back: { inByte: 14, inBit: 1, inLengthBit: 1, outByte: 36, outLengthByte: 1 },
    },
    modeSelect: {
      hotcue: { inByte: 16, inBit: 0, inLengthBit: 1, outByte: 42, outLengthByte: 2 },
      freeze: { inByte: 16, inBit: 7, inLengthBit: 1, outByte: 44, outLengthByte: 2 },
      remix : { inByte: 15, inBit: 7, inLengthBit: 1, outByte: 46, outLengthByte: 2 },
    },
    pads: [
      { inByte: 15, inBit: 3, inLengthBit: 1, outByte: 0, outLengthByte: 3 },
      { inByte: 15, inBit: 5, inLengthBit: 1, outByte: 3, outLengthByte: 3 },
      { inByte: 15, inBit: 1, inLengthBit: 1, outByte: 6, outLengthByte: 3 },
      { inByte: 16, inBit: 4, inLengthBit: 1, outByte: 9, outLengthByte: 3 },
      { inByte: 15, inBit: 4, inLengthBit: 1, outByte: 12, outLengthByte: 3 },
      { inByte: 15, inBit: 2, inLengthBit: 1, outByte: 15, outLengthByte: 3 },
      { inByte: 15, inBit: 6, inLengthBit: 1, outByte: 18, outLengthByte: 3 },
      { inByte: 16, inBit: 3, inLengthBit: 1, outByte: 21, outLengthByte: 3 },
    ],
    transportControls: {
      shift: { inByte: 11, inBit: 4, inLengthBit: 1, outByte: 49, outLengthByte: 1 },
      sync : { inByte: 11, inBit: 1, inLengthBit: 1, outByte: 50, outLengthByte: 2 },
      cue  : { inByte: 11, inBit: 2, inLengthBit: 1, outByte: 52, outLengthByte: 1 },
      play : { inByte: 11, inBit: 5, inLengthBit: 1, outByte: 53, outLengthByte: 1 },
    },
    flux: { inByte: 15, inBit: 0, inLengthBit: 1, outByte: 48, outLengthByte: 1 },
    loop: {
      touch: { inByte: 13, inBit: 7, inLengthBit: 1 },
      press: { inByte: 14, inBit: 3, inLengthBit: 1 },
      fade : { inByte: 0, inBit: 0, inLengthBit: 1 },
    },
    deck: { inByte: 14, inBit: 2, inLengthBit: 1, outByte: 38, outLengthByte: 2 },
  },
});
