// Group types are taken from Mixxx's mixxx-controls.d.ts (MixxxControls.Group), the source of truth.
// Mixxx only exports the union of all groups, so the single groups are picked out of it:
// - MixxxGroup<pattern>: every Mixxx group matching the pattern (never if Mixxx drops it).
// - S5Group<group>: a narrower group for the S5's fixed numbers; fails to compile if Mixxx has no such group.
type MixxxGroup<TPattern extends string> = Extract<MixxxControls.Group, TPattern>;
type S5Group<TGroup extends MixxxControls.Group> = TGroup;

// The S5 controls four decks.
export type DeckChannel = 1 | 2 | 3 | 4;

export type MixxxChannelGroup = S5Group<`[Channel${DeckChannel}]`>;
export type EqualizerGroup = S5Group<`[EqualizerRack1_${MixxxChannelGroup}_Effect1]`>;
export type QuickEffectGroup = S5Group<`[QuickEffectRack1_${MixxxChannelGroup}]`>;

export type EffectUnitGroup = MixxxGroup<`[EffectRack1_EffectUnit${number}]`>;
export type EffectGroup = MixxxGroup<`[EffectRack1_EffectUnit${number}_Effect${number}]`>;
export type AuxiliaryGroup = MixxxGroup<`[Auxiliary${number}]`>;
export type MicrophoneGroup = MixxxGroup<`[Microphone${number}]`>;
export type SamplerGroup = MixxxGroup<`[Sampler${number}]`>;
export type StemGroup = MixxxGroup<`[Channel${number}_Stem${number}]`>;
export type StemQuickEffectGroup = MixxxGroup<`[QuickEffectRack1_[Channel${number}_Stem${number}]]`>;

export function channelGroup(channel: DeckChannel): MixxxChannelGroup {
	return `[Channel${channel}]`;
}

// The first microphone is [Microphone], not [Microphone1] (manual, note on [MicrophoneN]).
// shortcut: the generated Mixxx types only know [Microphone${number}], so [Microphone] is cast; drop the
// cast once the manual's type exporter includes [Microphone].
export function microphoneGroup(channel: DeckChannel): MicrophoneGroup {
	return (channel === 1 ? '[Microphone]' : `[Microphone${channel}]`) as MicrophoneGroup;
}

export function equalizerGroup(group: MixxxChannelGroup): EqualizerGroup {
	return `[EqualizerRack1_${group}_Effect1]`;
}

export function quickEffectGroup(group: MixxxChannelGroup): QuickEffectGroup {
	return `[QuickEffectRack1_${group}]`;
}
