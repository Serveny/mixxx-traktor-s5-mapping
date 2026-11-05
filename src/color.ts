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
