import type { HIDReportHodler } from '../hid-report';
import type { BytePosIn, BytePosInOut, BytePosOut } from './mapping';

export interface ComponentOptions {
  group: string;
}

export interface ComponentInOptions extends ComponentOptions {
  inKey: string;
  reports: HIDReportHodler;
  io: BytePosIn;
  oldDataDefault?: number;
}

export interface ComponentOutOptions extends ComponentOptions {
  outKey: string;
  reports: HIDReportHodler;
  io: BytePosOut;
}

export interface ComponentInOutOptions
  extends ComponentInOptions,
    ComponentOutOptions {
  io: BytePosInOut;
}

export interface ButtonOptions extends ComponentInOutOptions {}

export interface DeckModes {
  wheelMode: number;
  moveMode: number;
}
