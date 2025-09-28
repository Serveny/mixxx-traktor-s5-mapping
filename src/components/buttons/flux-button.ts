import { wheelModes } from '../../settings';
import type { ControlComponentInOutOptions } from '../../types/component';
import type { Btn } from '../../types/mapping';
import type { MixxxChannelGroup, MixxxKey } from '../../types/mixxx-controls';
import {
  ControlComponent,
  ControlInMixin,
  ControlOutMixin,
  IndicatorMixin,
  LongPressMixin,
  SetInOutKeyMixin,
  ShiftMixin,
} from '../component';
import type { S5Deck } from '../s5-deck';

export class FluxButton extends SetInOutKeyMixin(
  LongPressMixin(
    IndicatorMixin(
      ShiftMixin(
        ControlOutMixin(
          ControlInMixin(
            ControlComponent<
              MixxxChannelGroup,
              ControlComponentInOutOptions<MixxxChannelGroup>
            >
          )
        )
      )
    )
  )
) {
  private previousWheelMode: number | null = null;
  private loopModeConnection: ScriptConnection | null = null;

  constructor(private deck: S5Deck, io: Btn) {
    const key = 'slip_enabled';
    super({
      group: deck.group,
      inKey: key,
      outKey: key,
      reports: deck.reports,
      io,
    });
  }

  onUnshift() {
    this.setKey('slip_enabled');
  }

  onShift() {
    this.setKey('loop_enabled');
  }

  onShortRelease() {
    if (!this.isShifted) {
      engine.setValue(this.group, this.inKey, 0);
      engine.setValue(this.group, 'scratch2_enable', 0);
    }
  }

  loopModeOff(skipRestore: boolean) {
    if (this.previousWheelMode !== null) {
      this.indicator(false);
      // const wheelOutput = new Uint8Array(40).fill(0);
      // wheelOutput[0] = decks[0] - 1;
      // controller.sendOutputReport(wheelOutput.buffer, null, 50, true);
      if (!skipRestore) {
        this.deck.wheelMode = this.previousWheelMode;
      }
      this.previousWheelMode = null;
      if (this.loopModeConnection != null) {
        this.loopModeConnection.disconnect();
        this.loopModeConnection = null;
      }
    }
  }

  onLoopChange(loopEnabled: number) {
    if (loopEnabled) {
      return;
    }
    this.loopModeOff(false);
  }

  onShortPress() {
    this.indicator(false);
    if (this.isShifted) {
      const loopEnabled = engine.getValue(this.group, 'loop_enabled');
      // If there is currently no loop, we set the loop in of a new loop
      if (!loopEnabled) {
        engine.setValue(this.group, 'loop_out', 1);
        // Else, we enter/exit the loop in wheel mode
      } else if (this.previousWheelMode === null) {
        engine.setValue(this.group, 'scratch2_enable', 0);
        this.previousWheelMode = this.deck.wheelMode;
        this.deck.wheelMode = wheelModes.loopOut;
        if (this.loopModeConnection === null) {
          this.loopModeConnection =
            engine.makeConnection(
              this.group,
              this.outKey,
              this.onLoopChange.bind(this)
            ) ?? null;
        }

        //const wheelOutput = new Uint8Array(40).fill(0);
        //wheelOutput[0] = decks[0] - 1;
        //wheelOutput[1] = wheelLEDmodes.ringFlash;
        //wheelOutput[4] = this.color + Button.prototype.brightnessOn;
        // controller.sendOutputReport(50, wheelOutput.buffer, true);

        this.indicator(true);
      } else if (this.previousWheelMode !== null) {
        this.loopModeOff(false);
      }
    } else {
      engine.setValue(this.group, this.inKey, 1);
    }
  }
}
