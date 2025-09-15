/*
 * Components library
 */

import { HIDInputReport, HIDOutputReport } from '../hid-report';
import type {
  ComponentInOptions,
  ComponentInOutOptions,
  ComponentOutOptions,
} from '../types/component';
import type { BytePosIn, BytePosInOut, BytePosOut } from '../types/mapping';

export abstract class Component {
  isShifted = false;
  constructor(public group: string) {}
}

export abstract class ComponentIn extends Component {
  private inConnection: ScriptConnection;
  public inKey: string;
  private inReport: HIDInputReport;
  protected io: BytePosIn;
  private oldDataDefault?: number;

  constructor(opts: ComponentInOptions) {
    super(opts.group);
    this.inKey = opts.inKey;
    this.inReport = opts.reports.in[opts.io.inReportId];
    this.io = opts.io;

    this.inConnection = this.inConnect();
  }

  inConnect(): ScriptConnection {
    return this.inReport.registerCallback(
      this.input.bind(this)!,
      this.io,
      this.oldDataDefault
    );
  }
  inDisconnect() {
    this.inConnection.disconnect();
  }

  abstract input(value: number): void;
}

export abstract class ComponentOut extends Component {
  outConnection: ScriptConnection;
  outKey: string;
  outReport: HIDOutputReport;
  io: BytePosOut;
  constructor(opts: ComponentOutOptions) {
    super(opts.group);
    this.outKey = opts.outKey;
    this.outReport = opts.reports.out[opts.io.outReportId];
    this.io = opts.io;
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

  send(value: number) {
    this.outReport.data[this.io.outByte] = value;
    this.outReport.send();
  }

  sendArr(data: Uint8Array) {
    for (let i = 0; i < data.length; i++) {
      this.outReport.data[this.io.outByte + i] = data[i];
    }
  }

  outDisconnect() {
    this.outConnection.disconnect();
  }

  abstract output(): void;
}

export abstract class ComponentInOut extends ComponentIn {
  private outConnection: ScriptConnection;
  outKey: string;
  outReport: HIDOutputReport;
  protected declare io: BytePosInOut;
  constructor(opts: ComponentInOutOptions) {
    super(opts);
    this.outKey = opts.outKey;
    this.outReport = opts.reports.out[this.io.outReportId];
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

  outTrigger() {
    this.outConnection.trigger();
  }

  send(value: number) {
    this.outReport.data[this.io.outByte] = value;
    this.outReport.send();
  }

  outDisconnect() {
    this.outConnection.disconnect();
  }

  abstract output(value: number): void;
}
