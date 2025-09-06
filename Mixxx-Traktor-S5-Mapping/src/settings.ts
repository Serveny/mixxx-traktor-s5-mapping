import { LedColors } from './color';

/*
 * USER CONFIGURABLE SETTINGS
 * Change settings in the preferences
 */

function getLedColorSetting(setting: string): number | undefined {
  const val = engine.getSetting(setting) as string;
  return (LedColors as any)[val];
}

const tempoFaderTicksPerMm = 4096 / 77; // 53.1948.
const tempoCenterRangeMm =
  (engine.getSetting('tempoCenterRangeMm') as number) || 1.0;
const tempoCenterRangeTicks = tempoFaderTicksPerMm * tempoCenterRangeMm;
const tempoCenterValueOffsetLeft =
  ((engine.getSetting('tempoCenterOffsetMmLeft') as number) || 0.0) *
  tempoFaderTicksPerMm;
const tempoCenterValueOffsetRight =
  ((engine.getSetting('tempoCenterOffsetMmRight') as number) || 0.0) *
  tempoFaderTicksPerMm;

export const settings = {
  deckColors: [
    getLedColorSetting('deckA') || LedColors.red,
    getLedColorSetting('deckB') || LedColors.blue,
    getLedColorSetting('deckC') || LedColors.yellow,
    getLedColorSetting('deckD') || LedColors.purple,
  ],

  librarySortableColumns: () =>
    [
      engine.getSetting('librarySortableColumns1Value'),
      engine.getSetting('librarySortableColumns2Value'),
      engine.getSetting('librarySortableColumns3Value'),
      engine.getSetting('librarySortableColumns4Value'),
      engine.getSetting('librarySortableColumns5Value'),
      engine.getSetting('librarySortableColumns6Value'),
    ]
      .map((c) => parseInt(c as string))
      .filter((c) => c), // Filter '0' column, equivalent to '---' value in the UI or disabled

  loopWheelMoveFactor: engine.getSetting('loopWheelMoveFactor') || 50,
  loopEncoderMoveFactor: engine.getSetting('loopEncoderMoveFactor') || 500,
  loopEncoderShiftMoveFactor:
    engine.getSetting('loopEncoderShiftMoveFactor') || 2500,

  tempoFaderSoftTakeoverColorLow:
    getLedColorSetting('tempoFaderSoftTakeoverColorLow') || LedColors.white,
  tempoFaderSoftTakeoverColorHigh:
    getLedColorSetting('tempoFaderSoftTakeoverColorHigh') || LedColors.green,

  // Tempo fader center snap range
  // Transform user value (mm) into upper/lower values
  tempoCenterRangeMm,
  // In theory we have an 80 mm fader. Though, the usable range appears to be only ~77 mm.
  // Value range is 0..4096, but we only get 510 steps with 8/9 ticks resolution
  // and therefore need to make sure the center zone can actually be reached.
  // A diff of 15 should be safe, this corresponds to .3 mm.
  tempoFaderTicksPerMm,
  tempoCenterRangeTicks,
  // Value center may be off the labeled center.
  // Use this setting to compensate per device.
  tempoCenterValueOffsetLeft:
    ((engine.getSetting('tempoCenterOffsetMmLeft') as number) || 0.0) *
    tempoFaderTicksPerMm,
  tempoCenterValueOffsetRright:
    ((engine.getSetting('tempoCenterOffsetMmRight') as number) || 0.0) *
    tempoFaderTicksPerMm,
  tempoCenterUpperLeft:
    4096 / 2 + tempoCenterRangeTicks / 2 + tempoCenterValueOffsetLeft,
  tempoCenterLowerLeft:
    4096 / 2 - tempoCenterRangeTicks / 2 + tempoCenterValueOffsetLeft,
  tempoCenterUpperRight:
    4096 / 2 + tempoCenterRangeTicks / 2 + tempoCenterValueOffsetRight,
  tempoCenterLowerRight:
    4096 / 2 - tempoCenterRangeTicks / 2 + tempoCenterValueOffsetRight,

  // Define whether or not to keep LED that have only one color (reverse, flux, play, shift) dimmed if they are inactive.
  // 'true' will keep them dimmed, 'false' will turn them off. Default: true
  inactiveLightsAlwaysBacklit: !!engine.getSetting(
    'inactiveLightsAlwaysBacklit'
  ),

  // Keep both deck select buttons backlit and do not fully turn off the inactive deck button.
  // 'true' will keep the unselected deck dimmed, 'false' to fully turn it off. Default: true
  deckSelectAlwaysBacklit: !!engine.getSetting('deckSelectAlwaysBacklit'),

  // Define whether the keylock is mapped when doing "shift+master" (on press) or "shift+sync" (on release since long push copies the key)".
  // 'true' will use "sync+master", 'false' will use "shift+sync". Default: false
  useKeylockOnMaster: !!engine.getSetting('useKeylockOnMaster'),

  // Define whether the grid button would blink when the playback is going over a detected beat. Can help to adjust beat grid.
  // Default: false
  gridButtonBlinkOverBeat: !!engine.getSetting('gridButtonBlinkOverBeat'),

  // Wheel led blinking if reaching the end of track warning (default 30 seconds, can be changed in the settings, under "Waveforms" > "End of track warning").
  // Default: true
  wheelLedBlinkOnTrackEnd: !!engine.getSetting('wheelLedBlinkOnTrackEnd'),

  // When shifting either decks, the mixer will control microphones or auxiliary lines. If there is both a mic and an configure on the same channel, the mixer will control the auxiliary.
  // Default: false
  mixerControlsMixAuxOnShift: !!engine.getSetting('mixerControlsMicAuxOnShift'),

  // Make the sampler tab a beatlooproll tab instead
  // Default: false
  useBeatloopRollInsteadOfSampler: !!engine.getSetting(
    'useBeatloopRollInsteadOfSampler'
  ),

  // Predefined beatlooproll sizes. Note that if you use AddLoopHalveAndDoubleOnBeatloopRollTab, the first and
  // last size will be ignored
  beatLoopRolls: [
    engine.getSetting('beatLoopRollsSize1') || 1 / 8,
    engine.getSetting('beatLoopRollsSize2') || 1 / 4,
    engine.getSetting('beatLoopRollsSize3') || 1 / 2,
    engine.getSetting('beatLoopRollsSize4') || 1,
    engine.getSetting('beatLoopRollsSize5') || 2,
    engine.getSetting('beatLoopRollsSize6') || 4,
    engine.getSetting('beatLoopRollsSize7') || 'half',
    engine.getSetting('beatLoopRollsSize8') || 'double',
  ],

  // Define the speed of the jogwheel. This will impact the speed of the LED playback indicator, the scratch, and the speed of
  // the motor if enable. Recommended value are 33 + 1/3 or 45.
  // Default: 33 + 1/3
  baseRevolutionsPerMinute:
    engine.getSetting('baseRevolutionsPerMinute') || 33 + 1 / 3,

  // Define how much the wheel will resist. It is a similar setting that the Grid+Wheel in Tracktor
  // Value must defined between 0 to 1. 0 is very tight, 1 is very loose.
  // Default: 0.5
  tightnessFactor: engine.getSetting('tightnessFactor') || 0.5,

  // Define how much force can the motor use. This defines how much the wheel will "fight" you when you block it in TT mode
  // This will also affect how quick the wheel starts spinning when enabling motor mode, or starting a deck with motor mode on
  maxWheelForce: engine.getSetting('maxWheelForce') || 25000, // Traktor seems to cap the max value at 60000, which just sounds insane

  // Map the mixer potentiometers to different components of the software mixer in Mixxx, on top of the physical control of the hardware
  // mixer embedded in the S5. This is useful if you are not using certain S5 outputs.
  softwareMixerMain: !!engine.getSetting('softwareMixerMain'),
  softwareMixerBooth: !!engine.getSetting('softwareMixerBooth'),
  softwareMixerHeadphone: !!engine.getSetting('softwareMixerHeadphone'),

  // Define custom default layout used by the pads, instead of intro/outro  and first 4 hotcues.

  defaultPadLayout: engine.getSetting('defaultPadLayout'),
};
