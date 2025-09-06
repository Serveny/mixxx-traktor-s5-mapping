import { Button, PushButton } from './buttons/button';
import { CueButton } from './buttons/cue-button';
import { PlayButton } from './buttons/play-button';
import { Deck } from './deck';
import { Encoder } from './encoder';
import { Pot } from './pot';

export class S5Deck extends Deck {
  constructor(
    decks,
    colors,
    settings,
    effectUnit,
    mixer,
    inReports,
    outReport,
    io
  ) {
    super(decks, colors, settings);

    this.playButton = new PlayButton({
      output: InactiveLightsAlwaysBacklit
        ? undefined
        : Button.prototype.uncoloredOutput,
    });

    this.cueButton = new CueButton({
      deck: this,
    });

    this.effectUnit = effectUnit;
    this.mixer = mixer;

    this.syncMasterButton = new Button({
      key: 'sync_leader',
      defaultRange: 0.08,
      shift: UseKeylockOnMaster
        ? function () {
            this.setKey('keylock');
          }
        : undefined,
      unshift: UseKeylockOnMaster
        ? function () {
            this.setKey('sync_leader');
          }
        : undefined,
      onShortRelease: function () {
        script.toggleControl(this.group, this.inKey);
      },
      onLongPress: function () {
        const currentRange = engine.getValue(this.group, 'rateRange');
        if (currentRange < 1.0) {
          engine.setValue(this.group, 'rateRange', 1.0);
          this.indicator(true);
        } else {
          engine.setValue(this.group, 'rateRange', this.defaultRange);
          this.indicator(false);
        }
      },
    });
    this.syncButton = new Button({
      key: 'sync_enabled',
      onLongPress: function () {
        if (this.shifted) {
          engine.setValue(this.group, 'sync_key', true);
          engine.setValue(this.group, 'sync_key', false);
        } else {
          script.triggerControl(this.group, 'beatsync_tempo');
        }
      },
      onShortRelease: function () {
        script.toggleControl(this.group, this.inKey);
        if (!this.shifted) {
          engine.softTakeover(this.group, 'rate', true);
        }
      },
      shift: !UseKeylockOnMaster
        ? function () {
            this.setKey('keylock');
          }
        : undefined,
      unshift: !UseKeylockOnMaster
        ? function () {
            this.setKey('sync_enabled');
          }
        : undefined,
    });
    this.tempoFader = new Pot({
      deck: this,
      inKey: 'rate',
      outKey: 'rate',
      appliedValue: null,
      tempoCenterUpper: this.settings.tempoCenterUpper,
      tempoCenterLower: this.settings.tempoCenterLower,
      input: function (value) {
        const receivingFirstValue = this.appliedValue === null;

        if (value < this.tempoCenterLower) {
          // scale input for lower range
          this.appliedValue = script.absoluteLin(
            value,
            -1,
            0,
            0,
            this.tempoCenterLower
          );
        } else if (value > this.tempoCenterUpper) {
          // scale input for upper range
          this.appliedValue = script.absoluteLin(
            value,
            0,
            1,
            this.tempoCenterUpper,
            4096
          );
        } else {
          // reset rate in center region
          this.appliedValue = 0;
        }
        engine.setValue(this.group, this.inKey, this.appliedValue);

        if (receivingFirstValue) {
          engine.softTakeover(this.group, this.inKey, true);
          // Forec-update LED.
          // Output connection is made and updated before input() can set this.appliedValue
          // (doesn't happen until getInputReport())
          this.outTrigger();
        }
      },
      output: function (value) {
        if (this.appliedValue === null) {
          return;
        }

        const hardwareOffset = this.appliedValue - value;
        // Use LED to indicate softTakeover pickup position
        if (hardwareOffset > 0) {
          // engine is faster
          this.send(
            TempoFaderSoftTakeoverColorLow + Button.prototype.brightnessOn
          );
          return;
        } else if (hardwareOffset < 0) {
          // engine is slower
          this.send(
            TempoFaderSoftTakeoverColorHigh + Button.prototype.brightnessOn
          );
          return;
        }

        // Fader is in sync with engine, set center LED on/off
        if (value === 0) {
          this.send(this.color + Button.prototype.brightnessOn);
        } else {
          this.send(0);
        }
      },
    });

    this.reverseButton = new Button({
      key: 'reverseroll',
      deck: this,
      previousWheelMode: null,
      loopModeConnection: null,
      unshift: function () {
        this.setKey('reverseroll');
      },
      shift: function () {
        this.setKey('loop_enabled');
      },
      output: InactiveLightsAlwaysBacklit
        ? undefined
        : Button.prototype.uncoloredOutput,
      onShortRelease: function () {
        if (!this.shifted) {
          engine.setValue(this.group, this.key, false);
        }
      },
      loopModeOff: function (skipRestore) {
        if (this.previousWheelMode !== null) {
          this.indicator(false);
          const wheelOutput = new Uint8Array(40).fill(0);
          wheelOutput[0] = decks[0] - 1;
          controller.sendOutputReport(50, wheelOutput.buffer, true);
          if (!skipRestore) {
            this.deck.wheelMode = this.previousWheelMode;
          }
          this.previousWheelMode = null;
          if (this.loopModeConnection !== null) {
            this.loopModeConnection.disconnect();
            this.loopModeConnection = null;
          }
        }
      },
      onLoopChange: function (loopEnabled) {
        if (loopEnabled) {
          return;
        }
        this.loopModeOff();
      },
      onShortPress: function () {
        this.indicator(false);
        if (this.shifted) {
          const loopEnabled = engine.getValue(this.group, 'loop_enabled');
          // If there is currently no loop, we set the loop in of a new loop
          if (!loopEnabled) {
            engine.setValue(this.group, 'loop_end_position', -1);
            engine.setValue(this.group, 'loop_in', true);
            this.indicator(true);
            // Else, we enter/exit the loop in wheel mode
          } else if (this.previousWheelMode === null) {
            this.deck.fluxButton.loopModeOff();
            engine.setValue(this.group, 'scratch2_enable', false);
            this.previousWheelMode = this.deck.wheelMode;
            this.deck.wheelMode = wheelModes.loopIn;

            if (this.loopModeConnection === null) {
              this.loopModeConnection = engine.makeConnection(
                this.group,
                this.outKey,
                this.onLoopChange.bind(this)
              );
            }

            const wheelOutput = new Uint8Array(40).fill(0);
            wheelOutput[0] = decks[0] - 1;
            wheelOutput[1] = wheelLEDmodes.ringFlash;
            wheelOutput[4] = this.color + Button.prototype.brightnessOn;

            controller.sendOutputReport(50, wheelOutput.buffer, true);

            this.indicator(true);
          } else if (this.previousWheelMode !== null) {
            this.loopModeOff();
          }
        } else {
          engine.setValue(this.group, this.key, true);
        }
      },
    });
    this.fluxButton = new Button({
      key: 'slip_enabled',
      deck: this,
      previousWheelMode: null,
      loopModeConnection: null,
      unshift: function () {
        this.setKey('slip_enabled');
      },
      shift: function () {
        this.setKey('loop_enabled');
      },
      outConnect: function () {
        if (this.outKey !== undefined && this.group !== undefined) {
          const connection = engine.makeConnection(
            this.group,
            this.outKey,
            this.output.bind(this)
          );
          if (connection) {
            this.outConnections[0] = connection;
          } else {
            console.warn(
              `Unable to connect ${this.group}.${this.outKey}' to the controller output. The control appears to be unavailable.`
            );
          }
        }
      },
      output: InactiveLightsAlwaysBacklit
        ? undefined
        : Button.prototype.uncoloredOutput,
      onShortRelease: function () {
        if (!this.shifted) {
          engine.setValue(this.group, this.key, false);
          engine.setValue(this.group, 'scratch2_enable', false);
        }
      },
      loopModeOff: function (skipRestore) {
        if (this.previousWheelMode !== null) {
          this.indicator(false);
          const wheelOutput = new Uint8Array(40).fill(0);
          wheelOutput[0] = decks[0] - 1;
          controller.sendOutputReport(wheelOutput.buffer, null, 50, true);
          if (!skipRestore) {
            this.deck.wheelMode = this.previousWheelMode;
          }
          this.previousWheelMode = null;
          if (this.loopModeConnection !== null) {
            this.loopModeConnection.disconnect();
            this.loopModeConnection = null;
          }
        }
      },
      onLoopChange: function (loopEnabled) {
        if (loopEnabled) {
          return;
        }
        this.loopModeOff();
      },
      onShortPress: function () {
        this.indicator(false);
        if (this.shifted) {
          const loopEnabled = engine.getValue(this.group, 'loop_enabled');
          // If there is currently no loop, we set the loop in of a new loop
          if (!loopEnabled) {
            engine.setValue(this.group, 'loop_out', true);
            this.deck.reverseButton.indicator(false);
            // Else, we enter/exit the loop in wheel mode
          } else if (this.previousWheelMode === null) {
            this.deck.reverseButton.loopModeOff();
            engine.setValue(this.group, 'scratch2_enable', false);
            this.previousWheelMode = this.deck.wheelMode;
            this.deck.wheelMode = wheelModes.loopOut;
            if (this.loopModeConnection === null) {
              this.loopModeConnection = engine.makeConnection(
                this.group,
                this.outKey,
                this.onLoopChange.bind(this)
              );
            }

            const wheelOutput = new Uint8Array(40).fill(0);
            wheelOutput[0] = decks[0] - 1;
            wheelOutput[1] = wheelLEDmodes.ringFlash;
            wheelOutput[4] = this.color + Button.prototype.brightnessOn;

            controller.sendOutputReport(50, wheelOutput.buffer, true);

            this.indicator(true);
          } else if (this.previousWheelMode !== null) {
            this.loopModeOff();
          }
        } else {
          engine.setValue(this.group, this.key, true);
        }
      },
    });
    this.gridButton = new Button({
      key: GridButtonBlinkOverBeat ? 'beat_active' : undefined,
      deck: this,
      previousMoveMode: null,
      unshift: !GridButtonBlinkOverBeat
        ? function () {
            this.output(false);
          }
        : undefined,
      onShortPress: function () {
        this.deck.libraryEncoder.gridButtonPressed = true;

        if (this.shift) {
          engine.setValue(this.group, 'bpm_tap', true);
        }
      },
      onLongPress: function () {
        this.deck.libraryEncoder.gridButtonPressed = true;
        this.previousMoveMode = this.deck.moveMode;

        if (this.shifted) {
          this.deck.moveMode = moveModes.grid;
        } else {
          this.deck.moveMode = moveModes.bpm;
        }

        this.indicator(true);
      },
      onLongRelease: function () {
        this.deck.libraryEncoder.gridButtonPressed = false;
        if (this.previousMoveMode !== null) {
          this.deck.moveMode = this.previousMoveMode;
          this.previousMoveMode = null;
        }
        this.indicator(false);
      },
      onShortRelease: function () {
        this.deck.libraryEncoder.gridButtonPressed = false;
        script.triggerControl(this.group, 'beats_translate_curpos');

        if (this.shift) {
          engine.setValue(this.group, 'bpm_tap', false);
        }
      },
    });

    this.deckButtonLeft = new Button({
      deck: this,
      input: function (value) {
        if (value) {
          this.deck.switchDeck(Deck.groupForNumber(decks[0]));
          this.outReport.data[io.deckButtonOutputByteOffset] =
            colors[0] + this.brightnessOn;
          // turn off the other deck selection button's LED
          this.outReport.data[io.deckButtonOutputByteOffset + 1] =
            DeckSelectAlwaysBacklit ? colors[1] + this.brightnessOff : 0;
          this.outReport.send();
        }
      },
    });
    this.deckButtonRight = new Button({
      deck: this,
      input: function (value) {
        if (value) {
          this.deck.switchDeck(Deck.groupForNumber(decks[1]));
          // turn off the other deck selection button's LED
          this.outReport.data[io.deckButtonOutputByteOffset] =
            DeckSelectAlwaysBacklit ? colors[0] + this.brightnessOff : 0;
          this.outReport.data[io.deckButtonOutputByteOffset + 1] =
            colors[1] + this.brightnessOn;
          this.outReport.send();
        }
      },
    });

    // set deck selection button LEDs
    outReport.data[io.deckButtonOutputByteOffset] =
      colors[0] + Button.prototype.brightnessOn;
    outReport.data[io.deckButtonOutputByteOffset + 1] = DeckSelectAlwaysBacklit
      ? colors[1] + Button.prototype.brightnessOff
      : 0;
    outReport.send();

    this.shiftButton = new PushButton({
      deck: this,
      output: InactiveLightsAlwaysBacklit
        ? undefined
        : Button.prototype.uncoloredOutput,
      unshift: function () {
        this.output(false);
      },
      shift: function () {
        this.output(true);
      },
      input: function (pressed) {
        if (pressed) {
          this.deck.shift();
        } else {
          this.deck.unshift();
        }
      },
    });

    this.leftEncoder = new Encoder({
      deck: this,
      onChange: function (right) {
        switch (this.deck.moveMode) {
          case moveModes.grid:
            script.triggerControl(
              this.group,
              right ? 'beats_adjust_faster' : 'beats_adjust_slower'
            );
            break;
          case moveModes.keyboard:
            if (this.deck.keyboard[0].offset === (right ? 16 : 0)) {
              return;
            }
            this.deck.keyboardOffset += right ? 1 : -1;
            this.deck.keyboard.forEach(function (pad) {
              pad.outTrigger();
            });
            break;
          case moveModes.bpm:
            script.triggerControl(
              this.group,
              right ? 'beats_translate_later' : 'beats_translate_earlier'
            );
            break;
          default:
            if (!this.shifted) {
              if (!this.deck.leftEncoderPress.pressed) {
                if (right) {
                  script.triggerControl(this.group, 'beatjump_forward');
                } else {
                  script.triggerControl(this.group, 'beatjump_backward');
                }
              } else {
                let beatjumpSize = engine.getValue(this.group, 'beatjump_size');
                if (right) {
                  beatjumpSize *= 2;
                } else {
                  beatjumpSize /= 2;
                }
                engine.setValue(this.group, 'beatjump_size', beatjumpSize);
              }
            } else {
              if (right) {
                script.triggerControl(this.group, 'pitch_up_small');
              } else {
                script.triggerControl(this.group, 'pitch_down_small');
              }
            }
            break;
        }
      },
    });
    this.leftEncoderPress = new PushButton({
      input: function (pressed) {
        this.pressed = pressed;
        if (pressed) {
          script.toggleControl(this.group, 'pitch_adjust_set_default');
        }
      },
    });

    this.rightEncoder = new Encoder({
      deck: this,
      onChange: function (right) {
        if (
          this.deck.wheelMode === wheelModes.loopIn ||
          this.deck.wheelMode === wheelModes.loopOut
        ) {
          const moveFactor = this.shifted
            ? LoopEncoderShiftMoveFactor
            : LoopEncoderMoveFactor;
          const valueIn =
            engine.getValue(this.group, 'loop_start_position') +
            (right ? moveFactor : -moveFactor);
          const valueOut =
            engine.getValue(this.group, 'loop_end_position') +
            (right ? moveFactor : -moveFactor);
          engine.setValue(this.group, 'loop_start_position', valueIn);
          engine.setValue(this.group, 'loop_end_position', valueOut);
        } else if (this.shifted) {
          script.triggerControl(
            this.group,
            right ? 'loop_move_1_forward' : 'loop_move_1_backward'
          );
        } else {
          script.triggerControl(
            this.group,
            right ? 'loop_double' : 'loop_halve'
          );
        }
      },
    });
    this.rightEncoderPress = new PushButton({
      input: function (pressed) {
        if (!pressed) {
          return;
        }
        const loopEnabled = engine.getValue(this.group, 'loop_enabled');
        if (!this.shifted) {
          script.triggerControl(this.group, 'beatloop_activate');
        } else {
          script.triggerControl(this.group, 'reloop_toggle');
        }
      },
    });

    this.libraryEncoder = new Encoder({
      libraryPlayButtonPressed: false,
      gridButtonPressed: false,
      starButtonPressed: false,
      libraryViewButtonPressed: false,
      libraryPlaylistButtonPressed: false,
      currentSortedColumnIdx: -1,
      onChange: function (right) {
        if (this.libraryViewButtonPressed) {
          this.currentSortedColumnIdx =
            (LibrarySortableColumns.length +
              this.currentSortedColumnIdx +
              (right ? 1 : -1)) %
            LibrarySortableColumns.length;
          engine.setValue(
            '[Library]',
            'sort_column',
            LibrarySortableColumns[this.currentSortedColumnIdx]
          );
        } else if (this.starButtonPressed) {
          if (this.shifted) {
            // FIXME doesn't exist, feature request needed
            script.triggerControl(
              this.group,
              right ? 'track_color_prev' : 'track_color_next'
            );
          } else {
            script.triggerControl(
              this.group,
              right ? 'stars_up' : 'stars_down'
            );
          }
        } else if (this.gridButtonPressed) {
          script.triggerControl(
            this.group,
            right ? 'waveform_zoom_up' : 'waveform_zoom_down'
          );
        } else if (this.libraryPlayButtonPressed) {
          script.triggerControl(
            '[PreviewDeck1]',
            right ? 'beatjump_16_forward' : 'beatjump_16_backward'
          );
        } else {
          // FIXME there is a bug where this action has no effect when the Mixxx window has no focused. https://github.com/mixxxdj/mixxx/issues/11285
          // As a workaround, we are using deprecated control, hoping the bug will be fixed before the controls get removed
          const currentlyFocusWidget = engine.getValue(
            '[Library]',
            'focused_widget'
          );
          if (currentlyFocusWidget === 0) {
            if (this.shifted) {
              script.triggerControl(
                '[Playlist]',
                right ? 'SelectNextPlaylist' : 'SelectPrevPlaylist'
              );
            } else {
              script.triggerControl(
                '[Playlist]',
                right ? 'SelectNextTrack' : 'SelectPrevTrack'
              );
            }
          } else {
            engine.setValue(
              '[Library]',
              'focused_widget',
              this.shifted ? 2 : 3
            );
            engine.setValue('[Library]', 'MoveVertical', right ? 1 : -1);
          }
        }
      },
    });
    this.libraryEncoderPress = new Button({
      libraryViewButtonPressed: false,
      onShortPress: function () {
        if (this.libraryViewButtonPressed) {
          script.toggleControl('[Library]', 'sort_order');
        } else {
          const currentlyFocusWidget = engine.getValue(
            '[Library]',
            'focused_widget'
          );
          // 3 == Tracks table or root views of library features
          if (this.shifted && currentlyFocusWidget === 0) {
            script.triggerControl('[Playlist]', 'ToggleSelectedSidebarItem');
          } else if (currentlyFocusWidget === 3 || currentlyFocusWidget === 0) {
            script.triggerControl(this.group, 'LoadSelectedTrack');
          } else {
            script.triggerControl('[Library]', 'GoToItem');
          }
        }
      },
      // FIXME not supported, feature request
      // onLongPress: function(){
      //     script.triggerControl("[Library]", "search_related_track", engine.getValue("[Library]", "sort_column"));
      // }
    });
    this.libraryPlayButton = new PushButton({
      group: '[PreviewDeck1]',
      libraryEncoder: this.libraryEncoder,
      input: function (pressed) {
        if (pressed) {
          script.triggerControl(this.group, 'LoadSelectedTrackAndPlay');
        } else {
          engine.setValue(this.group, 'play', 0);
          script.triggerControl(this.group, 'eject');
        }
        this.libraryEncoder.libraryPlayButtonPressed = pressed;
      },
      outKey: 'play',
    });
    this.libraryStarButton = new Button({
      group: '[Library]',
      libraryEncoder: this.libraryEncoder,
      onShortRelease: function () {
        script.triggerControl(
          this.group,
          this.shifted ? 'track_color_prev' : 'track_color_next'
        );
      },
      onLongPress: function () {
        this.libraryEncoder.starButtonPressed = true;
      },
      onLongRelease: function () {
        this.libraryEncoder.starButtonPressed = false;
      },
    });
    // FIXME there is no feature about playlist at the moment, so we use this button to control the context menu, which has playlist control
    this.libraryPlaylistButton = new Button({
      group: '[Library]',
      libraryEncoder: this.libraryEncoder,
      outConnect: function () {
        const connection = engine.makeConnection(
          this.group,
          'focused_widget',
          (widget) => {
            // 4 == Context menu
            this.output(widget === 4);
          }
        );
        // This is useful for case where effect would have been fully disabled in Mixxx. This appears to be the case during unit tests.
        if (connection) {
          this.outConnections[0] = connection;
        } else {
          console.warn(
            `Unable to connect ${this.group}.focused_widget' to the controller output. The control appears to be unavailable.`
          );
        }
      },
      onShortRelease: function () {
        const currentlyFocusWidget = engine.getValue(
          '[Library]',
          'focused_widget'
        );
        // 3 == Tracks table or root views of library features
        // 4 == Context menu
        if (currentlyFocusWidget !== 3 && currentlyFocusWidget !== 4) {
          return;
        }
        script.toggleControl('[Library]', 'show_track_menu');
        this.libraryEncoder.libraryPlayButtonPressed = false;

        if (currentlyFocusWidget === 4) {
          engine.setValue('[Library]', 'focused_widget', 3);
        }
      },
      onShortPress: function () {
        this.libraryEncoder.libraryPlayButtonPressed = true;
      },
      onLongRelease: function () {
        this.libraryEncoder.libraryPlayButtonPressed = false;
      },
      onLongPress: function () {
        engine.setValue('[Library]', 'clear_search', 1);
      },
    });
    this.libraryViewButton = new Button({
      group: '[Skin]',
      key: 'show_maximized_library',
      libraryEncoder: this.libraryEncoder,
      libraryEncoderPress: this.libraryEncoderPress,
      onShortRelease: function () {
        script.toggleControl(this.group, this.inKey, true);
      },
      onLongPress: function () {
        this.libraryEncoder.libraryViewButtonPressed = true;
        this.libraryEncoderPress.libraryViewButtonPressed = true;
      },
      onLongRelease: function () {
        this.libraryEncoder.libraryViewButtonPressed = false;
        this.libraryEncoderPress.libraryViewButtonPressed = false;
      },
    });

    this.keyboardPlayMode = null;
    this.keyboardOffset = 9;

    this.pads = Array(8).fill(new Component());
    const defaultPadLayer = [
      new IntroOutroButton({
        cueBaseName: 'intro_start',
      }),
      new IntroOutroButton({
        cueBaseName: 'intro_end',
      }),
      new IntroOutroButton({
        cueBaseName: 'outro_start',
      }),
      new IntroOutroButton({
        cueBaseName: 'outro_end',
      }),
      new HotcueButton({
        number: 1,
      }),
      new HotcueButton({
        number: 2,
      }),
      new HotcueButton({
        number: 3,
      }),
      new HotcueButton({
        number: 4,
      }),
    ];
    const hotcuePage2 = Array(8).fill({});
    const hotcuePage3 = Array(8).fill({});
    const samplerOrBeatloopRollPage = Array(8).fill({});
    this.keyboard = Array(8).fill({});
    let i = 0;
    /* eslint no-unused-vars: "off" */
    for (const pad of hotcuePage2) {
      // start with hotcue 5; hotcues 1-4 are in defaultPadLayer
      hotcuePage2[i] = new HotcueButton({ number: i + 1 });
      hotcuePage3[i] = new HotcueButton({ number: i + 13 });
      if (UseBeatloopRollInsteadOfSampler) {
        samplerOrBeatloopRollPage[i] = new BeatLoopRollButton({
          number: i,
          deck: this,
        });
      } else {
        let samplerNumber = i + 1;
        if (samplerNumber > 4) {
          samplerNumber += 4;
        }
        if (decks[0] > 1) {
          samplerNumber += 4;
        }
        samplerOrBeatloopRollPage[i] = new SamplerButton({
          number: samplerNumber,
        });
        if (SamplerCrossfaderAssign) {
          engine.setValue(
            `[Sampler${samplerNumber}]`,
            'orientation',
            decks[0] === 1 ? 0 : 2
          );
        }
      }
      this.keyboard[i] = new KeyboardButton({
        number: i + 1,
        deck: this,
      });
      i++;
    }

    const switchPadLayer = (deck, newLayer) => {
      let index = 0;
      for (let pad of deck.pads) {
        pad.outDisconnect();
        pad.inDisconnect();

        pad = newLayer[index];
        Object.assign(pad, io.pads[index]);
        if (!(pad instanceof HotcueButton)) {
          pad.color = deck.color;
        }
        // don't change the group of SamplerButtons
        if (!(pad instanceof SamplerButton)) {
          pad.group = deck.group;
        }
        if (pad.inReport === undefined) {
          pad.inReport = inReports[1];
        }
        pad.outReport = outReport;
        pad.inConnect();
        pad.outConnect();
        pad.outTrigger();
        deck.pads[index] = pad;
        index++;
      }
    };

    this.padLayers = {
      defaultLayer: 0,
      hotcuePage2: 1,
      hotcuePage3: 2,
      samplerPage: 3,
      keyboard: 5,
    };
    switch (DefaultPadLayout) {
      case DefaultPadLayoutHotcue:
        switchPadLayer(this, hotcuePage2);
        this.currentPadLayer = this.padLayers.hotcuePage2;
        break;
      case DefaultPadLayoutSamplerBeatloop:
        switchPadLayer(this, samplerOrBeatloopRollPage);
        this.currentPadLayer = this.padLayers.samplerPage;
        break;
      case DefaultPadLayoutKeyboard:
        switchPadLayer(this, this.keyboard);
        this.currentPadLayer = this.padLayers.keyboard;
        break;
      default:
        switchPadLayer(this, defaultPadLayer);
        this.currentPadLayer = this.padLayers.defaultLayer;
        break;
    }

    this.hotcuePadModeButton = new Button({
      deck: this,
      onShortPress: function () {
        if (!this.shifted) {
          if (this.deck.currentPadLayer !== this.deck.padLayers.hotcuePage2) {
            switchPadLayer(this.deck, hotcuePage2);
            this.deck.currentPadLayer = this.deck.padLayers.hotcuePage2;
          } else {
            switchPadLayer(this.deck, defaultPadLayer);
            this.deck.currentPadLayer = this.deck.padLayers.defaultLayer;
          }
          this.deck.lightPadMode();
        } else {
          switchPadLayer(this.deck, hotcuePage3);
          this.deck.currentPadLayer = this.deck.padLayers.hotcuePage3;
          this.deck.lightPadMode();
        }
      },
      // hack to switch the LED color when changing decks
      outTrigger: function () {
        this.deck.lightPadMode();
      },
    });
    // The record button doesn't have a mapping by default, but you can add yours here
    // this.recordPadModeButton = new Button({
    //     ...
    // });
    this.samplesPadModeButton = new Button({
      deck: this,
      onShortPress: function () {
        if (this.deck.currentPadLayer !== this.deck.padLayers.samplerPage) {
          switchPadLayer(this.deck, samplerOrBeatloopRollPage);
          engine.setValue('[Samplers]', 'show_samplers', true);
          this.deck.currentPadLayer = this.deck.padLayers.samplerPage;
        } else {
          switchPadLayer(this.deck, defaultPadLayer);
          engine.setValue('[Samplers]', 'show_samplers', false);
          this.deck.currentPadLayer = this.deck.padLayers.defaultLayer;
        }
        this.deck.lightPadMode();
      },
    });
    // The mute button doesn't have a mapping by default, but you can add yours here
    // this.mutePadModeButton = new Button({
    //    ...
    // });

    this.stemsPadModeButton = new Button({
      deck: this,
      previousMoveMode: null,
      onLongPress: function () {
        if (this.deck.keyboardPlayMode !== null) {
          this.deck.keyboardPlayMode = null;
          this.deck.lightPadMode();
        }
      },
      onShortPress: function () {
        if (this.previousMoveMode === null) {
          this.previousMoveMode = this.deck.moveMode;
          this.deck.moveMode = moveModes.keyboard;
        }
      },
      onShortRelease: function () {
        if (this.previousMoveMode !== null && !this.deck.keyboardPlayMode) {
          this.deck.moveMode = this.previousMoveMode;
          this.previousMoveMode = null;
        }
        if (this.deck.currentPadLayer === this.deck.padLayers.keyboard) {
          switchPadLayer(this.deck, defaultPadLayer);
          this.deck.currentPadLayer = this.deck.padLayers.defaultLayer;
        } else if (this.deck.currentPadLayer !== this.deck.padLayers.keyboard) {
          switchPadLayer(this.deck, this.deck.keyboard);
          this.deck.currentPadLayer = this.deck.padLayers.keyboard;
        }
        this.deck.lightPadMode();
      },
      onLongRelease: function () {
        if (this.previousMoveMode !== null && !this.deck.keyboardPlayMode) {
          this.deck.moveMode = this.previousMoveMode;
          this.previousMoveMode = null;
        }
      },
      // hack to switch the LED color when changing decks
      outTrigger: function () {
        this.deck.lightPadMode();
      },
    });

    this.wheelMode = wheelModes.vinyl;
    this.turntableButton = undefined;
    this.jogButton = new Button({
      deck: this,
      input: function (press) {
        if (press) {
          this.deck.reverseButton.loopModeOff(true);
          this.deck.fluxButton.loopModeOff(true);
          if (this.deck.wheelMode === wheelModes.vinyl) {
            this.deck.wheelMode = wheelModes.jog;
          } else {
            this.deck.wheelMode = wheelModes.vinyl;
          }
          engine.setValue(this.group, 'scratch2_enable', false);
          this.outTrigger();
        }
      },
      outTrigger: function () {
        const vinylOn = this.deck.wheelMode === wheelModes.vinyl;
        this.send(
          this.color + (vinylOn ? this.brightnessOn : this.brightnessOff)
        );
        if (this.deck.turntableButton) {
          const motorOn = this.deck.wheelMode === wheelModes.motor;
          this.deck.turntableButton.send(
            this.color + (motorOn ? this.brightnessOn : this.brightnessOff)
          );
        }
      },
    });

    this.wheelTouch = new Button({
      touched: false,
      deck: this,
      input: function (touched) {
        this.touched = touched;
        if (
          this.deck.wheelMode === wheelModes.vinyl ||
          this.deck.wheelMode === wheelModes.motor
        ) {
          if (touched) {
            engine.setValue(this.group, 'scratch2_enable', true);
          } else {
            this.stopScratchWhenOver();
          }
        }
      },
      stopScratchWhenOver: function () {
        if (this.touched) {
          return;
        }

        if (
          engine.getValue(this.group, 'play') &&
          engine.getValue(this.group, 'scratch2') <
            1.5 * baseRevolutionsPerSecond &&
          engine.getValue(this.group, 'scratch2') > 0
        ) {
          engine.setValue(this.group, 'scratch2_enable', false);
        } else if (engine.getValue(this.group, 'scratch2') === 0) {
          engine.setValue(this.group, 'scratch2_enable', false);
        } else {
          engine.beginTimer(100, this.stopScratchWhenOver.bind(this), true);
        }
      },
    });

    // The relative and absolute position inputs have the same resolution but direction
    // cannot be determined reliably with the absolute position because it is easily
    // possible to spin the wheel fast enough that it spins more than half a revolution
    // between input reports. So there is no need to process the absolution position
    // at all; the relative position is sufficient.
    this.wheelRelative = new Component({
      oldValue: null,
      deck: this,
      speed: 0,
      input: function (value, timestamp) {
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
          engine.getValue(this.group, 'scratch2') === 0 &&
          engine.getValue(this.group, 'jog') === 0 &&
          this.deck.wheelMode !== wheelModes.motor
        ) {
          return;
        }

        switch (this.deck.wheelMode) {
          case wheelModes.motor:
            engine.setValue(this.group, 'scratch2', this.speed);
            break;
          case wheelModes.loopIn:
            {
              const loopStartPosition = engine.getValue(
                this.group,
                'loop_start_position'
              );
              const loopEndPosition = engine.getValue(
                this.group,
                'loop_end_position'
              );
              const value = Math.min(
                loopStartPosition + this.speed * LoopWheelMoveFactor,
                loopEndPosition - LoopWheelMoveFactor
              );
              engine.setValue(this.group, 'loop_start_position', value);
            }
            break;
          case wheelModes.loopOut:
            {
              const loopEndPosition = engine.getValue(
                this.group,
                'loop_end_position'
              );
              const value = loopEndPosition + this.speed * LoopWheelMoveFactor;
              engine.setValue(this.group, 'loop_end_position', value);
            }
            break;
          case wheelModes.vinyl:
            if (
              this.deck.wheelTouch.touched ||
              engine.getValue(this.group, 'scratch2') !== 0
            ) {
              engine.setValue(this.group, 'scratch2', this.speed);
            } else {
              engine.setValue(this.group, 'jog', this.speed);
            }
            break;
          default:
            engine.setValue(this.group, 'jog', this.speed);
        }
      },
    });

