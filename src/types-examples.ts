class Button<TGroup extends MixxxControls.Group> {
	constructor(
		public group: TGroup,
		public inKey: MixxxControls.CtrlRW<TGroup>,
		public outKey: MixxxControls.Ctrl<TGroup>
	) {}

	enable(): void {
		engine.setValue(this.group, this.inKey, 1);
	}

	read(): number {
		return engine.getValue(this.group, this.outKey);
	}
}

const playBtn = new Button('[Channel2]', 'play', 'play_indicator');
const syncBtn = new Button(
	'[EffectRack1_EffectUnit3_Effect3]',
	'clear',
	'loaded'
);
