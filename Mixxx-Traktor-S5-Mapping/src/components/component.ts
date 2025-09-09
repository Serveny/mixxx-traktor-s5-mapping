/*
 * Components library
 */

import { HIDInputReport } from '../hid-input-record';
import type { HIDOutputReport } from '../hid-output-record';
import type { ComponentOptions } from '../types';

export class Component implements ComponentOptions {
  key: string;
  inKey!: string;
  outKey?: string;
  inConnection?: ScriptConnection;
  outConnections: ScriptConnection[];
  shift() {}
  unshift() {}
  shifted?: boolean;
  inReport?: HIDInputReport;
  outReport?: HIDOutputReport;
  input(value: number): void {}
  inByte?: number;
  inBit?: number;
  inBitLength?: number;
  oldDataDefault?: number;
  outByte?: number;
  group!: string;
  constructor(options?: Partial<Component>) {
    if (options) {
      Object.entries(options).forEach(function ([key, value]) {
        if (value === undefined) {
          delete (options as any)[key];
        }
      });
      Object.assign(this, options);
    }
    this.outConnections = [];
    if (typeof this.key === 'string') {
      this.inKey = this.key;
      this.outKey = this.key;
    }
    if (typeof this.unshift === 'function' && this.unshift.length === 0) {
      this.unshift();
    }
    this.shifted = false;
    if (
      typeof this.input === 'function' &&
      this.inReport instanceof HIDInputReport &&
      (this.inReport as any).length === 0
    ) {
      this.inConnect();
    }
    this.outConnect();
  }
  inConnect(callback?: Function) {
    if (
      this.inByte === undefined ||
      this.inBit === undefined ||
      this.inBitLength === undefined ||
      this.inReport === undefined
    ) {
      return;
    }
    if (typeof callback === 'function') {
      this.input = callback as any;
    }
    this.inConnection = this.inReport.registerCallback(
      this.input?.bind(this)!,
      this.inByte,
      this.inBit,
      this.inBitLength,
      this.oldDataDefault
    );
  }
  inDisconnect() {
    if (this.inConnection !== undefined) {
      this.inConnection.disconnect();
    }
  }
  send(value: number) {
    if (this.outReport !== undefined && this.outByte !== undefined) {
      this.outReport.data[this.outByte] = value;
      this.outReport.send();
    }
  }
  output(value: number) {
    this.send(value);
  }
  outConnect() {
    if (this.outKey !== undefined && this.group !== undefined) {
      const connection = engine.makeConnection(
        this.group,
        this.outKey,
        this.output.bind(this)
      );
      // This is useful for case where effect would have been fully disabled in Mixxx. This appears to be the case during unit tests.
      if (connection) {
        this.outConnections[0] = connection;
      } else {
        console.warn(
          `Unable to connect ${this.group}.${this.outKey}' to the controller output. The control appears to be unavailable.`
        );
      }
    }
  }
  outDisconnect() {
    for (const connection of this.outConnections) {
      connection.disconnect();
    }
    this.outConnections = [];
  }
  outTrigger() {
    for (const connection of this.outConnections) {
      connection.trigger();
    }
  }
}
