// vendor_ff01_2
const pushButtons = {
  leftDeck: {
    displayAreaAndControls: {
      settings: 38,
      display1: 33,
      display2: 39,
      performanceMode1: 32,
      view: 28,
      display3: 27,
      display4: 29,
      performanceMode2: 26,
    },
    browseControls: {
      encoderTouch: 84,
      encoderPress: 25,
      back: 24,
    },
    modeSelect: {
      hotcue: 54,
      freeze: 59,
      remix: 55,
    },
    pads: [52, 51, 53, 50, 46, 41, 47, 40],
    transportControls: {
      play: 42,
      cue: 45,
      sync: 43,
      shift: 44,
    },
    flux: 48,
    loop: {
      encoderTouch: 85,
      encoderPress: 30,
    },
    deck: 31,
    fxUnit: {
      fx1KnobTouch: 3,
      fx2KnobTouch: 2,
      fx3KnobTouch: 1,
      fx4KnobTouch: 0,
      fx1: 18,
      fx2: 21,
      fx3: 19,
      fx4: 20,
    },
  },
  rightDeck: {
    displayAreaAndControls: {
      settings: 76,
      display1: 77,
      display2: 78,
      performanceMode1: 79,
      view: 109,
      display3: 106,
      display4: 110,
      performanceMode2: 105,
    },
    browseControls: {
      encoderTouch: 86,
      encoderPress: 88,
      back: 89,
    },
    modeSelect: {
      hotcue: 104,
      freeze: 111,
      remix: 103,
    },
    pads: [99, 101, 97, 108, 100, 98, 102, 107],
    transportControls: {
      play: 69,
      cue: 66,
      sync: 65,
      shift: 68,
    },
    flux: 96,
    loop: {
      encoderTouch: 87,
      encoderPress: 91,
    },
    deck: 90,
    fxUnit: {
      fx1KnobTouch: 7,
      fx2KnobTouch: 6,
      fx3KnobTouch: 5,
      fx4KnobTouch: 4,
      fx1: 80,
      fx2: 81,
      fx3: 82,
      fx4: 83,
    },
  },
  mixer: {
    channelC: {
      fxAssignLeft: 11,
      fxAssignRight: 10,
      filter: 13,
      cue: 12,
    },
    channelA: {
      fxAssignLeft: 9,
      fxAssignRight: 14,
      filter: 17,
      cue: 16,
    },
    channelB: {
      fxAssignLeft: 72,
      fxAssignRight: 73,
      filter: 58,
      cue: 61,
    },
    channelD: {
      fxAssignLeft: 74,
      fxAssignRight: 76,
      filter: 62,
      cue: 60,
    },
    snap: 8,
    quantize: 15,
    aux: 59,
    auxStatus: 64,
  },
};

// vendor_ff01_3
const encoders = {
  leftDeck: {
    browse: 0,
    loop: 1,
  },
  rightDeck: {
    browse: 2,
    loop: 3,
  },
  mixer: {
    tempo: 4,
  },
};

// vendor_ff01_4_b[0]: Left touch strip
// vendor_ff01_41[0]: right touch strip
