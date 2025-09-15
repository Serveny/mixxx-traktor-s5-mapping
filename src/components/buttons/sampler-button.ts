import { Button } from './button';

/*
 * Represent a pad button that interact with a sampler (load, play/pause, cue, eject)
 */
export class SamplerButton extends Button {
  number?: number;
  constructor(options: Partial<SamplerButton>) {
    super(options);
    if (
      this.number === undefined ||
      !Number.isInteger(this.number) ||
      this.number < 1 ||
      this.number > 64
    ) {
      throw Error(
        'SamplerButton must have a number property of an integer between 1 and 64'
      );
    }
    this.group = `[Sampler${this.number}]`;
    this.outConnect();
  }
  onShortPress() {
    if (!this.isShifted) {
      if (engine.getValue(this.group, 'track_loaded') === 0) {
        engine.setValue(this.group, 'LoadSelectedTrack', 1);
      } else {
        engine.setValue(this.group, 'cue_gotoandplay', 1);
      }
    } else {
      if (engine.getValue(this.group, 'play') === 1) {
        engine.setValue(this.group, 'play', 0);
      } else {
        engine.setValue(this.group, 'eject', 1);
      }
    }
  }
  onShortRelease() {
    if (this.isShifted) {
      if (engine.getValue(this.group, 'play') === 0) {
        engine.setValue(this.group, 'eject', 0);
      }
    }
  }
  // This function is connected to multiple Controls, so don't use the value passed in as a parameter.
  output() {
    if (engine.getValue(this.group, 'track_loaded')) {
      if (engine.getValue(this.group, 'play')) {
        this.send(this.color + this.brightnessOn);
      } else {
        this.send(this.color + this.brightnessOff);
      }
    } else {
      this.send(0);
    }
  }
  outConnect() {
    if (undefined !== this.group) {
      const connection0 = engine.makeConnection(
        this.group,
        'play',
        this.output.bind(this)
      );
      if (connection0) {
        this.outConnections[0] = connection0;
      } else {
        console.warn(
          `Unable to connect ${this.group}.play' to the controller output. The control appears to be unavailable.`
        );
      }
      const connection1 = engine.makeConnection(
        this.group,
        'track_loaded',
        this.output.bind(this)
      );
      if (connection1) {
        this.outConnections[1] = connection1;
      } else {
        console.warn(
          `Unable to connect ${this.group}.track_loaded' to the controller output. The control appears to be unavailable.`
        );
      }
    }
  }
}
