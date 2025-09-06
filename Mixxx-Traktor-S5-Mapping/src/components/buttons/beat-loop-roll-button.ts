import { TriggerButton } from './button';

/*
 * Represent a pad button that will trigger a pre-defined beatloop size as set in BeatLoopRolls.
 */
export class BeatLoopRollButton extends TriggerButton {
  constructor(options) {
    if (
      options.number === undefined ||
      !Number.isInteger(options.number) ||
      options.number < 0 ||
      options.number > 7
    ) {
      throw Error(
        'BeatLoopRollButton must have a number property of an integer between 0 and 7'
      );
    }
    if (BeatLoopRolls[options.number] === 'half') {
      options.key = 'loop_halve';
    } else if (BeatLoopRolls[options.number] === 'double') {
      options.key = 'loop_double';
    } else {
      const size = parseFloat(BeatLoopRolls[options.number]);
      if (isNaN(size)) {
        throw Error(
          `BeatLoopRollButton ${options.number}'s size "${
            BeatLoopRolls[options.number]
          }" is invalid. Must be a float, or the literal 'half' or 'double'`
        );
      }
      options.key = `beatlooproll_${size}_activate`;
    }
    super(options);
    if (this.deck === undefined) {
      throw Error('BeatLoopRollButton must have a deck attached to it');
    }

    this.outConnect();
  }
  output(value) {
    if (this.key.startsWith('beatlooproll_')) {
      this.send(
        LedColors.white + (value ? this.brightnessOn : this.brightnessOff)
      );
    } else {
      this.send(this.color);
    }
  }
}
