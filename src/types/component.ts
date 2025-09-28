import type { Component, ControlComponent } from '../components/component';
import type { HIDReportHodler } from '../hid-report';
import type { BytePosIn, BytePosInOut, BytePosOut } from './mapping';
import type { MixxxGroup, MixxxKey } from './mixxx-controls';

// export type ComponentConstructor<T extends any[] = any[], R = {}> = new (...args: T) => R;
export type ComponentConstructor<T = {}> = new (...args: any[]) => T;
// export type ComponentConstructor<TOptions extends ComponentOptions> = new (...args: any[]) => Component<TOptions>;
export type ControlComponentConstructor = new (
  ...args: any[]
) => ControlComponent<any, any>;

export interface ComponentOptions {}

export interface ComponentInOptions extends ComponentOptions {
  input?: (value: number) => void;
  reports: HIDReportHodler;
  io: BytePosIn;
  oldDataDefault?: number;
}

export interface ControlComponentOptions<TGroup extends MixxxGroup>
  extends ComponentOptions {
  group: TGroup;
}

export interface ControlComponentInOptions<TGroup extends MixxxGroup>
  extends ComponentInOptions,
    ControlComponentOptions<TGroup> {
  inKey: MixxxKey[TGroup];
}

export interface ComponentOutOptions extends ComponentOptions {
  output?: (value: number) => void;
  reports: HIDReportHodler;
  io: BytePosOut;
}

export interface ControlComponentOutOptions<TGroup extends MixxxGroup>
  extends ComponentOutOptions,
    ControlComponentOptions<TGroup> {
  outKey: MixxxKey[TGroup];
}

export interface ControlComponentInOutOptions<TGroup extends MixxxGroup>
  extends ControlComponentInOptions<TGroup>,
    ControlComponentOutOptions<TGroup> {
  io: BytePosInOut;
}

export interface DeckModes {
  wheelMode: number;
  moveMode: number;
}
