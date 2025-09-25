/*
 * Components library
 */

import { HIDInputReport, HIDOutputReport } from '../hid-report';
import type {
  ComponentInGroupOptions,
  ComponentInOptions,
  ComponentOutGroupOptions,
  ComponentOutOptions,
} from '../types/component';
import type { BytePosIn, BytePosOut } from '../types/mapping';
import type { MixxxGroup, MixxxKey } from '../types/mixxx-controls';

export class Component {
  constructor(..._: any[]) {}
}
type ComponentConstructor = new (...args: any[]) => Component;

export class GroupComponent<TGroup extends MixxxGroup> extends Component {
  group: TGroup;
  constructor(...args: any[]) {
    super();
    this.group = (args[0] as { group: TGroup }).group;
  }
}
type GroupComponentConstructor = new (...args: any[]) => GroupComponent<any>;

export function ComponentInMixin<TBase extends ComponentConstructor>(
  Base: TBase
) {
  return class extends Base {
    inConnection: ScriptConnection;
    inReport: HIDInputReport;
    io: BytePosIn;
    oldDataDefault?: number;

    constructor(...args: any[]) {
      super(...args);
      const opts: ComponentInOptions = args[0];
      this.inReport = opts.reports.in[opts.io.inReportId];
      this.io = opts.io;
      if (opts.input) this.input = opts.input;

      this.inConnection = this.inConnect();
    }

    inConnect(): ScriptConnection {
      return this.inReport.registerCallback(
        this.input.bind(this)!,
        this.io,
        this.oldDataDefault
      );
    }

    input(_: number) {
      // Placeholder: Can't do abstract classes in mixins
    }

    inDisconnect() {
      this.inConnection.disconnect();
    }
  };
}

export function ComponentOutMixin<TBase extends ComponentConstructor>(
  Base: TBase
) {
  return class extends Base {
    outConnection?: ScriptConnection;
    outReport: HIDOutputReport;
    io: BytePosOut;

    constructor(...args: any[]) {
      super(...args);
      const opts = args[0] as ComponentOutOptions;

      this.outReport = opts.reports.out[opts.io.outReportId];
      this.io = opts.io;
      if (opts.output) this.output = opts.output;
    }

    output(value: number) {
      this.send(value);
    }

    outputArr(data: Uint8Array) {
      for (let i = 0; i < data.length; i++) {
        this.outReport.data[this.io.outByte + i] = data[i];
      }
    }

    send(value: number) {
      this.outReport.data[this.io.outByte] = value;
      this.outReport.send();
    }

    outDisconnect() {
      this.outConnection?.disconnect();
    }
  };
}

export function GroupComponentInMixin<TBase extends GroupComponentConstructor>(
  Base: TBase
) {
  const BaseIn = ComponentInMixin(Base);

  return class extends BaseIn {
    inKey: MixxxKey[keyof MixxxKey];

    constructor(...args: any[]) {
      super(...args);
      const opts = args[0] as ComponentInGroupOptions<any>;

      this.inKey = opts.inKey;
    }

    input(pressed: number) {
      engine.setValue(this.group, this.inKey, pressed);
    }
  };
}

export function GroupComponentOutMixin<TBase extends GroupComponentConstructor>(
  Base: TBase
) {
  const BaseOut = ComponentOutMixin(Base);

  return class extends BaseOut {
    outKey: MixxxKey[keyof MixxxKey];
    outConnection?: ScriptConnection;
    constructor(...args: any[]) {
      super(...args);
      const opts = args[0] as ComponentOutGroupOptions<any>;

      this.outKey = opts.outKey;
      this.outConnection = this.outConnect();
    }

    outConnect(): ScriptConnection | undefined {
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
  };
}

export function ComponentShiftMixin<TBase extends GroupComponentConstructor>(
  Base: TBase
) {
  return class extends Base {
    isShifted = false;

    shift() {
      this.isShifted = true;
    }

    unshift() {
      this.isShifted = false;
    }
  };
}
