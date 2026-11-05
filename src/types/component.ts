import type { ControlComponent } from '../components/component';
import type { HIDReportHolder } from '../hid-report';
import type { BytePosIn, BytePosInOut, BytePosOut } from './mapping';

export type ComponentConstructor<T extends object = object> = new (
	...args: any[]
) => T;
export type ControlComponentConstructor<
	TGroup extends MixxxControls.Group = MixxxControls.Group,
	P extends ControlOptions<TGroup> = ControlOptions<TGroup>,
> = new (
	...args: any[]
) => ControlComponent<TGroup, P>;

export interface ComponentOptions {}

export type ComponentChild = object;

export interface InOptions extends ComponentOptions {
	input?: (value: number) => void;
	reports: HIDReportHolder;
	io: BytePosIn;
}

export interface ControlOptions<
	TGroup extends MixxxControls.Group,
> extends ComponentOptions {
	group: TGroup;
}

export interface ControlInOptions<TGroup extends MixxxControls.Group>
	extends InOptions, ControlOptions<TGroup> {
	inKey: MixxxControls.CtrlRW<TGroup>;
}

export interface OutOptions extends ComponentOptions {
	output?: (value: number) => void;
	reports: HIDReportHolder;
	io: BytePosOut;
}

export interface ControlOutOptions<TGroup extends MixxxControls.Group>
	extends OutOptions, ControlOptions<TGroup> {
	outKey: MixxxControls.Ctrl<TGroup>;
}

export interface ControlInOutOptions<TGroup extends MixxxControls.Group>
	extends ControlInOptions<TGroup>, ControlOutOptions<TGroup> {
	io: BytePosInOut;
}

