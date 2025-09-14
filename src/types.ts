export interface HIDReportField {
  callback: CallableFunction;
  byteOffset: number;
  bitOffset: number;
  bitLength: number;
  oldData?: number;
}
