/// Created by Be <be@mixxx.org> and A. Colombier <mixxx@acolombier.dev>

import { S5 } from './s5';

// Constant used to define custom default pad layout
const DefaultPadLayoutHotcue = 'hotcue';
const DefaultPadLayoutSamplerBeatloop = 'samplerBeatloop';
const DefaultPadLayoutKeyboard = 'keyboard';

// assign samplers to the crossfader on startup
const SamplerCrossfaderAssign = true;

/*
 * Kontrol S5 hardware-specific constants
 */

const wheelRelativeMax = 2 ** 32 - 1;
const wheelAbsoluteMax = 2879;

const wheelTimerMax = 2 ** 32 - 1;
const wheelTimerTicksPerSecond = 100000000; // One tick every 10ns

const baseRevolutionsPerSecond = BaseRevolutionsPerMinute / 60;
const wheelTicksPerTimerTicksToRevolutionsPerSecond =
  wheelTimerTicksPerSecond / wheelAbsoluteMax;

const wheelLEDmodes = {
  off: 0,
  dimFlash: 1,
  spot: 2,
  ringFlash: 3,
  dimSpot: 4,
  individuallyAddressable: 5, // set byte 4 to 0 and set byes 8 - 40 to color values
};

// The mode available, which the wheel can be used for.
const wheelModes = {
  jog: 0,
  vinyl: 1,
  motor: 2,
  loopIn: 3,
  loopOut: 4,
};

const moveModes = {
  beat: 0,
  bpm: 1,
  grid: 2,
  keyboard: 3,
};

// tracks state across input reports
let wheelTimer = null;
// This is a global variable so the S5Deck Components have access
// to it and it is guaranteed to be calculated before processing
// input for the Components.
let wheelTimerDelta = 0;

/* eslint no-unused-vars: "off", no-var: "off" */
export var TraktorS5 = new S5();
