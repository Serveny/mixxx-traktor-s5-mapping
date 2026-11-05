import { channelGroup, type MixxxChannelGroup } from './types/mixxx-controls';

export const ButtonBrightnessOn = 127;
export const ButtonBrightnessOff = 9;

export const channels = [
	channelGroup(1),
	channelGroup(2),
	channelGroup(3),
	channelGroup(4),
] as const satisfies readonly MixxxChannelGroup[];

// User settings from the mapping preferences (mapping/Traktor Kontrol S5.hid.xml).
export const settings = {
	loopEncoderMoveFactor:
		(engine.getSetting('loopEncoderMoveFactor') as number) || 500,
	loopEncoderShiftMoveFactor:
		(engine.getSetting('loopEncoderShiftMoveFactor') as number) || 2500,

	// SHIFT + SYNC toggles keylock instead of the tempo master.
	useKeylockOnMaster: !!engine.getSetting('useKeylockOnMaster'),

	// Drive the Mixxx software mixer with the S5's main, booth and headphone knobs as well.
	softwareMixerMain: !!engine.getSetting('softwareMixerMain'),
	softwareMixerBooth: !!engine.getSetting('softwareMixerBooth'),
	softwareMixerHeadphone: !!engine.getSetting('softwareMixerHeadphone'),

	// -- 🚜 S5 Docs 2.1.3:
	// "to use touch interactions when browsing, the touch sensitivity for the BROWSE encoder has to be enabled"
	autoOpenBrowserOnTouch: engine.getSetting('autoOpenBrowserOnTouch'),
};
