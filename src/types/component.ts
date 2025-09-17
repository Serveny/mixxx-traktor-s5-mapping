import type { HIDReportHodler } from '../hid-report';
import type { BytePosIn, BytePosInOut, BytePosOut } from './mapping';
import type { MixxxGroup, MixxxKey } from './mixxx-controls';

export interface ComponentOptions<TGroup extends MixxxGroup> {
  group: TGroup;
}

export interface ComponentInOptions<TGroup extends MixxxGroup>
  extends ComponentOptions<TGroup> {
  inKey: MixxxKey[TGroup];
  reports: HIDReportHodler;
  io: BytePosIn;
  oldDataDefault?: number;
}

export interface ComponentOutOptions<TGroup extends MixxxGroup>
  extends ComponentOptions<TGroup> {
  outKey: MixxxKey[TGroup];
  reports: HIDReportHodler;
  io: BytePosOut;
}

export interface ComponentInOutOptions<TGroup extends MixxxGroup>
  extends ComponentInOptions<TGroup>,
    ComponentOutOptions<TGroup> {
  io: BytePosInOut;
}

export interface ButtonOptions<TGroup extends MixxxGroup>
  extends ComponentInOutOptions<TGroup> {}

export interface DeckModes {
  wheelMode: number;
  moveMode: number;
}
