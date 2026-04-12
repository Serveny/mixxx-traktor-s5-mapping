export type DeckChannel = 1 | 2 | 3 | 4;

export type MixxxChannelGroup = `[Channel${DeckChannel}]`;

export type EqualizerGroup<TGroup extends MixxxChannelGroup = MixxxChannelGroup> =
	`[EqualizerRack1_${TGroup}_Effect1]`;

export type QuickEffectGroup<
	TGroup extends MixxxChannelGroup = MixxxChannelGroup,
> = `[QuickEffectRack1_${TGroup}]`;

export type EffectUnitGroup<TUnit extends number = number> =
	`[EffectRack1_EffectUnit${TUnit}]`;

export type AuxiliaryGroup<TIndex extends number = number> =
	`[Auxiliary${TIndex}]`;

export type MicrophoneGroup<TIndex extends number = number> =
	`[Microphone${TIndex}]`;

export function channelGroup(channel: DeckChannel): MixxxChannelGroup {
	return `[Channel${channel}]`;
}

export function equalizerGroup<TGroup extends MixxxChannelGroup>(
	group: TGroup
): EqualizerGroup<TGroup> {
	return `[EqualizerRack1_${group}_Effect1]`;
}

export function quickEffectGroup<TGroup extends MixxxChannelGroup>(
	group: TGroup
): QuickEffectGroup<TGroup> {
	return `[QuickEffectRack1_${group}]`;
}
