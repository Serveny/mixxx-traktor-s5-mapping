export interface HIDReportField {
  callback: CallableFunction;
  byteOffset: number;
  bitOffset: number;
  bitLength: number;
  oldData?: number;
}

export interface ComponentOptions {
  inKey?: string;
  outKey?: string;
  group?: string;
  inByte?: number;
  inBit?: number;
  inBitLength?: number;
  input(value: number): void;
  oldDataDefault?: number;
  globalQuantizeOn?: boolean;
}
