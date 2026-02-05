// In: from cotroller to software
export interface FullBytePosIn {
	inReportId: number;
	inByte: number;
}

export interface BytePosIn extends FullBytePosIn {
	inBit: number;
	inLengthBit: number;
}

// Out: from software to controller
export interface BytePosOut {
	outReportId: number;
	outByte: number;
	outLengthByte: number;
}

export interface BytePosInOut extends BytePosIn, BytePosOut {}

export type Btn = BytePosInOut;
export type Meter = BytePosOut;

// Fader and Knobs (Report-ID 2) are always a 16bit int (in other words: inLengthBit is always 16)
export type Knob = FullBytePosIn;
export type Fader = FullBytePosIn;

export interface Encoder {
	press: BytePosIn;
	fade: BytePosIn;
}

export interface TouchEncoder extends Encoder {
	touch: BytePosIn;
}

export interface TouchKnob {
	touch: BytePosIn;
	fade: Fader;
}

export interface BlueRedLeds {
	blue: Meter;
	red: Meter;
}

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
	channelC: S5MixerColumnMapping;
	channelA: S5MixerColumnMapping;

	// Middle column
	mainGain: Knob;
	snap: Btn;
	quantize: Btn;
	boothGain: Knob;
	tempo: Encoder;
	cueMix: Knob;
	cueGain: Knob;
	aux: Btn;
	auxToggle: Btn;

	channelB: S5MixerColumnMapping;
	channelD: S5MixerColumnMapping;

	cross: Fader;
}

export interface S5MixerColumnMapping {
	gain: Knob;
	fxUnitAssignLeft: Btn;
	fxUnitAssignRight: Btn;
	volumeLevel: Meter;
	eqHigh: Knob;
	eqMid: Knob;
	eqLow: Knob;
	filter: Knob;
	filterBtn: Btn;
	cue: Btn;
	volume: Fader;
}

export interface S5DeckMapping {
	displayAreaAndControls: S5DisplayArea;
	browseControls: {
		browse: TouchEncoder;
		back: Btn;
	};
	modeSelect: {
		hotcueMode: Btn;
		freeze: Btn;
		remix: Btn;
	};
	pads: [Btn, Btn, Btn, Btn, Btn, Btn, Btn, Btn];
	touchStrip: TouchStripMapping;
	transportControls: { shift: Btn; sync: Btn; cue: Btn; play: Btn };
	flux: Btn;
	loop: TouchEncoder;
	deck: Btn;
}

export interface S5DisplayArea {
	settings: Btn;
	display1: Btn;
	display2: Btn;
	performanceModeLeft: Btn;
	view: Btn;
	display3: Btn;
	display4: Btn;
	performanceModeRight: Btn;
}

export interface S5FxUnitMapping {
	knobs: [TouchKnob, TouchKnob, TouchKnob, TouchKnob];
	buttons: [Btn, Btn, Btn, Btn];
}

export interface TouchStripMapping {
	leds: BlueRedLeds;
	touch: BytePosIn;
}

export interface HidInReportField {
	callback: CallableFunction;
	io: BytePosIn;
	oldData?: number;
}
