import type { BytePosIn } from './types/mapping';

export interface HIDReportField {
  callback: CallableFunction;
  io: BytePosIn;
  oldData?: number;
}
