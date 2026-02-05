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

export const colorMap = new ColorMapper({
	0xcc0000: LedColors.red,
	0xcc5e00: LedColors.carrot,
	0xcc7800: LedColors.orange,
	0xcc9200: LedColors.honey,

	0xcccc00: LedColors.yellow,
	0x81cc00: LedColors.lime,
	0x00cc00: LedColors.green,
	0x00cc49: LedColors.aqua,

	0x00cccc: LedColors.celeste,
	0x0091cc: LedColors.sky,
	0x0000cc: LedColors.blue,
	0xcc00cc: LedColors.purple,

	0xcc0091: LedColors.fuscia,
	0xcc0079: LedColors.magenta,
	0xcc477e: LedColors.azalea,
	0xcc4761: LedColors.salmon,

	0xcccccc: LedColors.white,
});

export class RgbColor {
	constructor(
		public rgbNumber: number,
		private _brightness: number = 1
	) {}

	static fromRgb(r: number, g: number, b: number): RgbColor {
		return new RgbColor((r << 16) + (g << 8) + b);
	}

	r() {
		return this._brightness * ((this.rgbNumber >> 16) & 0xff);
	}

	g() {
		return this._brightness * ((this.rgbNumber >> 8) & 0xff);
	}

	b() {
		return this._brightness * (this.rgbNumber & 0xff);
	}

	brightness(factor: number): this {
		this._brightness = factor;
		return this;
	}

	static white(): RgbColor {
		return new RgbColor(8355711);
	}
	static blue(): RgbColor {
		return new RgbColor(127);
	}
}
