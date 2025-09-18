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
import type { MixxxGroup, MixxxKey } from '../types/mixxx-controls';

export abstract class Component<TGroup extends MixxxGroup> {
  isShifted = false;
  constructor(public group: TGroup) {}
}

export abstract class ComponentIn<
  TGroup extends MixxxGroup
> extends Component<TGroup> {
  private inConnection: ScriptConnection;
  public inKey: MixxxKey[TGroup];
  private inReport: HIDInputReport;
  protected io: BytePosIn;
  private oldDataDefault?: number;

  constructor(opts: ComponentInOptions<TGroup>) {
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

export abstract class ComponentOut<
  TGroup extends MixxxGroup
> extends Component<TGroup> {
  outConnection?: ScriptConnection;
  outKey: MixxxKey[TGroup];
  outReport: HIDOutputReport;
  io: BytePosOut;
  constructor(opts: ComponentOutOptions<TGroup>) {
    super(opts.group);
    this.outKey = opts.outKey;
    this.outReport = opts.reports.out[opts.io.outReportId];
    this.io = opts.io;
    this.outConnection = this.outConnect();
  }

  outConnect(): ScriptConnection | undefined {
    if (this.group === '') return;
    const outCon = engine.makeConnection(
      this.group,
      this.outKey,
      this.output.bind(this)
    );
    if (outCon == null)
      console.warn(
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
    this.outConnection?.disconnect();
  }

  abstract output(): void;
}

export abstract class ComponentInOut<
  TGroup extends MixxxGroup
> extends ComponentIn<TGroup> {
  private outConnection?: ScriptConnection;
  outKey: MixxxKey[TGroup];
  outReport: HIDOutputReport;
  protected declare io: BytePosInOut;
  constructor(opts: ComponentInOutOptions<TGroup>) {
    super(opts);
    this.outKey = opts.outKey;
    this.outReport = opts.reports.out[this.io.outReportId];
    this.outConnection = this.outConnect();
  }

  outConnect(): ScriptConnection | undefined {
    if (this.group === '') return;
    const outCon = engine.makeConnection(
      this.group,
      this.outKey,
      this.output.bind(this)
    );
    if (outCon == null)
      console.warn(
        `Unable to connect ${this.group}.${this.outKey}' to the controller output. The control appears to be unavailable.`
      );
    return outCon;
  }

  outTrigger() {
    this.outConnection?.trigger();
  }

  send(value: number) {
    this.outReport.data[this.io.outByte] = value;
    this.outReport.send();
  }

  outDisconnect() {
    this.outConnection?.disconnect();
  }

  abstract output(value: number): void;
}