    this.wheelLED = new Component({
      deck: this,
      lastPos: 0,
      lastMode: null,
      outConnect: function () {
        if (this.group !== undefined) {
          const connection0 = engine.makeConnection(
            this.group,
            'playposition',
            (position) => this.output.bind(this)(position, true, true)
          );
          // This is useful for case where effect would have been fully disabled in Mixxx. This appears to be the case during unit tests.
          if (connection0) {
            this.outConnections[0] = connection0;
          } else {
            console.warn(
              `Unable to connect ${this.group}.playposition' to the controller output. The control appears to be unavailable.`
            );
          }
          const connection1 = engine.makeConnection(
            this.group,
            'play',
            (play) =>
              this.output.bind(this)(
                engine.getValue(this.group, 'playposition'),
                play,
                play || engine.getValue(this.group, 'track_loaded')
              )
          );
          // This is useful for case where effect would have been fully disabled in Mixxx. This appears to be the case during unit tests.
          if (connection1) {
            this.outConnections[1] = connection1;
          } else {
            console.warn(
              `Unable to connect ${this.group}.play' to the controller output. The control appears to be unavailable.`
            );
          }
          const connection2 = engine.makeConnection(
            this.group,
            'track_loaded',
            (trackLoaded) =>
              this.output.bind(this)(
                engine.getValue(this.group, 'playposition'),
                !trackLoaded ? false : engine.getValue(this.group, 'play'),
                trackLoaded
              )
          );
          // This is useful for case where effect would have been fully disabled in Mixxx. This appears to be the case during unit tests.
          if (connection2) {
            this.outConnections[2] = connection2;
          } else {
            console.warn(
              `Unable to connect ${this.group}.track_loaded' to the controller output. The control appears to be unavailable.`
            );
          }
        }
      },
      output: function (fractionOfTrack, playstate, trackLoaded) {
        if (this.deck.wheelMode > wheelModes.motor) {
          return;
        }
        // Emit cue haptic feedback if enabled
        const samplePos = Math.round(
          fractionOfTrack * engine.getValue(this.group, 'track_samples')
        );

        this.lastPos = samplePos;

        const durationSeconds = engine.getValue(this.group, 'duration');
        const positionSeconds = fractionOfTrack * durationSeconds;
        const revolutions = positionSeconds * baseRevolutionsPerSecond;
        const fractionalRevolution = revolutions - Math.floor(revolutions);
        const LEDposition = fractionalRevolution * wheelAbsoluteMax;

        const wheelOutput = new Uint8Array(40).fill(0);
        wheelOutput[0] = decks[0] - 1;
        wheelOutput[4] = this.color + Button.prototype.brightnessOn;

        if (!trackLoaded) {
          wheelOutput[1] = wheelLEDmodes.off;
        } else if (
          playstate &&
          fractionOfTrack < 1 &&
          engine.getValue(this.group, 'end_of_track') &&
          WheelLedBlinkOnTrackEnd &&
          !this.deck.wheelTouch.touched
        ) {
          wheelOutput[1] = wheelLEDmodes.ringFlash;
        } else {
          wheelOutput[1] = wheelLEDmodes.spot;
          wheelOutput[2] = LEDposition & 0xff;
          wheelOutput[3] = LEDposition >> 8;
          if (this.lastMode === wheelLEDmodes.ringFlash) {
            wheelOutput[4] = Button.prototype.brightnessOff;
            engine.beginTimer(
              200,
              () => this.output(fractionOfTrack, playstate, trackLoaded),
              true
            );
          }
        }
        this.lastMode = wheelOutput[1];

        controller.sendOutputReport(50, wheelOutput.buffer, true);
      },
    });

