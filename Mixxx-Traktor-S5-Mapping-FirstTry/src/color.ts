export const LedColors = {
  off: 0,
  red: 4,
  carrot: 8,
  orange: 12,
  honey: 16,
  yellow: 20,
  lime: 24,
  green: 28,
  aqua: 32,
  celeste: 36,
  sky: 40,
  blue: 44,
  purple: 48,
  fuscia: 52,
  magenta: 56,
  azalea: 60,
  salmon: 64,
  white: 68,
};

// This define the sequence of color to use for pad button when in keyboard mode. This should make them look like an actual keyboard keyboard octave, except for C, which is green to help spotting it.
export const KeyboardColors = [
  LedColors.green,
  LedColors.off,
  LedColors.white,
  LedColors.off,
  LedColors.white,
  LedColors.white,
  LedColors.off,
  LedColors.white,
  LedColors.off,
  LedColors.white,
  LedColors.off,
  LedColors.white,
];

// The LEDs only support 16 base colors. Adding 1 in addition to
// the normal 2 for Button.prototype.brightnessOn changes the color
// slightly, so use that get 25 different colors to include the Filter
// button as a 5th effect chain preset selector.
export const QuickEffectPresetColors = [
  LedColors.red,
  LedColors.green,
  LedColors.blue,
  LedColors.yellow,
  LedColors.orange,
  LedColors.purple,
  LedColors.white,

  LedColors.magenta,
  LedColors.azalea,
  LedColors.salmon,
  LedColors.red + 1,

  LedColors.sky,
  LedColors.celeste,
  LedColors.fuscia,
  LedColors.blue + 1,

  LedColors.carrot,
  LedColors.honey,
  LedColors.yellow + 1,

  LedColors.lime,
  LedColors.aqua,
  LedColors.purple + 1,

  LedColors.magenta + 1,
  LedColors.azalea + 1,
  LedColors.salmon + 1,
  LedColors.fuscia + 1,
];
