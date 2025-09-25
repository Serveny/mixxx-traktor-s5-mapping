import { settings, wheelModes } from '../settings';
import type { TouchStripMapping } from '../types/mapping';
import type { MixxxChannelGroup } from '../types/mixxx-controls';
import { InMixin, GroupComponent, GroupInMixin } from './component';
import type { S5Deck } from './s5-deck';

const wheelRelativeMax = 2 ** 32 - 1;
const wheelAbsoluteMax = 2879;

const wheelTimerMax = 2 ** 32 - 1;
const wheelTimerTicksPerSecond = 100000000; // One tick every 10ns

const baseRevolutionsPerSecond = settings.baseRevolutionsPerMinute / 60;
const wheelTicksPerTimerTicksToRevolutionsPerSecond =
  wheelTimerTicksPerSecond / wheelAbsoluteMax;

export class TouchStrip extends GroupInMixin(
  GroupComponent
)<MixxxChannelGroup> {
  speed: number = 0;
  oldValue: [number, number, number] | null = null;

  constructor(private deck: S5Deck, io: TouchStripMapping) {
    super({
      group: deck.group,
      inKey: 'scratch2',
      reports: deck.reports,
      io: io.touch,
    });
  }

  input(value: number) {
    const timestamp = Date.now();
    console.log('value', value, timestamp);
    if (this.oldValue === null) {
      // This is to avoid the issue where the first time, we diff with 0, leading to the absolute value
      this.oldValue = [value, timestamp, 0];
      return;
    }
    let [oldValue, oldTimestamp, speed] = this.oldValue;

    if (timestamp < oldTimestamp) {
      oldTimestamp -= wheelTimerMax;
    }

    let diff = value - oldValue;
    if (diff > wheelRelativeMax / 2) {
      oldValue += wheelRelativeMax;
    } else if (diff < -wheelRelativeMax / 2) {
      oldValue -= wheelRelativeMax;
    }

    const currentSpeed = (value - oldValue) / (timestamp - oldTimestamp);
    if (currentSpeed <= 0 === speed <= 0) {
      speed = (speed + currentSpeed) / 2;
    } else {
      speed = currentSpeed;
    }
    this.oldValue = [value, timestamp, speed];
    this.speed = wheelAbsoluteMax * speed * 10;

    if (
      this.speed === 0 &&
      engine.getValue(this.deck.group, 'scratch2') === 0 &&
      engine.getValue(this.deck.group, 'jog') === 0 &&
      this.deck.wheelMode !== wheelModes.motor
    ) {
      return;
    }
    switch (this.deck.wheelMode) {
      case wheelModes.motor:
        engine.setValue(this.deck.group, 'scratch2', this.speed);
        break;
      case wheelModes.loopIn:
        {
          const loopStartPosition = engine.getValue(
            this.deck.group,
            'loop_start_position'
          );
          const loopEndPosition = engine.getValue(
            this.deck.group,
            'loop_end_position'
          );
          const value = Math.min(
            loopStartPosition + this.speed * settings.loopWheelMoveFactor,
            loopEndPosition - settings.loopWheelMoveFactor
          );
          engine.setValue(this.deck.group, 'loop_start_position', value);
        }
        break;
      case wheelModes.loopOut:
        {
          const loopEndPosition = engine.getValue(
            this.deck.group,
            'loop_end_position'
          );
          const value =
            loopEndPosition + this.speed * settings.loopWheelMoveFactor;
          engine.setValue(this.deck.group, 'loop_end_position', value);
        }
        break;
      case wheelModes.vinyl:
        if (engine.getValue(this.deck.group, 'scratch2') !== 0) {
          engine.setValue(this.deck.group, 'scratch2', this.speed);
        } else {
          engine.setValue(this.deck.group, 'jog', this.speed);
        }
        break;
      default:
        engine.setValue(this.deck.group, 'jog', this.speed);
    }
  }
}
