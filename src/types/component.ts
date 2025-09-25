import type { HIDReportHodler } from '../hid-report';
import type { BytePosIn, BytePosInOut, BytePosOut } from './mapping';
import type { MixxxGroup, MixxxKey } from './mixxx-controls';

export interface ComponentOptions {}

export interface ComponentInOptions extends ComponentOptions {
  input?: (value: number) => void;
  reports: HIDReportHodler;
  io: BytePosIn;
  oldDataDefault?: number;
}

export interface ComponentInGroupOptions<TGroup extends MixxxGroup>
  extends ComponentInOptions {
  group: TGroup;
  inKey: MixxxKey[TGroup];
}

export interface ComponentOutOptions extends ComponentOptions {
  output?: (value: number) => void;
  reports: HIDReportHodler;
  io: BytePosOut;
}

export interface ComponentOutGroupOptions<TGroup extends MixxxGroup>
  extends ComponentOutOptions {
  group: TGroup;
  outKey: MixxxKey[TGroup];
}

export interface ComponentInOutOptions<TGroup extends MixxxGroup>
  extends ComponentInGroupOptions<TGroup>,
    ComponentOutGroupOptions<TGroup> {
  io: BytePosInOut;
}

export interface ButtonOptions<TGroup extends MixxxGroup>
  extends ComponentInOutOptions<TGroup> {}

export interface DeckModes {
  wheelMode: number;
  moveMode: number;
}
