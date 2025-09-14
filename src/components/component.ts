/*
 * Components library
 */

import { HIDInputReport } from '../hid-report';
import type { BytePosIn, BytePosInOut, BytePosOut } from '../types/mapping';

export abstract class Component {
  shifted = false;
  constructor(public group: string) {
    this.outConnections = [];
    if (typeof key === 'string') {
      this.inKey = key;
      this.outKey = key;
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

  send(value: number) {
    if (this.outReport !== undefined && this.outByte !== undefined) {
      this.outReport.data[this.outByte] = value;
      this.outReport.send();
    }
  }
  output(value: number) {
    this.send(value);
  }

  outTrigger() {
    for (const connection of this.outConnections) {
      connection.trigger();
    }
  }
}

export abstract class ComponentIn extends Component {
  inConnection: ScriptConnection;
  constructor(
    public group: string,
    public inKey: string,
    public inReport: HIDInputReport,
    public io: BytePosIn
  ) {
    super(group);

    this.inConnect();
  }

  inConnect(): ScriptConnection {
    return this.inReport.registerCallback(
      this.input.bind(this)!,
      this.io.inByte,
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

  abstract input(): void;
}

export abstract class ComponentOut extends Component {
  outConnection: ScriptConnection;
  constructor(
    public group: string,
    public outKey: string,
    public io: BytePosOut
  ) {
    super(group);
    this.outConnection = this.outConnect();
  }

  outConnect(): ScriptConnection {
    const outCon = engine.makeConnection(
      this.group,
      this.outKey,
      this.output.bind(this)
    );
    if (outCon == null)
      throw Error(
        `Unable to connect ${this.group}.${this.outKey}' to the controller output. The control appears to be unavailable.`
      );
    return outCon;
  }

  outDisconnect() {
    this.outConnection.disconnect();
  }

  abstract output(): void;
}

export abstract class ComponentInOut extends Component {
  constructor(public group: string, public io: BytePosInOut) {
    super(group);
  }
}
