import type { ControlInOutOptions } from '../../types/component';
import type { Btn } from '../../types/mapping';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';
import {
	ControlComponent,
	ControlInMixin,
	ControlOutMixin,
	IndicatorMixin,
	LongPressMixin,
	SetInOutKeyMixin,
	ShiftMixin,
} from '../component';
import type { S5Deck } from '../s5-deck';

export class FluxButton extends SetInOutKeyMixin(
	LongPressMixin(
		IndicatorMixin(
			ShiftMixin(
				ControlOutMixin(
					ControlInMixin(
						ControlComponent<
							MixxxChannelGroup,
							ControlInOutOptions<MixxxChannelGroup>
						>
					)
				)
			)
		)
	)
) {
	declare group: MixxxChannelGroup;
	declare inKey: MixxxControls.CtrlRW<MixxxChannelGroup>;
	declare outKey: MixxxControls.Ctrl<MixxxChannelGroup>;

	private loopModeConnection: ScriptConnection | null = null;

	constructor(
		private deck: S5Deck,
		io: Btn
	) {
		const key = 'slip_enabled';
		super({
			group: deck.group,
			inKey: key,
			outKey: key,
			reports: deck.reports,
			io,
		});
	}

	onUnshift() {
		this.setKey('slip_enabled');
	}

	onShift() {
		this.setKey('loop_enabled');
	}

	loopModeOff() {
		if (!this.deck.loopMoveMode) return;
		this.indicator(false);
		this.deck.loopMoveMode = false;
		this.loopModeConnection?.disconnect();
		this.loopModeConnection = null;
	}

	onLoopChange(loopEnabled: number) {
		if (!loopEnabled) this.loopModeOff();
	}

	onShortPress() {
		this.indicator(false);
		if (this.isShifted) {
			const loopEnabled = engine.getValue(this.group, 'loop_enabled');
			// Without a loop, close one at the playhead; with a loop, toggle loop move mode.
			if (!loopEnabled) {
				engine.setValue(this.group, 'loop_out', 1);
			} else if (!this.deck.loopMoveMode) {
				engine.setValue(this.group, 'scratch2_enable', 0);
				this.deck.loopMoveMode = true;
				this.loopModeConnection =
					engine.makeConnection(this.group, this.outKey, this.onLoopChange.bind(this)) ?? null;
				this.indicator(true);
			} else {
				this.loopModeOff();
			}
		} else {
			// -- 🚜 S5 Docs 3.4:
			// "Press the FLUX button to enable FLUX mode ... Press the FLUX button again to exit FLUX mode."
			script.toggleControl(this.group, this.inKey);
		}
	}

	rebindGroup(group: MixxxChannelGroup) {
		this.loopModeOff();
		super.rebindGroup(group);
	}
}