    for (const property in this) {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        const component = this[property];
        if (component instanceof Component) {
          Object.assign(component, io[property]);
          if (component.inReport === undefined) {
            component.inReport = inReports[1];
          }
          component.outReport = outReport;
          if (component.group === undefined) {
            component.group = this.group;
          }
          if (component.color === undefined) {
            component.color = this.color;
          }
          if (component instanceof Encoder) {
            component.max = 2 ** component.inBitLength - 1;
          }
          component.inConnect();
          component.outConnect();
          component.outTrigger();
          if (typeof this.unshift === 'function' && this.unshift.length === 0) {
            this.unshift();
          }
        }
      }
    }
  }

  assignKeyboardPlayMode(group, action) {
    this.keyboardPlayMode = {
      group: group,
      action: action,
    };
    this.lightPadMode();
  }

  lightPadMode() {
    if (this.currentPadLayer === this.padLayers.hotcuePage2) {
      this.hotcuePadModeButton.send(
        this.hotcuePadModeButton.color + this.hotcuePadModeButton.brightnessOn
      );
    } else if (this.currentPadLayer === this.padLayers.hotcuePage3) {
      this.hotcuePadModeButton.send(
        LedColors.white + this.hotcuePadModeButton.brightnessOn
      );
    } else {
      this.hotcuePadModeButton.send(
        this.hotcuePadModeButton.color + this.hotcuePadModeButton.brightnessOff
      );
    }

    // unfortunately the other pad mode buttons only have one LED color
    // const recordPadModeLEDOn = this.currentPadLayer === this.padLayers.hotcuePage3;
    // this.recordPadModeButton.send(recordPadModeLEDOn ? 127 : 0);

    const samplesPadModeLEDOn =
      this.currentPadLayer === this.padLayers.samplerPage;
    this.samplesPadModeButton.send(samplesPadModeLEDOn ? 127 : 0);

    // this.mutePadModeButtonLEDOn = this.currentPadLayer === this.padLayers.samplerPage2;
    // const mutedModeButton.send(mutePadModeButtonLEDOn ? 127 : 0);
    if (this.keyboardPlayMode !== null) {
      this.stemsPadModeButton.send(
        LedColors.green + this.stemsPadModeButton.brightnessOn
      );
    } else {
      const keyboardPadModeLEDOn =
        this.currentPadLayer === this.padLayers.keyboard;
      this.stemsPadModeButton.send(
        this.stemsPadModeButton.color +
          (keyboardPadModeLEDOn
            ? this.stemsPadModeButton.brightnessOn
            : this.stemsPadModeButton.brightnessOff)
      );
    }
  }
}
