import type { ControlComponent } from '../components/component';
import type { HIDReportHodler } from '../hid-report';
import type { BytePosIn, BytePosInOut, BytePosOut } from './mapping';

// export type ComponentConstructor<T extends any[] = any[], R = {}> = new (...args: T) => R;
export type ComponentConstructor<T = {}> = new (...args: any[]) => T;
// export type ComponentConstructor<TOptions extends ComponentOptions> = new (...args: any[]) => Component<TOptions>;
export type ControlComponentConstructor = new (
  ...args: any[]
) => ControlComponent<any, any>;

export interface ComponentOptions {}

export interface InOptions extends ComponentOptions {
  input?: (value: number) => void;
  reports: HIDReportHodler;
  io: BytePosIn;
  oldDataDefault?: number;
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
  reports: HIDReportHodler;
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

export interface DeckModes {
  wheelMode: number;
  moveMode: number;
}
