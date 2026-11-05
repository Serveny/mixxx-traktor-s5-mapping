import type { HIDReportHolder } from '../../hid-report';
import type { Btn as ButtonMapping } from '../../types/mapping';
import { ButtonBrightnessOff, ButtonBrightnessOn, settings } from '../../settings';
import type { MixxxChannelGroup } from '../../types/mixxx-controls';
import {
	ControlComponent,
	LongPressMixin,
	SetInOutKeyMixin,
	ShiftMixin,
	SingleColorOutMixin,
} from '../component';
import type { S5Deck } from '../s5-deck';
import type { ControlInOutOptions } from '../../types/component';

export class SyncButton extends SingleColorOutMixin(
	ShiftMixin(
		LongPressMixin(
			SetInOutKeyMixin(
				ControlComponent<
					MixxxChannelGroup,
					ControlInOutOptions<MixxxChannelGroup>
				>
			)
		)
	)
) {
	declare group: MixxxChannelGroup;
	declare inKey: MixxxControls.CtrlRW<MixxxChannelGroup>;
	declare outKey: MixxxControls.Ctrl<MixxxChannelGroup>;

	constructor(deck: S5Deck, reports: HIDReportHolder, io: ButtonMapping) {
		const key = 'sync_enabled';
		super({
			group: deck.group,
			inKey: key,
			outKey: key,
			reports,
			io,
		});
	}

	// Beat fraction the deck may drift from the tempo master before SYNC turns red.
	static readonly phaseTolerance = 0.05;
	private phaseOffset: number | null = null;
	private lastLed = -1;

	onShortRelease() {
		if (this.isShifted && !settings.useKeylockOnMaster) {
			// -- 🚜 S5 Docs 4.2.6:
			// "While playing, pressing SHIFT + SYNC sets the Deck as the Tempo Master."
			script.toggleControl(this.group, 'sync_leader');
			return;
		}
		script.toggleControl(this.group, this.inKey);
		if (!this.isShifted) {
			engine.softTakeover(this.group, 'rate', true);
		}
	}

	output(_value: number) {
		this.lastLed = -1;
		this.render();
	}

	setPhaseOffset(offset: number | null) {
		this.phaseOffset = offset;
		this.render();
	}

	// -- 🚜 S5 Docs 4.2.6:
	// Bright green = synced and in phase, bright red = synced but out of phase, dim green = not synced.
	private render() {
		if (this.outKey === 'keylock') {
			this.sendLed(engine.getValue(this.group, 'keylock') ? ButtonBrightnessOn : ButtonBrightnessOff, 0);
			return;
		}
		const synced =
			engine.getValue(this.group, 'sync_enabled') !== 0 ||
			engine.getValue(this.group, 'sync_leader') !== 0;
		const outOfPhase =
			synced &&
			this.phaseOffset !== null &&
			Math.abs(this.phaseOffset) > SyncButton.phaseTolerance;
		if (!synced) this.sendLed(ButtonBrightnessOff, 0);
		else if (outOfPhase) this.sendLed(0, ButtonBrightnessOn);
		else this.sendLed(ButtonBrightnessOn, 0);
	}

	// Byte 0 is the green LED, byte 1 the red one (verified on hardware).
	private sendLed(green: number, red: number) {
		const led = green * 256 + red;
		if (led === this.lastLed) return;
		this.lastLed = led;
		this.outReport.data[this.io.outByte] = green;
		this.outReport.data[this.io.outByte + 1] = red;
		this.outReport.send();
	}

	onLongPress() {
		if (this.isShifted) {
			engine.setValue(this.group, 'sync_key', 1);
			engine.setValue(this.group, 'sync_key', 0);
		} else {
			script.toggleControl(this.group, 'sync_enabled');
		}
	}

	onShift() {
		if (settings.useKeylockOnMaster) this.setKey('keylock');
	}

	onUnshift() {
		if (settings.useKeylockOnMaster) this.setKey('sync_enabled');
	}
}
