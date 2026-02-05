import type { HIDReportHodler } from '../hid-report';
import { settings } from '../settings';
import type { S5DeckMapping } from '../types/mapping';
import { BrowserEncoder } from './encoders/browser-encoder';
import { BrowserBackButton } from './buttons/browser-back-button';
import { CueButton } from './buttons/cue-button';
import { DeckButton } from './buttons/deck-button';
import { FluxButton } from './buttons/flux-button';
import { PlayButton } from './buttons/play-button';
import { ShiftButton } from './buttons/shift-button';
import { SyncButton } from './buttons/sync-button';
import { Deck } from './deck';
import type { Mixer } from './mixer';
import { loopEncoder } from './encoders/loop-encoder';
import type { S5EffectUnit } from './s5-effect-unit';
import { TouchStrip } from './touch-strip';
import { DisplayArea } from './display-area';
import { PadButton } from './buttons/pad-button';
import { HotcueModeButton } from './buttons/hotcue-mode-button';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import { FreezeButton } from './buttons/freeze-button';

export class S5Deck extends Deck {
	display: DisplayArea;
	browserEncoder: BrowserEncoder;
	browserBackButton: BrowserBackButton;
	deckButton: DeckButton;
	loopEncoder: loopEncoder;
	hotcueModeButton: HotcueModeButton;
	freezeButton: FreezeButton;
	fluxButton: FluxButton;
	pads: PadButton[] = [];
	touchStrip: TouchStrip;
	shiftButton: ShiftButton;
	syncButton: SyncButton;
	cueButton: CueButton;
	playButton: PlayButton;
	constructor(
		decks: number[],
		public effectUnit: S5EffectUnit,
		public mixer: Mixer,
		public reports: HIDReportHodler,
		io: S5DeckMapping
	) {
		super(decks, settings);

		this.display = new DisplayArea(this, io.displayAreaAndControls);

		this.browserEncoder = new BrowserEncoder(this, io.browseControls.browse);
		this.browserBackButton = new BrowserBackButton(
			this.display,
			this.reports,
			io.browseControls.back
		);
		this.deckButton = new DeckButton(this, io.deck);
		this.loopEncoder = new loopEncoder(this, io.loop);
		this.freezeButton = new FreezeButton(this, io.modeSelect.freeze);

		this.hotcueModeButton = new HotcueModeButton(
			this,
			io.modeSelect.hotcueMode
		);

		this.fluxButton = new FluxButton(this, io.flux);

		this.touchStrip = new TouchStrip(this, io.touchStrip);

		const transCltr = io.transportControls;
		this.shiftButton = new ShiftButton(this, transCltr.shift);
		this.syncButton = new SyncButton(this, reports, transCltr.sync);
		this.cueButton = new CueButton(this, transCltr.cue);
		this.playButton = new PlayButton(this, reports, transCltr.play);

		this.triggerComponents();

		// FIXME there is no feature about playlist at the moment, so we use this button to control the context menu, which has playlist control
		//this.libraryPlaylistButton = new Button({
		//group: '[Library]',
		//libraryEncoder: this.libraryEncoder,
		//outConnect: function () {
		//const connection = engine.makeConnection(
		//this.group,
		//'focused_widget',
		//(widget) => {
		//// 4 == Context menu
		//this.output(widget === 4);
		//}
		//);
		//// This is useful for case where effect would have been fully disabled in Mixxx. This appears to be the case during unit tests.
		//if (connection) {
		//this.outConnections[0] = connection;
		//} else {
		//console.warn(
		//`Unable to connect ${this.group}.focused_widget' to the controller output. The control appears to be unavailable.`
		//);
		//}
		//},
		//onShortRelease: function () {
		//const currentlyFocusWidget = engine.getValue(
		//'[Library]',
		//'focused_widget'
		//);
		//// 3 == Tracks table or root views of library features
		//// 4 == Context menu
		//if (currentlyFocusWidget !== 3 && currentlyFocusWidget !== 4) {
		//return;
		//}
		//script.toggleControl('[Library]', 'show_track_menu');
		//this.libraryEncoder.libraryPlayButtonPressed = false;

		//if (currentlyFocusWidget === 4) {
		//engine.setValue('[Library]', 'focused_widget', 3);
		//}
		//},
		//onShortPress: function () {
		//this.libraryEncoder.libraryPlayButtonPressed = true;
		//},
		//onLongRelease: function () {
		//this.libraryEncoder.libraryPlayButtonPressed = false;
		//},
		//onLongPress: function () {
		//engine.setValue('[Library]', 'clear_search', 1);
		//},
		//});
		//this.libraryViewButton = new Button({
		//group: '[Skin]',
		//key: 'show_maximized_library',
		//libraryEncoder: this.libraryEncoder,
		//libraryEncoderPress: this.libraryEncoderPress,
		//onShortRelease: function () {
		//script.toggleControl(this.group, this.inKey, true);
		//},
		//onLongPress: function () {
		//this.libraryEncoder.libraryViewButtonPressed = true;
		//this.libraryEncoderPress.libraryViewButtonPressed = true;
		//},
		//onLongRelease: function () {
		//this.libraryEncoder.libraryViewButtonPressed = false;
		//this.libraryEncoderPress.libraryViewButtonPressed = false;
		//},
		//});

		//this.keyboardPlayMode = null;
		//this.keyboardOffset = 9;

		for (let padNum = 1; padNum < 9; padNum++) {
			this.pads.push(new PadButton(padNum, this, io.pads[padNum - 1]));
		}
		//const hotcuePage2 = Array(8).fill({});
		//const hotcuePage3 = Array(8).fill({});
		//const samplerOrBeatloopRollPage = Array(8).fill({});
		//this.keyboard = Array(8).fill({});
		//let i = 0;
		///* eslint no-unused-vars: "off" */
		//for (const pad of hotcuePage2) {
		//// start with hotcue 5; hotcues 1-4 are in defaultPadLayer
		//hotcuePage2[i] = new HotcueButton({ number: i + 1 });
		//hotcuePage3[i] = new HotcueButton({ number: i + 13 });
		//if (UseBeatloopRollInsteadOfSampler) {
		//samplerOrBeatloopRollPage[i] = new BeatLoopRollButton({
		//number: i,
		//deck: this,
		//});
		//} else {
		//let samplerNumber = i + 1;
		//if (samplerNumber > 4) {
		//samplerNumber += 4;
		//}
		//if (decks[0] > 1) {
		//samplerNumber += 4;
		//}
		//samplerOrBeatloopRollPage[i] = new SamplerButton({
		//number: samplerNumber,
		//});
		//if (SamplerCrossfaderAssign) {
		//engine.setValue(
		//`[Sampler${samplerNumber}]`,
		//'orientation',
		//decks[0] === 1 ? 0 : 2
		//);
		//}
		//}
		//this.keyboard[i] = new KeyboardButton({
		//number: i + 1,
		//deck: this,
		//});
		//i++;
		//}

		//this.padLayers = {
		//defaultLayer: 0,
		//hotcuePage2: 1,
		//hotcuePage3: 2,
		//samplerPage: 3,
		//keyboard: 5,
		//};
		//switch (DefaultPadLayout) {
		//case DefaultPadLayoutHotcue:
		//switchPadLayer(this, hotcuePage2);
		//this.currentPadLayer = this.padLayers.hotcuePage2;
		//break;
		//case DefaultPadLayoutSamplerBeatloop:
		//switchPadLayer(this, samplerOrBeatloopRollPage);
		//this.currentPadLayer = this.padLayers.samplerPage;
		//break;
		//case DefaultPadLayoutKeyboard:
		//switchPadLayer(this, this.keyboard);
		//this.currentPadLayer = this.padLayers.keyboard;
		//break;
		//default:
		//switchPadLayer(this, defaultPadLayer);
		//this.currentPadLayer = this.padLayers.defaultLayer;
		//break;
		//}

		//this.hotcuePadModeButton = new Button({
		//deck: this,
		//onShortPress: function () {
		//if (!this.shifted) {
		//if (this.deck.currentPadLayer !== this.deck.padLayers.hotcuePage2) {
		//switchPadLayer(this.deck, hotcuePage2);
		//this.deck.currentPadLayer = this.deck.padLayers.hotcuePage2;
		//} else {
		//switchPadLayer(this.deck, defaultPadLayer);
		//this.deck.currentPadLayer = this.deck.padLayers.defaultLayer;
		//}
		//this.deck.lightPadMode();
		//} else {
		//switchPadLayer(this.deck, hotcuePage3);
		//this.deck.currentPadLayer = this.deck.padLayers.hotcuePage3;
		//this.deck.lightPadMode();
		//}
		//},
		//// hack to switch the LED color when changing decks
		//outTrigger: function () {
		//this.deck.lightPadMode();
		//},
		//});
		//// The record button doesn't have a mapping by default, but you can add yours here
		//// this.recordPadModeButton = new Button({
		////     ...
		//// });
		//this.samplesPadModeButton = new Button({
		//deck: this,
		//onShortPress: function () {
		//if (this.deck.currentPadLayer !== this.deck.padLayers.samplerPage) {
		//switchPadLayer(this.deck, samplerOrBeatloopRollPage);
		//engine.setValue('[Samplers]', 'show_samplers', true);
		//this.deck.currentPadLayer = this.deck.padLayers.samplerPage;
		//} else {
		//switchPadLayer(this.deck, defaultPadLayer);
		//engine.setValue('[Samplers]', 'show_samplers', false);
		//this.deck.currentPadLayer = this.deck.padLayers.defaultLayer;
		//}
		//this.deck.lightPadMode();
		//},
		//});
		//// The mute button doesn't have a mapping by default, but you can add yours here
		//// this.mutePadModeButton = new Button({
		////    ...
		//// });

		//this.stemsPadModeButton = new Button({
		//deck: this,
		//previousMoveMode: null,
		//onLongPress: function () {
		//if (this.deck.keyboardPlayMode !== null) {
		//this.deck.keyboardPlayMode = null;
		//this.deck.lightPadMode();
		//}
		//},
		//onShortPress: function () {
		//if (this.previousMoveMode === null) {
		//this.previousMoveMode = this.deck.moveMode;
		//this.deck.moveMode = moveModes.keyboard;
		//}
		//},
		//onShortRelease: function () {
		//if (this.previousMoveMode !== null && !this.deck.keyboardPlayMode) {
		//this.deck.moveMode = this.previousMoveMode;
		//this.previousMoveMode = null;
		//}
		//if (this.deck.currentPadLayer === this.deck.padLayers.keyboard) {
		//switchPadLayer(this.deck, defaultPadLayer);
		//this.deck.currentPadLayer = this.deck.padLayers.defaultLayer;
		//} else if (this.deck.currentPadLayer !== this.deck.padLayers.keyboard) {
		//switchPadLayer(this.deck, this.deck.keyboard);
		//this.deck.currentPadLayer = this.deck.padLayers.keyboard;
		//}
		//this.deck.lightPadMode();
		//},
		//onLongRelease: function () {
		//if (this.previousMoveMode !== null && !this.deck.keyboardPlayMode) {
		//this.deck.moveMode = this.previousMoveMode;
		//this.previousMoveMode = null;
		//}
		//},
		//// hack to switch the LED color when changing decks
		//outTrigger: function () {
		//this.deck.lightPadMode();
		//},
		//});

		//this.wheelMode = wheelModes.vinyl;
		//this.turntableButton = undefined;
		//this.jogButton = new Button({
		//deck: this,
		//input: function (press) {
		//if (press) {
		//this.deck.reverseButton.loopModeOff(true);
		//this.deck.fluxButton.loopModeOff(true);
		//if (this.deck.wheelMode === wheelModes.vinyl) {
		//this.deck.wheelMode = wheelModes.jog;
		//} else {
		//this.deck.wheelMode = wheelModes.vinyl;
		//}
		//engine.setValue(this.group, 'scratch2_enable', false);
		//this.outTrigger();
		//}
		//},
		//outTrigger: function () {
		//const vinylOn = this.deck.wheelMode === wheelModes.vinyl;
		//this.send(
		//this.color + (vinylOn ? this.brightnessOn : this.brightnessOff)
		//);
		//if (this.deck.turntableButton) {
		//const motorOn = this.deck.wheelMode === wheelModes.motor;
		//this.deck.turntableButton.send(
		//this.color + (motorOn ? this.brightnessOn : this.brightnessOff)
		//);
		//}
		//},
		//});

		//this.wheelTouch = new Button({
		//touched: false,
		//deck: this,
		//input: function (touched) {
		//this.touched = touched;
		//if (
		//this.deck.wheelMode === wheelModes.vinyl ||
		//this.deck.wheelMode === wheelModes.motor
		//) {
		//if (touched) {
		//engine.setValue(this.group, 'scratch2_enable', true);
		//} else {
		//this.stopScratchWhenOver();
		//}
		//}
		//},
		//stopScratchWhenOver: function () {
		//if (this.touched) {
		//return;
		//}

		//if (
		//engine.getValue(this.group, 'play') &&
		//engine.getValue(this.group, 'scratch2') <
		//1.5 * baseRevolutionsPerSecond &&
		//engine.getValue(this.group, 'scratch2') > 0
		//) {
		//engine.setValue(this.group, 'scratch2_enable', false);
		//} else if (engine.getValue(this.group, 'scratch2') === 0) {
		//engine.setValue(this.group, 'scratch2_enable', false);
		//} else {
		//engine.beginTimer(100, this.stopScratchWhenOver.bind(this), true);
		//}
		//},
		//});

		//// The relative and absolute position inputs have the same resolution but direction
		//// cannot be determined reliably with the absolute position because it is easily
		//// possible to spin the wheel fast enough that it spins more than half a revolution
		//// between input reports. So there is no need to process the absolution position
		//// at all; the relative position is sufficient.
		//this.wheelRelative = new Component({
		//oldValue: null,
		//deck: this,
		//speed: 0,
		//input: function (value, timestamp) {
		//if (this.oldValue === null) {
		//// This is to avoid the issue where the first time, we diff with 0, leading to the absolute value
		//this.oldValue = [value, timestamp, 0];
		//return;
		//}
		//let [oldValue, oldTimestamp, speed] = this.oldValue;

		//if (timestamp < oldTimestamp) {
		//oldTimestamp -= wheelTimerMax;
		//}

		//let diff = value - oldValue;
		//if (diff > wheelRelativeMax / 2) {
		//oldValue += wheelRelativeMax;
		//} else if (diff < -wheelRelativeMax / 2) {
		//oldValue -= wheelRelativeMax;
		//}

		//const currentSpeed = (value - oldValue) / (timestamp - oldTimestamp);
		//if (currentSpeed <= 0 === speed <= 0) {
		//speed = (speed + currentSpeed) / 2;
		//} else {
		//speed = currentSpeed;
		//}
		//this.oldValue = [value, timestamp, speed];
		//this.speed = wheelAbsoluteMax * speed * 10;

		//if (
		//this.speed === 0 &&
		//engine.getValue(this.group, 'scratch2') === 0 &&
		//engine.getValue(this.group, 'jog') === 0 &&
		//this.deck.wheelMode !== wheelModes.motor
		//) {
		//return;
		//}

		//switch (this.deck.wheelMode) {
		//case wheelModes.motor:
		//engine.setValue(this.group, 'scratch2', this.speed);
		//break;
		//case wheelModes.loopIn:
		//{
		//const loopStartPosition = engine.getValue(
		//this.group,
		//'loop_start_position'
		//);
		//const loopEndPosition = engine.getValue(
		//this.group,
		//'loop_end_position'
		//);
		//const value = Math.min(
		//loopStartPosition + this.speed * LoopWheelMoveFactor,
		//loopEndPosition - LoopWheelMoveFactor
		//);
		//engine.setValue(this.group, 'loop_start_position', value);
		//}
		//break;
		//case wheelModes.loopOut:
		//{
		//const loopEndPosition = engine.getValue(
		//this.group,
		//'loop_end_position'
		//);
		//const value = loopEndPosition + this.speed * LoopWheelMoveFactor;
		//engine.setValue(this.group, 'loop_end_position', value);
		//}
		//break;
		//case wheelModes.vinyl:
		//if (
		//this.deck.wheelTouch.touched ||
		//engine.getValue(this.group, 'scratch2') !== 0
		//) {
		//engine.setValue(this.group, 'scratch2', this.speed);
		//} else {
		//engine.setValue(this.group, 'jog', this.speed);
		//}
		//break;
		//default:
		//engine.setValue(this.group, 'jog', this.speed);
		//}
		//},
		//});

		//this.wheelLED = new Component({
		//deck: this,
		//lastPos: 0,
		//lastMode: null,
		//outConnect: function () {
		//if (this.group !== undefined) {
		//const connection0 = engine.makeConnection(
		//this.group,
		//'playposition',
		//(position) => this.output.bind(this)(position, true, true)
		//);
		//// This is useful for case where effect would have been fully disabled in Mixxx. This appears to be the case during unit tests.
		//if (connection0) {
		//this.outConnections[0] = connection0;
		//} else {
		//console.warn(
		//`Unable to connect ${this.group}.playposition' to the controller output. The control appears to be unavailable.`
		//);
		//}
		//const connection1 = engine.makeConnection(
		//this.group,
		//'play',
		//(play) =>
		//this.output.bind(this)(
		//engine.getValue(this.group, 'playposition'),
		//play,
		//play || engine.getValue(this.group, 'track_loaded')
		//)
		//);
		//// This is useful for case where effect would have been fully disabled in Mixxx. This appears to be the case during unit tests.
		//if (connection1) {
		//this.outConnections[1] = connection1;
		//} else {
		//console.warn(
		//`Unable to connect ${this.group}.play' to the controller output. The control appears to be unavailable.`
		//);
		//}
		//const connection2 = engine.makeConnection(
		//this.group,
		//'track_loaded',
		//(trackLoaded) =>
		//this.output.bind(this)(
		//engine.getValue(this.group, 'playposition'),
		//!trackLoaded ? false : engine.getValue(this.group, 'play'),
		//trackLoaded
		//)
		//);
		//// This is useful for case where effect would have been fully disabled in Mixxx. This appears to be the case during unit tests.
		//if (connection2) {
		//this.outConnections[2] = connection2;
		//} else {
		//console.warn(
		//`Unable to connect ${this.group}.track_loaded' to the controller output. The control appears to be unavailable.`
		//);
		//}
		//}
		//},
		//output: function (fractionOfTrack, playstate, trackLoaded) {
		//if (this.deck.wheelMode > wheelModes.motor) {
		//return;
		//}
		//// Emit cue haptic feedback if enabled
		//const samplePos = Math.round(
		//fractionOfTrack * engine.getValue(this.group, 'track_samples')
		//);

		//this.lastPos = samplePos;

		//const durationSeconds = engine.getValue(this.group, 'duration');
		//const positionSeconds = fractionOfTrack * durationSeconds;
		//const revolutions = positionSeconds * baseRevolutionsPerSecond;
		//const fractionalRevolution = revolutions - Math.floor(revolutions);
		//const LEDposition = fractionalRevolution * wheelAbsoluteMax;

		//const wheelOutput = new Uint8Array(40).fill(0);
		//wheelOutput[0] = decks[0] - 1;
		//wheelOutput[4] = this.color + Button.prototype.brightnessOn;

		//if (!trackLoaded) {
		//wheelOutput[1] = wheelLEDmodes.off;
		//} else if (
		//playstate &&
		//fractionOfTrack < 1 &&
		//engine.getValue(this.group, 'end_of_track') &&
		//WheelLedBlinkOnTrackEnd &&
		//!this.deck.wheelTouch.touched
		//) {
		//wheelOutput[1] = wheelLEDmodes.ringFlash;
		//} else {
		//wheelOutput[1] = wheelLEDmodes.spot;
		//wheelOutput[2] = LEDposition & 0xff;
		//wheelOutput[3] = LEDposition >> 8;
		//if (this.lastMode === wheelLEDmodes.ringFlash) {
		//wheelOutput[4] = Button.prototype.brightnessOff;
		//engine.beginTimer(
		//200,
		//() => this.output(fractionOfTrack, playstate, trackLoaded),
		//true
		//);
		//}
		//}
		//this.lastMode = wheelOutput[1];

		//controller.sendOutputReport(50, wheelOutput.buffer, true);
		//},
		//});

		//for (const property in this) {
		//if (Object.prototype.hasOwnProperty.call(this, property)) {
		//const component = this[property];
		//if (component instanceof Component) {
		//Object.assign(component, io[property]);
		//if (component.inReport === undefined) {
		//component.inReport = inReports[1];
		//}
		//component.outReport = outReport;
		//if (component.group === undefined) {
		//component.group = this.group;
		//}
		//if (component.color === undefined) {
		//component.color = this.color;
		//}
		//if (component instanceof Encoder) {
		//component.max = 2 ** component.inBitLength - 1;
		//}
		//component.inConnect();
		//component.outConnect();
		//component.outTrigger();
		//if (typeof this.unshift === 'function' && this.unshift.length === 0) {
		//this.unshift();
		//}
		//}
		//}
		//}
		//}

		//assignKeyboardPlayMode(group: string, action) {
		//this.keyboardPlayMode = {
		//group: group,
		//action: action,
		//};
		//this.lightPadMode();
		//}

		//lightPadMode() {
		//if (this.currentPadLayer === this.padLayers.hotcuePage2) {
		//this.hotcuePadModeButton.send(
		//this.hotcuePadModeButton.color + this.hotcuePadModeButton.brightnessOn
		//);
		//} else if (this.currentPadLayer === this.padLayers.hotcuePage3) {
		//this.hotcuePadModeButton.send(
		//LedColors.white + this.hotcuePadModeButton.brightnessOn
		//);
		//} else {
		//this.hotcuePadModeButton.send(
		//this.hotcuePadModeButton.color + this.hotcuePadModeButton.brightnessOff
		//);
		//}

		//// unfortunately the other pad mode buttons only have one LED color
		//// const recordPadModeLEDOn = this.currentPadLayer === this.padLayers.hotcuePage3;
		//// this.recordPadModeButton.send(recordPadModeLEDOn ? 127 : 0);

		//const samplesPadModeLEDOn =
		//this.currentPadLayer === this.padLayers.samplerPage;
		//this.samplesPadModeButton.send(samplesPadModeLEDOn ? 127 : 0);

		//// this.mutePadModeButtonLEDOn = this.currentPadLayer === this.padLayers.samplerPage2;
		//// const mutedModeButton.send(mutePadModeButtonLEDOn ? 127 : 0);
		//if (this.keyboardPlayMode !== null) {
		//this.stemsPadModeButton.send(
		//LedColors.green + this.stemsPadModeButton.brightnessOn
		//);
		//} else {
		//const keyboardPadModeLEDOn =
		//this.currentPadLayer === this.padLayers.keyboard;
		//this.stemsPadModeButton.send(
		//this.stemsPadModeButton.color +
		//(keyboardPadModeLEDOn
		//? this.stemsPadModeButton.brightnessOn
		//: this.stemsPadModeButton.brightnessOff)
		//);
		//}
		//}
	}

	switchDeck(newGroup: MixxxChannelGroup) {
		this.hotcueModeButton.output(0);
		this.freezeButton.output(0);
		super.switchDeck(newGroup);
	}

	//switchPadLayer(deck, newLayer) {
	//let index = 0;
	//for (let pad of deck.pads) {
	//pad.outDisconnect();
	//pad.inDisconnect();

	//pad = newLayer[index];
	//Object.assign(pad, io.pads[index]);
	//if (!(pad instanceof HotcueButton)) {
	//pad.color = deck.color;
	//}
	//// don't change the group of SamplerButtons
	//if (!(pad instanceof SamplerButton)) {
	//pad.group = deck.group;
	//}
	//if (pad.inReport === undefined) {
	//pad.inReport = inReports[1];
	//}
	//pad.outReport = outReport;
	//pad.inConnect();
	//pad.outConnect();
	//pad.outTrigger();
	//deck.pads[index] = pad;
	//index++;
	//}
	//};
}
