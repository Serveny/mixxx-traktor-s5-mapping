// src/mapping.ts
var mapping = {
	fxUnitLeft: {
		knobs: [
			{
				touch: {
					inReportId: 1,
					inByte: 3,
					inBit: 3,
					inLengthBit: 1
				},
				fade: {
					inReportId: 2,
					inByte: 58
				}
			},
			{
				touch: {
					inReportId: 1,
					inByte: 3,
					inBit: 2,
					inLengthBit: 1
				},
				fade: {
					inReportId: 2,
					inByte: 60
				}
			},
			{
				touch: {
					inReportId: 1,
					inByte: 3,
					inBit: 1,
					inLengthBit: 1
				},
				fade: {
					inReportId: 2,
					inByte: 62
				}
			},
			{
				touch: {
					inReportId: 1,
					inByte: 3,
					inBit: 0,
					inLengthBit: 1
				},
				fade: {
					inReportId: 2,
					inByte: 64
				}
			}
		],
		buttons: [
			{
				inReportId: 1,
				inByte: 5,
				inBit: 2,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 24,
				outLengthByte: 1
			},
			{
				inReportId: 1,
				inByte: 5,
				inBit: 5,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 25,
				outLengthByte: 1
			},
			{
				inReportId: 1,
				inByte: 5,
				inBit: 3,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 26,
				outLengthByte: 1
			},
			{
				inReportId: 1,
				inByte: 5,
				inBit: 4,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 27,
				outLengthByte: 1
			}
		]
	},
	deckLeft: {
		displayAreaAndControls: {
			settings: {
				inReportId: 1,
				inByte: 7,
				inBit: 6,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 28,
				outLengthByte: 1
			},
			display1: {
				inReportId: 1,
				inByte: 7,
				inBit: 1,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 29,
				outLengthByte: 1
			},
			display2: {
				inReportId: 1,
				inByte: 7,
				inBit: 7,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 30,
				outLengthByte: 1
			},
			performanceModeLeft: {
				inReportId: 1,
				inByte: 7,
				inBit: 0,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 31,
				outLengthByte: 1
			},
			view: {
				inReportId: 1,
				inByte: 6,
				inBit: 4,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 32,
				outLengthByte: 1
			},
			display3: {
				inReportId: 1,
				inByte: 6,
				inBit: 3,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 33,
				outLengthByte: 1
			},
			display4: {
				inReportId: 1,
				inByte: 6,
				inBit: 5,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 34,
				outLengthByte: 1
			},
			performanceModeRight: {
				inReportId: 1,
				inByte: 6,
				inBit: 2,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 35,
				outLengthByte: 1
			}
		},
		browseControls: {
			browse: {
				touch: {
					inReportId: 1,
					inByte: 13,
					inBit: 4,
					inLengthBit: 1
				},
				press: {
					inReportId: 1,
					inByte: 6,
					inBit: 1,
					inLengthBit: 1
				},
				fade: {
					inReportId: 1,
					inByte: 0,
					inBit: 0,
					inLengthBit: 4
				}
			},
			back: {
				inReportId: 1,
				inByte: 6,
				inBit: 0,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 36,
				outLengthByte: 1
			}
		},
		modeSelect: {
			hotcueMode: {
				inReportId: 1,
				inByte: 9,
				inBit: 6,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 42,
				outLengthByte: 2
			},
			freeze: {
				inReportId: 1,
				inByte: 9,
				inBit: 1,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 44,
				outLengthByte: 2
			},
			remix: {
				inReportId: 1,
				inByte: 9,
				inBit: 7,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 46,
				outLengthByte: 2
			}
		},
		pads: [
			{
				inReportId: 1,
				inByte: 9,
				inBit: 4,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 0,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 9,
				inBit: 3,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 3,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 9,
				inBit: 5,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 6,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 9,
				inBit: 2,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 9,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 8,
				inBit: 6,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 12,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 8,
				inBit: 1,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 15,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 8,
				inBit: 7,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 18,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 8,
				inBit: 0,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 21,
				outLengthByte: 3
			}
		],
		touchStrip: {
			leds: {
				blue: {
					outReportId: 128,
					outByte: 54,
					outLengthByte: 25
				},
				red: {
					outReportId: 128,
					outByte: 79,
					outLengthByte: 25
				}
			},
			touch: {
				inReportId: 1,
				inByte: 19,
				inBit: 0,
				inLengthBit: 16
			}
		},
		transportControls: {
			shift: {
				inReportId: 1,
				inByte: 8,
				inBit: 4,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 49,
				outLengthByte: 1
			},
			sync: {
				inReportId: 1,
				inByte: 8,
				inBit: 3,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 50,
				outLengthByte: 2
			},
			cue: {
				inReportId: 1,
				inByte: 8,
				inBit: 5,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 52,
				outLengthByte: 1
			},
			play: {
				inReportId: 1,
				inByte: 8,
				inBit: 2,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 53,
				outLengthByte: 1
			}
		},
		flux: {
			inReportId: 1,
			inByte: 9,
			inBit: 0,
			inLengthBit: 1,
			outReportId: 128,
			outByte: 48,
			outLengthByte: 1
		},
		loop: {
			touch: {
				inReportId: 1,
				inByte: 13,
				inBit: 5,
				inLengthBit: 1
			},
			press: {
				inReportId: 1,
				inByte: 6,
				inBit: 6,
				inLengthBit: 1
			},
			fade: {
				inReportId: 1,
				inByte: 0,
				inBit: 4,
				inLengthBit: 4
			}
		},
		loopLed: {
			outReportId: 128,
			outByte: 40,
			outLengthByte: 2
		},
		deck: {
			inReportId: 1,
			inByte: 6,
			inBit: 7,
			inLengthBit: 1,
			outReportId: 128,
			outByte: 38,
			outLengthByte: 2
		}
	},
	mixer: {
		channelC: {
			gain: {
				inReportId: 2,
				inByte: 38
			},
			fxUnitAssignLeft: {
				inReportId: 1,
				inByte: 4,
				inBit: 3,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 0,
				outLengthByte: 1
			},
			fxUnitAssignRight: {
				inReportId: 1,
				inByte: 4,
				inBit: 2,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 1,
				outLengthByte: 1
			},
			volumeLevel: {
				outReportId: 130,
				outByte: 19,
				outLengthByte: 11
			},
			eqHigh: {
				inReportId: 2,
				inByte: 40
			},
			eqMid: {
				inReportId: 2,
				inByte: 42
			},
			eqLow: {
				inReportId: 2,
				inByte: 44
			},
			filter: {
				inReportId: 2,
				inByte: 46
			},
			filterBtn: {
				inReportId: 1,
				inByte: 4,
				inBit: 5,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 10,
				outLengthByte: 1
			},
			cue: {
				inReportId: 1,
				inByte: 4,
				inBit: 4,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 14,
				outLengthByte: 1
			},
			volume: {
				inReportId: 2,
				inByte: 4
			}
		},
		channelA: {
			gain: {
				inReportId: 2,
				inByte: 18
			},
			fxUnitAssignLeft: {
				inReportId: 1,
				inByte: 4,
				inBit: 1,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 2,
				outLengthByte: 1
			},
			fxUnitAssignRight: {
				inReportId: 1,
				inByte: 4,
				inBit: 6,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 3,
				outLengthByte: 1
			},
			volumeLevel: {
				outReportId: 130,
				outByte: 30,
				outLengthByte: 11
			},
			eqHigh: {
				inReportId: 2,
				inByte: 20
			},
			eqMid: {
				inReportId: 2,
				inByte: 22
			},
			eqLow: {
				inReportId: 2,
				inByte: 24
			},
			filter: {
				inReportId: 2,
				inByte: 26
			},
			filterBtn: {
				inReportId: 1,
				inByte: 5,
				inBit: 1,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 11,
				outLengthByte: 1
			},
			cue: {
				inReportId: 1,
				inByte: 5,
				inBit: 0,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 15,
				outLengthByte: 1
			},
			volume: {
				inReportId: 2,
				inByte: 0
			}
		},
		mainGain: {
			inReportId: 2,
			inByte: 10
		},
		snap: {
			inReportId: 1,
			inByte: 4,
			inBit: 0,
			inLengthBit: 1,
			outReportId: 130,
			outByte: 4,
			outLengthByte: 1
		},
		quantize: {
			inReportId: 1,
			inByte: 4,
			inBit: 7,
			inLengthBit: 1,
			outReportId: 130,
			outByte: 5,
			outLengthByte: 1
		},
		boothGain: {
			inReportId: 2,
			inByte: 12
		},
		tempo: {
			fade: {
				inReportId: 1,
				inByte: 2,
				inBit: 0,
				inLengthBit: 4
			},
			press: {
				inReportId: 1,
				inByte: 10,
				inBit: 7,
				inLengthBit: 1
			}
		},
		cueMix: {
			inReportId: 2,
			inByte: 14
		},
		cueGain: {
			inReportId: 2,
			inByte: 16
		},
		aux: {
			inReportId: 1,
			inByte: 11,
			inBit: 0,
			inLengthBit: 1,
			outReportId: 130,
			outByte: 16,
			outLengthByte: 1
		},
		auxToggle: {
			inReportId: 1,
			inByte: 10,
			inBit: 3,
			inLengthBit: 1,
			outReportId: 130,
			outByte: 16,
			outLengthByte: 1
		},
		mainLevel: {
			outReportId: 130,
			outByte: 63,
			outLengthByte: 2
		},
		channelB: {
			gain: {
				inReportId: 2,
				inByte: 28
			},
			fxUnitAssignLeft: {
				inReportId: 1,
				inByte: 12,
				inBit: 0,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 6,
				outLengthByte: 1
			},
			fxUnitAssignRight: {
				inReportId: 1,
				inByte: 12,
				inBit: 1,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 7,
				outLengthByte: 1
			},
			volumeLevel: {
				outReportId: 130,
				outByte: 41,
				outLengthByte: 11
			},
			eqHigh: {
				inReportId: 2,
				inByte: 30
			},
			eqMid: {
				inReportId: 2,
				inByte: 32
			},
			eqLow: {
				inReportId: 2,
				inByte: 34
			},
			filter: {
				inReportId: 2,
				inByte: 36
			},
			filterBtn: {
				inReportId: 1,
				inByte: 10,
				inBit: 2,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 12,
				outLengthByte: 1
			},
			cue: {
				inReportId: 1,
				inByte: 10,
				inBit: 5,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 17,
				outLengthByte: 1
			},
			volume: {
				inReportId: 2,
				inByte: 2
			}
		},
		channelD: {
			gain: {
				inReportId: 2,
				inByte: 48
			},
			fxUnitAssignLeft: {
				inReportId: 1,
				inByte: 12,
				inBit: 2,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 8,
				outLengthByte: 1
			},
			fxUnitAssignRight: {
				inReportId: 1,
				inByte: 12,
				inBit: 3,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 9,
				outLengthByte: 1
			},
			volumeLevel: {
				outReportId: 130,
				outByte: 52,
				outLengthByte: 11
			},
			eqHigh: {
				inReportId: 2,
				inByte: 50
			},
			eqMid: {
				inReportId: 2,
				inByte: 52
			},
			eqLow: {
				inReportId: 2,
				inByte: 54
			},
			filter: {
				inReportId: 2,
				inByte: 56
			},
			filterBtn: {
				inReportId: 1,
				inByte: 10,
				inBit: 6,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 13,
				outLengthByte: 1
			},
			cue: {
				inReportId: 1,
				inByte: 10,
				inBit: 4,
				inLengthBit: 1,
				outReportId: 130,
				outByte: 18,
				outLengthByte: 1
			},
			volume: {
				inReportId: 2,
				inByte: 6
			}
		},
		cross: {
			inReportId: 2,
			inByte: 8
		}
	},
	fxUnitRight: {
		knobs: [
			{
				touch: {
					inReportId: 1,
					inByte: 3,
					inBit: 7,
					inLengthBit: 1
				},
				fade: {
					inReportId: 2,
					inByte: 66
				}
			},
			{
				touch: {
					inReportId: 1,
					inByte: 3,
					inBit: 6,
					inLengthBit: 1
				},
				fade: {
					inReportId: 2,
					inByte: 68
				}
			},
			{
				touch: {
					inReportId: 1,
					inByte: 3,
					inBit: 5,
					inLengthBit: 1
				},
				fade: {
					inReportId: 2,
					inByte: 70
				}
			},
			{
				touch: {
					inReportId: 1,
					inByte: 3,
					inBit: 4,
					inLengthBit: 1
				},
				fade: {
					inReportId: 2,
					inByte: 72
				}
			}
		],
		buttons: [
			{
				inReportId: 1,
				inByte: 13,
				inBit: 0,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 24,
				outLengthByte: 1
			},
			{
				inReportId: 1,
				inByte: 13,
				inBit: 1,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 25,
				outLengthByte: 1
			},
			{
				inReportId: 1,
				inByte: 13,
				inBit: 2,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 26,
				outLengthByte: 1
			},
			{
				inReportId: 1,
				inByte: 13,
				inBit: 3,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 27,
				outLengthByte: 1
			}
		]
	},
	deckRight: {
		displayAreaAndControls: {
			settings: {
				inReportId: 1,
				inByte: 12,
				inBit: 4,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 28,
				outLengthByte: 1
			},
			display1: {
				inReportId: 1,
				inByte: 12,
				inBit: 5,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 29,
				outLengthByte: 1
			},
			display2: {
				inReportId: 1,
				inByte: 12,
				inBit: 6,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 30,
				outLengthByte: 1
			},
			performanceModeLeft: {
				inReportId: 1,
				inByte: 12,
				inBit: 7,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 31,
				outLengthByte: 1
			},
			view: {
				inReportId: 1,
				inByte: 16,
				inBit: 5,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 32,
				outLengthByte: 1
			},
			display3: {
				inReportId: 1,
				inByte: 16,
				inBit: 2,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 33,
				outLengthByte: 1
			},
			display4: {
				inReportId: 1,
				inByte: 16,
				inBit: 6,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 34,
				outLengthByte: 1
			},
			performanceModeRight: {
				inReportId: 1,
				inByte: 16,
				inBit: 1,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 35,
				outLengthByte: 1
			}
		},
		browseControls: {
			browse: {
				touch: {
					inReportId: 1,
					inByte: 13,
					inBit: 6,
					inLengthBit: 1
				},
				press: {
					inReportId: 1,
					inByte: 14,
					inBit: 0,
					inLengthBit: 1
				},
				fade: {
					inReportId: 1,
					inByte: 1,
					inBit: 0,
					inLengthBit: 4
				}
			},
			back: {
				inReportId: 1,
				inByte: 14,
				inBit: 1,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 36,
				outLengthByte: 1
			}
		},
		modeSelect: {
			hotcueMode: {
				inReportId: 1,
				inByte: 16,
				inBit: 0,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 42,
				outLengthByte: 2
			},
			freeze: {
				inReportId: 1,
				inByte: 16,
				inBit: 7,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 44,
				outLengthByte: 2
			},
			remix: {
				inReportId: 1,
				inByte: 15,
				inBit: 7,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 46,
				outLengthByte: 2
			}
		},
		pads: [
			{
				inReportId: 1,
				inByte: 15,
				inBit: 3,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 0,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 15,
				inBit: 5,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 3,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 15,
				inBit: 1,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 6,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 16,
				inBit: 4,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 9,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 15,
				inBit: 4,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 12,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 15,
				inBit: 2,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 15,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 15,
				inBit: 6,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 18,
				outLengthByte: 3
			},
			{
				inReportId: 1,
				inByte: 16,
				inBit: 3,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 21,
				outLengthByte: 3
			}
		],
		touchStrip: {
			leds: {
				blue: {
					outReportId: 129,
					outByte: 54,
					outLengthByte: 25
				},
				red: {
					outReportId: 129,
					outByte: 79,
					outLengthByte: 25
				}
			},
			touch: {
				inReportId: 1,
				inByte: 25,
				inBit: 0,
				inLengthBit: 16
			}
		},
		transportControls: {
			shift: {
				inReportId: 1,
				inByte: 11,
				inBit: 4,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 49,
				outLengthByte: 1
			},
			sync: {
				inReportId: 1,
				inByte: 11,
				inBit: 1,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 50,
				outLengthByte: 2
			},
			cue: {
				inReportId: 1,
				inByte: 11,
				inBit: 2,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 52,
				outLengthByte: 1
			},
			play: {
				inReportId: 1,
				inByte: 11,
				inBit: 5,
				inLengthBit: 1,
				outReportId: 129,
				outByte: 53,
				outLengthByte: 1
			}
		},
		flux: {
			inReportId: 1,
			inByte: 15,
			inBit: 0,
			inLengthBit: 1,
			outReportId: 129,
			outByte: 48,
			outLengthByte: 1
		},
		loop: {
			touch: {
				inReportId: 1,
				inByte: 13,
				inBit: 7,
				inLengthBit: 1
			},
			press: {
				inReportId: 1,
				inByte: 14,
				inBit: 3,
				inLengthBit: 1
			},
			fade: {
				inReportId: 1,
				inByte: 1,
				inBit: 4,
				inLengthBit: 4
			}
		},
		loopLed: {
			outReportId: 129,
			outByte: 40,
			outLengthByte: 2
		},
		deck: {
			inReportId: 1,
			inByte: 14,
			inBit: 2,
			inLengthBit: 1,
			outReportId: 129,
			outByte: 38,
			outLengthByte: 2
		}
	}
};
// src/types/mixxx-controls.ts
function channelGroup(channel) {
	return `[Channel${channel}]`;
}
function microphoneGroup(channel) {
	return channel === 1 ? "[Microphone]" : `[Microphone${channel}]`;
}
function equalizerGroup(group) {
	return `[EqualizerRack1_${group}_Effect1]`;
}
function quickEffectGroup(group) {
	return `[QuickEffectRack1_${group}]`;
}
// src/settings.ts
var channels = [
	channelGroup(1),
	channelGroup(2),
	channelGroup(3),
	channelGroup(4)
];
var settings = {
	loopEncoderMoveFactor: engine.getSetting("loopEncoderMoveFactor") || 500,
	loopEncoderShiftMoveFactor: engine.getSetting("loopEncoderShiftMoveFactor") || 2500,
	useKeylockOnMaster: !!engine.getSetting("useKeylockOnMaster"),
	softwareMixerMain: !!engine.getSetting("softwareMixerMain"),
	softwareMixerBooth: !!engine.getSetting("softwareMixerBooth"),
	softwareMixerHeadphone: !!engine.getSetting("softwareMixerHeadphone"),
	autoOpenBrowserOnTouch: engine.getSetting("autoOpenBrowserOnTouch")
};
// src/hid-report.ts
var HIDInputReport = class {
	constructor(reportId) {
		this.reportId = reportId;
		this.fields = [];
	}
	registerCallback(callback, io) {
		if (typeof callback !== "function") throw Error("callback must be a function");
		if (!Number.isInteger(io.inByte)) throw Error("inByte must be 0 or a positive integer");
		if (!Number.isInteger(io.inBit) || io.inBit < 0) throw Error("inBit must be 0 or a positive integer");
		if (!Number.isInteger(io.inLengthBit) || io.inLengthBit < 1 || io.inLengthBit > 32) throw Error("bitLength must be an integer between 1 and 32");
		const field = {
			callback,
			io
		};
		this.fields.push(field);
		return {
			disconnect: () => {
				this.fields = this.fields.filter((element) => {
					return element !== field;
				});
			},
			trigger: () => {}
		};
	}
	handleInput(reportData) {
		const view = new DataView(reportData);
		for (const field of this.fields) {
			const numBytes = Math.ceil(field.io.inLengthBit / 8);
			let data;
			if (numBytes === 1) data = view.getUint8(field.io.inByte);
			else if (numBytes === 2) data = view.getUint16(field.io.inByte, true);
			else if (numBytes === 3) data = view.getUint32(field.io.inByte, true) >>> 8;
			else if (numBytes === 4) data = view.getUint32(field.io.inByte, true);
			else throw Error("field bitLength must be between 1 and 32");
			data = (data >> field.io.inBit & Math.pow(2, field.io.inLengthBit) - 1) >>> 0;
			if (field.oldData !== data) {
				field.callback(data);
				field.oldData = data;
			}
		}
	}
};
var HIDOutputReport = class {
	constructor(reportId, length) {
		this.reportId = reportId;
		this.data = new Uint8Array(length).fill(0);
	}
	send() {
		controller.sendOutputReport(this.reportId, this.data.buffer);
	}
};
function isInputReportId(reportId) {
	return reportId === 1 || reportId === 2;
}
var HIDReportHolder = class {
	constructor() {
		this.in = {
			1: new HIDInputReport(1),
			2: new HIDInputReport(2)
		};
		this.out = {
			128: new HIDOutputReport(128, 104),
			129: new HIDOutputReport(129, 104),
			130: new HIDOutputReport(130, 73)
		};
	}
};
// src/components/component.ts
var Component = class {
	constructor(..._) {}
};
var ControlComponent = class extends Component {
	constructor(...args) {
		super(...args);
		this.group = args[0].group;
	}
	rebindGroup(group) {
		this.group = group;
	}
};
function InMixin(Base) {
	return class extends Base {
		constructor(...args) {
			super(...args);
			const opts = args[0];
			this.inReport = opts.reports.in[opts.io.inReportId];
			this.io = opts.io;
			if (opts.input) this.input = opts.input;
			this.inConnection = this.inConnect();
		}
		inConnect() {
			return this.inReport.registerCallback(this.input.bind(this), this.io);
		}
		input(_) {}
	};
}
function OutMixin(Base) {
	return class extends Base {
		constructor(...args) {
			super(...args);
			const opts = args[0];
			this.outReport = opts.reports.out[opts.io.outReportId];
			this.io = opts.io;
			if (opts.output) this.output = opts.output;
		}
		output(value) {
			this.send(value);
		}
		send(value) {
			this.outReport.data[this.io.outByte] = value;
			this.outReport.send();
		}
	};
}
function ControlInMixin(Base) {
	const BaseIn = InMixin(Base);
	return class extends BaseIn {
		constructor(...args) {
			super(...args);
			const opts = args[0];
			this.inKey = opts.inKey;
		}
		input(pressed) {
			engine.setValue(this.group, this.inKey, pressed);
		}
		setInKey(key) {
			if (key === this.inKey) return;
			this.inKey = key;
		}
	};
}
function ControlOutMixin(Base) {
	const BaseOut = OutMixin(Base);
	return class extends BaseOut {
		constructor(...args) {
			super(...args);
			this.outConnection = null;
			const opts = args[0];
			this.outKey = opts.outKey;
			this.outConnection = this.outConnect();
		}
		outConnect() {
			const outCon = engine.makeConnection(this.group, this.outKey, this.output.bind(this));
			if (outCon == null) throw Error(`Unable to connect ${this.group}.${this.outKey}' to the controller output. The control appears to be unavailable.`);
			this.outConnection = outCon;
			return outCon;
		}
		outTrigger() {
			var _this$outConnection;
			(_this$outConnection = this.outConnection) === null || _this$outConnection === void 0 || _this$outConnection.trigger();
		}
		outDisconnect() {
			var _this$outConnection2;
			(_this$outConnection2 = this.outConnection) === null || _this$outConnection2 === void 0 || _this$outConnection2.disconnect();
			this.outConnection = null;
		}
		setOutKey(key) {
			if (key === this.outKey) return;
			this.outDisconnect();
			this.outKey = key;
			this.outConnect();
			this.outTrigger();
		}
		rebindGroup(group) {
			if (group === this.group) return;
			this.group = group;
			this.outDisconnect();
			this.outConnect();
			this.outTrigger();
		}
	};
}
function ShiftMixin(Base) {
	return class extends Base {
		constructor(..._args) {
			super(..._args);
			this.isShifted = false;
		}
		shift() {
			this.isShifted = true;
			this.onShift();
		}
		unshift() {
			this.isShifted = false;
			this.onUnshift();
		}
		onShift() {}
		onUnshift() {}
	};
}
function LongPressMixin(Base) {
	return class extends Base {
		constructor(..._args2) {
			super(..._args2);
			this.longPressTimeOutMillis = 225;
			this.longPressTimer = 0;
			this.isLongPress = false;
		}
		onShortPress() {}
		onShortRelease() {}
		onLongPress() {}
		onLongRelease() {}
		input(pressed) {
			if (pressed) {
				this.isLongPress = false;
				this.onShortPress();
				this.longPressTimer = engine.beginTimer(this.longPressTimeOutMillis, () => {
					this.isLongPress = true;
					this.longPressTimer = 0;
					this.onLongPress();
				}, true);
			} else if (this.isLongPress) this.onLongRelease();
			else {
				if (this.longPressTimer !== 0) {
					engine.stopTimer(this.longPressTimer);
					this.longPressTimer = 0;
				}
				this.onShortRelease();
			}
		}
	};
}
function IndicatorMixin(Base) {
	const BaseOut = OutMixin(Base);
	return class extends BaseOut {
		constructor(..._args3) {
			super(..._args3);
			this.indicatorIntervalMillis = 350;
			this.indicatorTimer = 0;
			this.indicatorState = false;
		}
		output(pressed) {
			if (this.indicatorTimer !== 0) return;
			this.send(pressed ? 127 : 9);
		}
		indicatorCallback() {
			this.indicatorState = !this.indicatorState;
			this.send(this.indicatorState ? 127 : 9);
		}
		indicator(on) {
			if (on && this.indicatorTimer === 0) this.indicatorTimer = engine.beginTimer(this.indicatorIntervalMillis, this.indicatorCallback.bind(this));
			else if (!on && this.indicatorTimer !== 0) {
				engine.stopTimer(this.indicatorTimer);
				this.indicatorTimer = 0;
				this.indicatorState = false;
			}
		}
	};
}
function SetInOutKeyMixin(Base) {
	const BaseOut = ControlOutMixin(ControlInMixin(Base));
	return class extends BaseOut {
		setKey(key) {
			this.setInKey(key);
			this.setOutKey(key);
		}
	};
}
function SingleColorOutMixin(Base) {
	const BaseOut = OutMixin(Base);
	return class extends BaseOut {
		output(value) {
			this.send(value ? 127 : 9);
		}
	};
}
function DoubleColorOutMixin(Base) {
	const BaseOut = OutMixin(Base);
	return class extends BaseOut {
		outputDoubleColor(brightness1, brightness2) {
			this.outReport.data[this.io.outByte] = brightness1;
			this.outReport.data[this.io.outByte + 1] = brightness2;
			this.outReport.send();
		}
	};
}
function RgbOutMixin(Base) {
	const BaseOut = OutMixin(Base);
	return class extends BaseOut {
		outputRgb(color) {
			this.outReport.data[this.io.outByte] = color.r();
			this.outReport.data[this.io.outByte + 1] = color.g();
			this.outReport.data[this.io.outByte + 2] = color.b();
			this.outReport.send();
		}
	};
}
// src/components/buttons/button.ts
var Button = class extends SingleColorOutMixin(ShiftMixin(ControlInMixin(ControlOutMixin(ControlComponent)))) {};
var PushButton = class extends Button {
	input(pressed) {
		engine.setValue(this.group, this.inKey, pressed);
	}
};
var ToggleButton = class extends Button {
	input(pressed) {
		if (pressed) script.toggleControl(this.group, this.inKey);
	}
};
// src/components/buttons/quantize-button.ts
var QuantizeButton = class extends Button {
	constructor(reports, io) {
		const key = "quantize";
		super({
			group: `[Channel1]`,
			inKey: key,
			outKey: key,
			reports,
			io
		});
		this.isGlobalQuantize = this.checkGlobalQuantize();
		this.output(this.isGlobalQuantize ? 1 : 0);
	}
	input(pressed) {
		if (pressed) {
			this.isGlobalQuantize = !this.isGlobalQuantize;
			for (const channel of channels) engine.setValue(channel, "quantize", this.isGlobalQuantize ? 1 : 0);
			this.output(this.isGlobalQuantize ? 127 : 0);
		}
	}
	checkGlobalQuantize() {
		return !channels.some((c) => !engine.getValue(c, "quantize"));
	}
};
// src/components/buttons/aux-button.ts
var AuxButton = class extends SingleColorOutMixin(InMixin(Component)) {
	constructor(reports, io) {
		super({
			reports,
			io
		});
		this.isHeld = false;
		this.output(0);
	}
	input(pressed) {
		this.isHeld = pressed !== 0;
		for (const aux of ["[Auxiliary1]", "[Auxiliary2]"]) engine.setValue(aux, "main_mix", this.isHeld ? 1 : 0);
		this.output(this.isHeld ? 1 : 0);
	}
};
// src/components/component-container.ts
var ComponentContainer = class extends ShiftMixin(ControlComponent) {
	constructor(group) {
		super({ group });
		this.children = [];
	}
	register(component, options = {}) {
		var _options$groupBound;
		this.children.push({
			component,
			groupBound: (_options$groupBound = options.groupBound) !== null && _options$groupBound !== void 0 ? _options$groupBound : false
		});
		return component;
	}
	*[Symbol.iterator]() {
		for (const { component } of this.children) yield component;
	}
	rebindGroupChildren(group) {
		this.group = group;
		for (const { component, groupBound } of this.children) {
			if (!groupBound) continue;
			const rebindGroup = component.rebindGroup;
			if (typeof rebindGroup === "function") rebindGroup.call(component, group);
		}
	}
	triggerComponents() {
		this.callAll("outTrigger");
	}
	onShift() {
		this.callAll("shift");
	}
	onUnshift() {
		this.callAll("unshift");
	}
	callAll(fnName) {
		for (const component of this) {
			const fn = component[fnName];
			if (typeof fn === "function") fn.call(component);
		}
	}
};
// src/components/encoders/encoder.ts
var Encoder = class extends ShiftMixin(ControlInMixin(ControlComponent)) {
	constructor(group, inKey, reports, io) {
		super({
			group,
			inKey,
			reports,
			io: io.fade
		});
		this.lastValue = null;
		this.max = 15;
		this.press = new EncoderPress(this, {
			reports,
			io: io.press
		});
	}
	input(value) {
		const oldValue = this.lastValue;
		this.lastValue = value;
		if (oldValue === null) return;
		let isRight;
		if (oldValue === this.max && value === 0) isRight = true;
		else if (oldValue === 0 && value === this.max) isRight = false;
		else isRight = value > oldValue;
		this.onChange(isRight);
	}
};
var TouchEncoder = class extends Encoder {
	constructor(group, inKey, reports, io) {
		super(group, inKey, reports, io);
		this.touch = new EncoderTouch(this, {
			reports,
			io: io.touch
		});
	}
};
var EncoderPress = class extends InMixin(Component) {
	constructor(encoder, opts) {
		super(opts);
		this.encoder = encoder;
	}
	input(value) {
		this.encoder.onPress(value);
	}
};
var EncoderTouch = class extends InMixin(Component) {
	constructor(encoder, opts) {
		super(opts);
		this.encoder = encoder;
	}
	input(value) {
		this.encoder.onTouch(value);
	}
};
// src/components/encoders/tempo-encoder.ts
var TempoEncoder = class extends Encoder {
	constructor(reports, io, anyDeckShifted) {
		super("[Channel1]", "bpm", reports, io);
		this.anyDeckShifted = anyDeckShifted;
	}
	onChange(isRight) {
		const step = (this.anyDeckShifted() ? 1 : .01) * (isRight ? 1 : -1);
		const leader = channels.find((c) => engine.getValue(c, "sync_leader"));
		const group = leader !== null && leader !== void 0 ? leader : "[InternalClock]";
		engine.setValue(group, "bpm", Math.round((engine.getValue(group, "bpm") + step) * 100) / 100);
	}
	onPress() {}
};
// src/components/pot.ts
var Pot = class extends ControlInMixin(ControlComponent) {
	constructor(group, inKey, reports, io) {
		super({
			group,
			inKey,
			reports,
			io: {
				inReportId: io.inReportId,
				inByte: io.inByte,
				inBit: 0,
				inLengthBit: 16
			}
		});
		this.max = Math.pow(2, 12) - 1;
		this.hardwarePosition = null;
	}
	input(value) {
		const receivingFirstValue = this.hardwarePosition === null;
		this.hardwarePosition = value / this.max;
		engine.setParameter(this.group, this.inKey, this.hardwarePosition);
		if (receivingFirstValue) engine.softTakeover(this.group, this.inKey, true);
	}
};
// src/components/volume-meter.ts
var FullBrightness = 127;
var DimBrightness = 125;
var VolumeMeter = class extends ControlOutMixin(ControlComponent) {
	constructor(deckNum, outKey, s5, io) {
		super({
			group: channelGroup(deckNum),
			outKey,
			reports: s5.reports,
			io
		});
		this.s5 = s5;
		this.deckSegments = 11;
		this.oldDeckLevel = 0;
		this.isChange = false;
		this.channelGroup = channelGroup(deckNum);
		this.auxGroup = `[Auxiliary${deckNum}]`;
		this.micGroup = microphoneGroup(deckNum);
	}
	output() {
		var _this$s5$deckLeft, _this$s5$deckRight;
		let deckGroup = this.channelGroup;
		if (!!(((_this$s5$deckLeft = this.s5.deckLeft) === null || _this$s5$deckLeft === void 0 ? void 0 : _this$s5$deckLeft.isShifted) || ((_this$s5$deckRight = this.s5.deckRight) === null || _this$s5$deckRight === void 0 ? void 0 : _this$s5$deckRight.isShifted))) {
			if (engine.getValue(this.auxGroup, "input_configured")) deckGroup = this.auxGroup;
			else if (engine.getValue(this.micGroup, "input_configured")) deckGroup = this.micGroup;
		}
		const deckLevel = Math.max(0, Math.min(engine.getValue(deckGroup, "vu_meter"), 1));
		this.isChange = deckLevel !== this.oldDeckLevel;
		if (!this.isChange) return;
		this.oldDeckLevel = deckLevel;
		const columnBaseIndex = this.io.outByte;
		const scaledLevel = deckLevel * this.deckSegments;
		for (let i = 0; i < this.deckSegments; i++) {
			const segmentLevel = scaledLevel - i;
			this.outReport.data[columnBaseIndex + i] = segmentLevel >= 1 ? FullBrightness : segmentLevel > .5 ? DimBrightness : 0;
		}
	}
};
// src/components/s5-mixer-column.ts
var S5MixerColumn = class extends ComponentContainer {
	constructor(deckNum, s5, io) {
		super(channelGroup(deckNum));
		this.deckNum = deckNum;
		this.gain = this.register(new Pot(this.group, "pregain", s5.reports, io.gain));
		this.eqHigh = this.register(new Pot(equalizerGroup(this.group), "parameter3", s5.reports, io.eqHigh));
		this.eqMid = this.register(new Pot(equalizerGroup(this.group), "parameter2", s5.reports, io.eqMid));
		this.eqLow = this.register(new Pot(equalizerGroup(this.group), "parameter1", s5.reports, io.eqLow));
		this.filterKnob = this.register(new Pot(quickEffectGroup(this.group), "super1", s5.reports, io.filter));
		this.filterButton = this.register(new ToggleButton({
			group: quickEffectGroup(this.group),
			inKey: "enabled",
			outKey: "enabled",
			reports: s5.reports,
			io: io.filterBtn
		}));
		this.volume = this.register(new Pot(this.group, "volume", s5.reports, io.volume));
		this.volumeMeter = this.register(new VolumeMeter(deckNum, "volume", s5, io.volumeLevel));
		this.pfl = this.register(new ToggleButton({
			group: this.group,
			inKey: "pfl",
			outKey: "pfl",
			reports: s5.reports,
			io: io.cue
		}));
		const assignKey = `group_${this.group}_enable`;
		this.fxAssignleft = this.register(new ToggleButton({
			group: "[EffectRack1_EffectUnit1]",
			inKey: assignKey,
			outKey: assignKey,
			reports: s5.reports,
			io: io.fxUnitAssignLeft
		}));
		this.fxAssignRight = this.register(new ToggleButton({
			group: "[EffectRack1_EffectUnit2]",
			inKey: assignKey,
			outKey: assignKey,
			reports: s5.reports,
			io: io.fxUnitAssignRight
		}));
		engine.setValue(this.group, "orientation", this.deckNum === 1 || this.deckNum === 3 ? 0 : 2);
		this.triggerComponents();
	}
};
// src/components/mixer.ts
var Mixer = class extends ComponentContainer {
	constructor(s5, io) {
		super("[Master]");
		this.s5 = s5;
		this.io = io;
		this.lastMainLevel = [-1, -1];
		this.channelC = this.register(new S5MixerColumn(3, s5, io.channelC));
		this.channelA = this.register(new S5MixerColumn(1, s5, io.channelA));
		this.channelB = this.register(new S5MixerColumn(2, s5, io.channelB));
		this.channelD = this.register(new S5MixerColumn(4, s5, io.channelD));
		this.quantizeButton = this.register(new QuantizeButton(s5.reports, io.quantize));
		this.auxButton = this.register(new AuxButton(s5.reports, io.aux));
		this.tempoEncoder = this.register(new TempoEncoder(s5.reports, io.tempo, () => s5.deckLeft.isShifted || s5.deckRight.isShifted));
		this.crossfader = this.register(new Pot("[Master]", "crossfader", s5.reports, io.cross));
		if (settings.softwareMixerMain) this.master = this.register(new Pot("[Master]", "gain", s5.reports, io.mainGain));
		if (settings.softwareMixerBooth) this.booth = this.register(new Pot("[Master]", "booth_gain", s5.reports, io.boothGain));
		if (settings.softwareMixerHeadphone) {
			this.cue = this.register(new Pot("[Master]", "headMix", s5.reports, io.cueMix));
			this.cueGain = this.register(new Pot("[Master]", "headGain", s5.reports, io.cueGain));
		}
	}
	updateMainLevel() {
		const report = this.s5.reports.out[this.io.mainLevel.outReportId];
		let changed = false;
		["peak_indicator_left", "peak_indicator_right"].forEach((key, i) => {
			const level = engine.getValue("[Main]", key) ? 127 : 0;
			if (level === this.lastMainLevel[i]) return;
			this.lastMainLevel[i] = level;
			report.data[this.io.mainLevel.outByte + i] = level;
			changed = true;
		});
		return changed;
	}
};
// src/components/encoders/browser-encoder.ts
var libraryFocus = {
	none: 0,
	sidebar: 2,
	tracksTable: 3,
	contextMenu: 4,
	dialog: 5
};
var BrowserEncoder = class extends TouchEncoder {
	constructor(deck, io) {
		super("[Library]", "MoveFocus", deck.reports, io);
		this.deck = deck;
	}
	onChange(isRight) {
		const popup = this.deck.display.activePopup;
		if (popup !== "none") {
			this.handlePopupChange(isRight, popup);
			return;
		}
		if (this.deck.isStemMode() && this.deck.stems.page === "volume" && this.deck.stems.hasSelection()) {
			this.deck.stems.adjustVolume(isRight ? 1 : -1);
			return;
		}
		const focused = engine.getValue("[Library]", "focused_widget");
		const targetFocus = this.isShifted ? libraryFocus.sidebar : libraryFocus.tracksTable;
		if (focused === libraryFocus.none) {
			engine.setValue("[Playlist]", this.isShifted ? isRight ? "SelectNextPlaylist" : "SelectPrevPlaylist" : isRight ? "SelectNextTrack" : "SelectPrevTrack", 1);
			this.deck.display.isPlaylistSelected = targetFocus === libraryFocus.tracksTable;
			return;
		}
		if (focused !== libraryFocus.contextMenu && focused !== libraryFocus.dialog) this.deck.display.isPlaylistSelected = targetFocus === libraryFocus.tracksTable;
		if (focused !== libraryFocus.contextMenu && focused !== libraryFocus.dialog && focused !== targetFocus) engine.setValue("[Library]", "focused_widget", targetFocus);
		engine.setValue("[Library]", isRight ? "MoveDown" : "MoveUp", 1);
	}
	handlePopupChange(isRight, popup) {
		if (popup === "browser") {
			this.deck.browser.scroll(isRight ? 1 : -1, this.isShifted);
			return;
		}
		if (popup === "bpm") {
			const currentBpm = engine.getValue(this.deck.group, "bpm");
			const step = this.isShifted ? 1 : .1;
			engine.setValue(this.deck.group, "bpm", currentBpm + (isRight ? step : -step));
			this.deck.display.resetPopupTimer();
			return;
		}
		if (popup === "key") {
			if (engine.getValue(this.deck.group, "keylock")) engine.setValue(this.deck.group, isRight ? "pitch_up" : "pitch_down", 1);
			this.deck.display.resetPopupTimer();
			return;
		}
		if (popup === "quantize") {
			this.deck.adjustQuantizeSize(isRight ? 1 : -1);
			this.deck.display.resetPopupTimer();
		}
	}
	onTouch(pressed) {
		if (this.deck.browser.enabled) {
			this.deck.browser.touch(pressed !== 0);
			return;
		}
		const focused = engine.getValue("[Library]", "focused_widget");
		this.deck.display.isPlaylistSelected = focused === libraryFocus.tracksTable;
		if (!pressed || this.deck.display.isPlaylistSelected || focused === libraryFocus.sidebar || !settings.autoOpenBrowserOnTouch) return;
		engine.setValue("[Library]", "focused_widget", libraryFocus.tracksTable);
	}
	onPress(pressed) {
		if (!pressed) return;
		if (this.deck.display.activePopup === "beatgrid") return;
		if (this.deck.display.activePopup === "key") {
			script.toggleControl(this.deck.group, "keylock");
			this.deck.display.resetPopupTimer();
			return;
		}
		if (this.deck.isStemMode() && this.deck.stems.page === "volume" && this.deck.stems.hasSelection()) {
			this.deck.stems.resetVolume();
			return;
		}
		if (this.deck.display.activePopup === "browser") {
			this.deck.browser.activate();
			return;
		}
		if (this.deck.browser.enabled) {
			this.deck.browser.open();
			return;
		}
		const focused = engine.getValue("[Library]", "focused_widget");
		if (focused === libraryFocus.tracksTable) this.deck.display.isPlaylistSelected = true;
		else if (focused === libraryFocus.sidebar) this.deck.display.isPlaylistSelected = false;
		if (this.deck.display.isPlaylistSelected) {
			engine.setValue(this.deck.group, "LoadSelectedTrack", 1);
			if (engine.getValue(this.deck.group, "hotcue_1_status") === 0) engine.setValue(this.deck.group, "hotcue_1_activate", 1);
			this.deck.display.setPlaylistStatus(false);
		} else {
			engine.setValue("[Library]", "focused_widget", libraryFocus.tracksTable);
			this.deck.display.setPlaylistStatus(true);
		}
	}
};
// src/components/buttons/browser-back-button.ts
var BrowserBackButton = class extends PushButton {
	constructor(display, reports, io) {
		const key = "show_maximized_library";
		super({
			group: "[Skin]",
			inKey: key,
			outKey: key,
			reports,
			io
		});
		this.display = display;
		this.exitTimer = 0;
	}
	input(pressed) {
		if (this.exitTimer !== 0) {
			engine.stopTimer(this.exitTimer);
			this.exitTimer = 0;
		}
		if (!pressed) return;
		const browser = this.display.deck.browser;
		if (browser.enabled) {
			if (!browser.isOpen) return;
			browser.back();
			this.exitTimer = engine.beginTimer(1e3, () => {
				this.exitTimer = 0;
				browser.close();
			}, true);
			return;
		}
		this.exitTimer = engine.beginTimer(1e3, () => {
			this.exitTimer = 0;
			this.display.setPlaylistStatus(false);
		}, true);
		const isFocusTrackTable = engine.getValue("[Library]", "focused_widget") === 3;
		this.display.setPlaylistStatus(isFocusTrackTable);
		if (this.display.isPlaylistSelected) engine.setValue("[Library]", "focused_widget", 2);
		else engine.setValue("[Library]", "MoveLeft", 1);
		this.display.togglePlaylistStatus();
	}
};
// src/components/buttons/cue-button.ts
var CueButton = class extends PushButton {
	constructor(deck, io) {
		super({
			group: deck.group,
			inKey: "cue_default",
			outKey: "cue_indicator",
			reports: deck.reports,
			io
		});
	}
	onUnshift() {
		this.inKey = "cue_default";
	}
	onShift() {
		this.inKey = "start_play";
	}
};
// src/components/buttons/deck-button.ts
var DeckButton = class extends OutMixin(InMixin(Component)) {
	constructor(deck, io) {
		super({
			reports: deck.reports,
			io
		});
		this.deck = deck;
		this.output();
	}
	input(value) {
		if (value) this.deck.toggleDeck();
		this.output();
	}
	output() {
		if (this.deck.currentDeckIdx === 0) {
			this.outReport.data[this.io.outByte] = 0;
			this.outReport.data[this.io.outByte + 1] = 127;
		} else {
			this.outReport.data[this.io.outByte] = 127;
			this.outReport.data[this.io.outByte + 1] = 0;
		}
		this.outReport.send();
	}
};
// src/components/buttons/flux-button.ts
var FluxButton = class extends SetInOutKeyMixin(LongPressMixin(IndicatorMixin(ShiftMixin(ControlOutMixin(ControlInMixin(ControlComponent)))))) {
	constructor(deck, io) {
		const key = "slip_enabled";
		super({
			group: deck.group,
			inKey: key,
			outKey: key,
			reports: deck.reports,
			io
		});
		this.deck = deck;
		this.loopModeConnection = null;
	}
	onUnshift() {
		this.setKey("slip_enabled");
	}
	onShift() {
		this.setKey("loop_enabled");
	}
	loopModeOff() {
		var _this$loopModeConnect;
		if (!this.deck.loopMoveMode) return;
		this.indicator(false);
		this.deck.loopMoveMode = false;
		(_this$loopModeConnect = this.loopModeConnection) === null || _this$loopModeConnect === void 0 || _this$loopModeConnect.disconnect();
		this.loopModeConnection = null;
	}
	onLoopChange(loopEnabled) {
		if (!loopEnabled) this.loopModeOff();
	}
	onShortPress() {
		this.indicator(false);
		if (this.isShifted) {
			if (!engine.getValue(this.group, "loop_enabled")) engine.setValue(this.group, "loop_out", 1);
			else if (!this.deck.loopMoveMode) {
				var _engine$makeConnectio;
				engine.setValue(this.group, "scratch2_enable", 0);
				this.deck.loopMoveMode = true;
				this.loopModeConnection = (_engine$makeConnectio = engine.makeConnection(this.group, this.outKey, this.onLoopChange.bind(this))) !== null && _engine$makeConnectio !== void 0 ? _engine$makeConnectio : null;
				this.indicator(true);
			} else this.loopModeOff();
		} else script.toggleControl(this.group, this.inKey);
	}
	rebindGroup(group) {
		this.loopModeOff();
		super.rebindGroup(group);
	}
};
// src/components/buttons/play-button.ts
var PlayButton = class extends SingleColorOutMixin(ShiftMixin(ControlOutMixin(ControlInMixin(ControlComponent)))) {
	constructor(deck, reports, io) {
		super({
			group: deck.group,
			inKey: "play",
			outKey: "play_indicator",
			reports,
			io
		});
	}
	input(pressed) {
		if (!pressed) return;
		script.toggleControl(this.group, this.inKey);
		if (this.isShifted) {
			engine.setValue(this.group, this.inKey, 0);
			script.triggerControl(this.group, "eject", 50);
		}
	}
};
// src/components/buttons/shift-button.ts
var ShiftButton = class extends SingleColorOutMixin(ShiftMixin(InMixin(Component))) {
	constructor(deck, io) {
		super({
			reports: deck.reports,
			io
		});
		this.deck = deck;
	}
	onUnshift() {
		this.output(0);
	}
	onShift() {
		this.output(1);
	}
	input(pressed) {
		if (pressed) this.deck.shift();
		else this.deck.unshift();
	}
};
// src/components/buttons/sync-button.ts
var _SyncButton;
var SyncButton = class SyncButton extends SingleColorOutMixin(ShiftMixin(LongPressMixin(SetInOutKeyMixin(ControlComponent)))) {
	constructor(deck, reports, io) {
		const key = "sync_enabled";
		super({
			group: deck.group,
			inKey: key,
			outKey: key,
			reports,
			io
		});
		this.phaseOffset = null;
		this.lastLed = -1;
	}
	onShortRelease() {
		if (this.isShifted && !settings.useKeylockOnMaster) {
			script.toggleControl(this.group, "sync_leader");
			return;
		}
		script.toggleControl(this.group, this.inKey);
		if (!this.isShifted) engine.softTakeover(this.group, "rate", true);
	}
	output(_value) {
		this.lastLed = -1;
		this.render();
	}
	setPhaseOffset(offset) {
		this.phaseOffset = offset;
		this.render();
	}
	render() {
		if (this.outKey === "keylock") {
			this.sendLed(engine.getValue(this.group, "keylock") ? 127 : 9, 0);
			return;
		}
		const synced = engine.getValue(this.group, "sync_enabled") !== 0 || engine.getValue(this.group, "sync_leader") !== 0;
		const outOfPhase = synced && this.phaseOffset !== null && Math.abs(this.phaseOffset) > SyncButton.phaseTolerance;
		if (!synced) this.sendLed(9, 0);
		else if (outOfPhase) this.sendLed(0, 127);
		else this.sendLed(127, 0);
	}
	sendLed(green, red) {
		const led = green * 256 + red;
		if (led === this.lastLed) return;
		this.lastLed = led;
		this.outReport.data[this.io.outByte] = green;
		this.outReport.data[this.io.outByte + 1] = red;
		this.outReport.send();
	}
	onLongPress() {
		if (this.isShifted) {
			engine.setValue(this.group, "sync_key", 1);
			engine.setValue(this.group, "sync_key", 0);
		} else script.toggleControl(this.group, "sync_enabled");
	}
	onShift() {
		if (settings.useKeylockOnMaster) this.setKey("keylock");
	}
	onUnshift() {
		if (settings.useKeylockOnMaster) this.setKey("sync_enabled");
	}
};
_SyncButton = SyncButton;
_SyncButton.phaseTolerance = .05;
// src/components/deck.ts
var Deck = class extends ComponentContainer {
	constructor(decks) {
		super(channelGroup(decks[0]));
		this.decks = decks;
		this.currentDeckIdx = 0;
		this.loopMoveMode = false;
	}
	toggleDeck() {
		this.currentDeckIdx = this.currentDeckIdx === 1 ? 0 : 1;
		this.switchDeck(channelGroup(this.decks[this.currentDeckIdx]));
	}
	switchDeck(newGroup) {
		engine.setValue(this.group, "scratch2_enable", 0);
		this.rebindGroupChildren(newGroup);
	}
};
// src/components/encoders/loop-encoder.ts
var loopEncoder = class extends TouchEncoder {
	constructor(deck, io) {
		super(deck.group, "loop_in", deck.reports, io);
		this.deck = deck;
		this.sortCategories = [
			2,
			1,
			15,
			17,
			9,
			20
		];
		this.sortCategoryIdx = 0;
		this.isFluxLoopHeld = false;
	}
	onChange(isRight) {
		if (this.deck.display.activePopup === "browser" && this.deck.browser.isSorting) this.deck.browser.cycleSortColumn(isRight ? 1 : -1);
		else if (this.deck.display.activePopup === "browser" && this.deck.browser.isPreviewMode) this.deck.browser.seekPreview(isRight ? 1 : -1);
		else if (this.deck.display.isSorting) this.switchSortCategory(isRight);
		else if (this.deck.mixer.auxButton.isHeld) {
			const aux = this.deck.decks[0] === 1 ? "[Auxiliary1]" : "[Auxiliary2]";
			const volume = engine.getValue(aux, "volume") + (isRight ? .05 : -.05);
			engine.setValue(aux, "volume", Math.max(0, Math.min(1, volume)));
		} else if (this.deck.display.activePopup === "beatgrid") this.deck.display.beatgrid.turn(isRight ? 1 : -1);
		else if (this.deck.performanceMode === "remix" && this.deck.remix.remixButtonHeld) {
			this.deck.remix.scroll(isRight ? 1 : -1);
			this.deck.refreshModePads();
		} else if (this.deck.isStemMode() && this.deck.stems.page === "filter" && this.deck.stems.hasSelection()) this.deck.stems.adjustFilter(isRight ? 1 : -1);
		else if (this.deck.display.activePopup === "sliceSize") this.deck.adjustSliceSize(isRight ? 1 : -1);
		else if (this.deck.loopMoveMode) {
			const moveFactor = this.isShifted ? settings.loopEncoderShiftMoveFactor : settings.loopEncoderMoveFactor;
			const delta = isRight ? moveFactor : -moveFactor;
			for (const key of ["loop_start_position", "loop_end_position"]) engine.setValue(this.group, key, engine.getValue(this.group, key) + delta);
		} else if (this.isShifted) {
			const size = this.deck.currentLoopSize();
			engine.setValue(this.group, `beatjump_${size}_${isRight ? "forward" : "backward"}`, 1);
		} else this.deck.adjustLoopSize(isRight ? 1 : -1);
	}
	isFluxActive() {
		return !this.isShifted && !this.deck.display.isSorting && this.deck.display.activePopup !== "browser" && engine.getValue(this.group, "slip_enabled") !== 0;
	}
	switchSortCategory(isRight) {
		const len = this.sortCategories.length;
		const change = isRight ? 1 : -1;
		this.sortCategoryIdx = (this.sortCategoryIdx + change + len) % len;
		const newCat = this.sortCategories[this.sortCategoryIdx];
		engine.setValue("[Library]", "sort_column", newCat);
	}
	onTouch(pressed) {
		if (this.deck.freezeButton.isPressed && pressed) {
			this.deck.display.openPopup("sliceSize", false);
			return;
		}
		if (!pressed && this.deck.display.activePopup === "sliceSize") this.deck.display.closePopup();
	}
	onPress(pressed) {
		if (this.isFluxLoopHeld || pressed && this.isFluxActive()) {
			this.isFluxLoopHeld = pressed !== 0;
			engine.setValue(this.group, "beatlooproll_activate", pressed ? 1 : 0);
			return;
		}
		if (!pressed) return;
		if (this.deck.display.activePopup === "browser" && this.deck.browser.isSorting) this.deck.browser.toggleSortOrder();
		else if (this.deck.display.activePopup === "browser" && this.deck.browser.isPreviewMode) this.deck.browser.togglePreview();
		else if (this.deck.display.isSorting) script.toggleControl("[Library]", "sort_order");
		else if (!this.isShifted && this.deck.isStemMode() && this.deck.stems.page === "filter" && this.deck.stems.hasSelection()) this.deck.stems.toggleFilter();
		else if (!this.isShifted && this.deck.performanceMode === "freeze") {
			this.deck.freezeSlicer.toggleSlicer();
			this.deck.redrawPads();
		} else if (!this.isShifted) script.triggerControl(this.group, "beatloop_activate", 50);
		else script.triggerControl(this.group, "reloop_toggle", 50);
	}
};
// src/components/touch-strip.ts
var TouchStrip = class extends ShiftMixin(InMixin(Component)) {
	constructor(deck, stripIo) {
		super({
			reports: deck.reports,
			io: stripIo.touch
		});
		this.deck = deck;
		this.maxValue = 1024;
		this.center = this.maxValue / 2;
		this.oldTime = 0;
		this.oldValue = 0;
		this.bpm = 0;
		this.leds = new TouchStripLEDs(this, stripIo.leds);
	}
	input(value) {
		if (this.isShifted) this.jumpToPos(value);
		else if (!engine.getValue(this.deck.group, "play_indicator")) this.scratch(value);
		else this.adjustPlaybackSpeed(value);
	}
	onShift() {
		this.leds.setOutKey("playposition");
		this.leds.lightAll(127, 0);
		const playPos = engine.getValue(this.deck.group, "playposition");
		this.leds.showPlayPositon(playPos);
	}
	onUnshift() {
		this.leds.setOutKey("scratch2");
		this.leds.showPhase(null);
	}
	showPhase(offset) {
		if (!this.isShifted) this.leds.showPhase(offset);
	}
	jumpToPos(value) {
		if (value) engine.setValue(this.deck.group, "playposition", value / this.maxValue);
	}
	scratch(value) {
		const deckNum = this.deck.decks[this.deck.currentDeckIdx];
		if (!value) {
			engine.scratchDisable(deckNum);
			this.oldTime = 0;
			this.oldValue = 0;
			return;
		}
		if (!engine.isScratching(deckNum)) engine.scratchEnable(deckNum, this.maxValue, 33.3, .125, .004);
		const speed = this.calcSpeed(value) * -8;
		engine.scratchTick(deckNum, speed);
	}
	adjustPlaybackSpeed(value) {
		if (this.bpm === 0) this.bpm = engine.getValue(this.deck.group, "bpm");
		if (!value) {
			engine.setValue(this.deck.group, "bpm", this.bpm);
			this.bpm = 0;
		} else {
			const bpmToAdd = (value - this.center) * 8 / this.center;
			engine.setValue(this.deck.group, "bpm", this.bpm + bpmToAdd);
		}
	}
	calcSpeed(value) {
		const time = Date.now();
		const deltaTime = time - this.oldTime;
		const deltaValue = value - this.oldValue;
		this.oldTime = time;
		this.oldValue = value;
		if (deltaTime === 0) return 0;
		return deltaValue / deltaTime;
	}
	rebindGroup(group) {
		this.leds.rebindGroup(group);
	}
};
var TouchStripLEDs = class extends ControlOutMixin(ControlComponent) {
	constructor(strip, brIo) {
		super({
			group: strip.deck.group,
			outKey: "scratch2",
			io: brIo.blue,
			reports: strip.deck.reports
		});
		this.strip = strip;
		this.brIo = brIo;
		this.oldPlayIdx = 0;
		this.stripSegments = 25;
		this.lastPhaseIdx = null;
		this.outReport.data[brIo.red.outByte + 12] = 127;
	}
	output(value) {
		if (this.strip.isShifted) this.showPlayPositon(value);
	}
	showPlayPositon(value) {
		const playIdx = Math.ceil(value * this.stripSegments - 1) - 1;
		if (playIdx === this.oldPlayIdx) return;
		[
			127,
			127,
			127
		].forEach((b, i) => this.lightBlue(this.oldPlayIdx + i, b));
		[
			0,
			0,
			0
		].forEach((b, i) => this.lightRed(this.oldPlayIdx + i, b));
		this.oldPlayIdx = playIdx;
		[
			0,
			0,
			0
		].forEach((b, i) => this.lightBlue(playIdx + i, b));
		[
			31,
			127,
			31
		].forEach((b, i) => this.lightRed(playIdx + i, b));
		this.outReport.send();
	}
	showPhase(offset) {
		const center = Math.floor(this.stripSegments / 2);
		const idx = offset === null ? center : center + Math.round(Math.max(-.5, Math.min(.5, offset)) * 2 * center);
		if (idx === this.lastPhaseIdx) return;
		this.lightAll(0, 0);
		this.lastPhaseIdx = idx;
		if (idx === center) this.lightRed(center, 127);
		for (let i = Math.min(idx, center); i <= Math.max(idx, center); i++) if (i !== center) this.lightBlue(i, 127);
		this.outReport.send();
	}
	lightAll(blueBrightness, redBrightness) {
		this.lastPhaseIdx = null;
		this.oldPlayIdx = NaN;
		for (let i = 0; i < this.stripSegments; i++) {
			this.lightBlue(i, blueBrightness);
			this.lightRed(i, redBrightness);
		}
	}
	lightBlue(idx, brightness) {
		if (idx >= 0 && idx < 25) this.outReport.data[this.brIo.blue.outByte + idx] = brightness;
	}
	lightRed(idx, brightness) {
		if (idx >= 0 && idx < 25) this.outReport.data[this.brIo.red.outByte + idx] = brightness;
	}
};
// src/components/buttons/performance-left-button.ts
var PerformanceLeftButton = class extends SingleColorOutMixin(InMixin(Component)) {
	constructor(display, reports, io) {
		super({
			reports,
			io
		});
		this.display = display;
		this.output(0);
	}
	input(pressed) {
		if (this.display.activePopup === "beatgrid") {
			if (pressed) this.display.beatgrid.cycle(-1);
			return;
		}
		if (pressed && this.display.deck.isStemMode()) {
			this.display.deck.stems.togglePage();
			return;
		}
		if (this.display.activePopup === "browser") {
			if (pressed) this.display.deck.browser.toggleSorting();
			return;
		}
		if (!pressed || !this.display.isPlaylistSelected) return;
		this.display.isSorting = !this.display.isSorting;
		this.output(this.display.isSorting ? 1 : 0);
	}
};
// src/components/buttons/performance-right-button.ts
var PerformanceRightButton = class extends Button {
	constructor(deck, io) {
		super({
			group: "[PreviewDeck1]",
			inKey: "play",
			outKey: "play_indicator",
			reports: deck.reports,
			io
		});
		this.deck = deck;
	}
	input(pressed) {
		if (this.deck.display.activePopup === "beatgrid") {
			if (pressed) this.deck.display.beatgrid.cycle(1);
			return;
		}
		if (this.deck.isStemMode()) {
			if (pressed) this.deck.stems.togglePage();
			return;
		}
		if (this.deck.display.activePopup === "browser") {
			if (pressed) this.deck.browser.togglePreviewMode();
			return;
		}
		if (pressed) script.triggerControl(this.group, "LoadSelectedTrackAndPlay", 50);
		else {
			engine.setValue(this.group, "play", 0);
			script.triggerControl(this.group, "eject", 50);
		}
	}
};
// src/components/start-cue.ts
var hotcueCount = 36;
var cueLoadDelayMillis = 200;
var trackStartSamplePos = 2;
var startCueColor = 16777215;
function connectStartCues() {
	for (const group of channels) engine.makeConnection(group, "track_loaded", (loaded) => {
		if (!loaded) return;
		engine.beginTimer(cueLoadDelayMillis, () => setStartCue(group), true);
	});
}
function setStartCue(group) {
	if (!engine.getValue(group, "track_loaded")) return;
	for (let n = 1; n <= hotcueCount; n++) if (engine.getValue(group, `hotcue_${n}_status`)) return;
	engine.setValue(group, "hotcue_1_setcue", 1);
	engine.setValue(group, "hotcue_1_position", trackStartSamplePos);
	engine.setValue(group, "hotcue_1_color", startCueColor);
}
function moveStartCueToFirstBeat(group) {
	const bpm = engine.getValue(group, "file_bpm");
	const sampleRate = engine.getValue(group, "track_samplerate");
	const closestBeat = engine.getValue(group, "beat_closest");
	if (bpm <= 0 || sampleRate <= 0 || closestBeat < 0) return;
	if (!engine.getValue(group, "hotcue_1_status")) return;
	if (engine.getValue(group, "hotcue_1_color") !== startCueColor) return;
	const beatLength = 60 / bpm * sampleRate * 2;
	if (engine.getValue(group, "hotcue_1_position") >= 2 * beatLength) return;
	const firstBeat = (closestBeat % beatLength + beatLength) % beatLength;
	const firstFrame = Math.round(firstBeat / 2) * 2;
	engine.setValue(group, "hotcue_1_position", Math.max(firstFrame, trackStartSamplePos));
}
// src/components/beatgrid-mode.ts
var beatgridParams = [
	"offset",
	"bpm",
	"fine",
	"scan"
];
var BeatgridMode = class {
	constructor(deck) {
		this.deck = deck;
		this.param = "offset";
	}
	cycle(direction) {
		const count = beatgridParams.length;
		const index = beatgridParams.indexOf(this.param);
		this.param = beatgridParams[(index + direction + count) % count];
	}
	turn(direction) {
		const group = this.deck.group;
		const up = direction > 0;
		switch (this.param) {
			case "offset":
				engine.setValue(group, up ? "beats_translate_later" : "beats_translate_earlier", 1);
				break;
			case "bpm":
				for (let i = 0; i < 10; i++) engine.setValue(group, up ? "beats_adjust_faster" : "beats_adjust_slower", 1);
				break;
			case "fine":
				engine.setValue(group, up ? "beats_adjust_faster" : "beats_adjust_slower", 1);
				break;
			case "scan":
				engine.setValue(group, up ? "beatjump_4_forward" : "beatjump_4_backward", 1);
				return;
		}
		moveStartCueToFirstBeat(group);
	}
	lock() {
		script.toggleControl(this.deck.group, "bpmlock");
	}
	tap() {
		engine.setValue(this.deck.group, "bpm_tap", 1);
		moveStartCueToFirstBeat(this.deck.group);
	}
	alignToPlayhead() {
		engine.setValue(this.deck.group, "beats_translate_curpos", 1);
		moveStartCueToFirstBeat(this.deck.group);
	}
	reset() {
		engine.setValue(this.deck.group, "beats_undo_adjustment", 1);
		moveStartCueToFirstBeat(this.deck.group);
	}
};
// src/components/display-area.ts
var popupNames = {
	none: "none",
	bpm: "bpm",
	key: "key",
	sliceSize: "sliceSize",
	quantize: "quantize",
	beatgrid: "beatgrid",
	browser: "browser"
};
var DisplayArea = class extends ComponentContainer {
	constructor(deck, io) {
		super(deck.group);
		this.isPlaylistSelected = false;
		this.isSorting = false;
		this.activePopup = popupNames.none;
		this.popupTimeoutMillis = 2e3;
		this.popupTimer = 0;
		this.deck = deck;
		this.beatgrid = new BeatgridMode(deck);
		this.settingsButton = this.register(new SettingsButton(deck.reports, io.settings), { groupBound: true });
		this.displayButton1 = this.register(new PopupButton(this, popupNames.bpm, deck.reports, io.display1), { groupBound: true });
		this.displayButton2 = this.register(new PopupButton(this, popupNames.key, deck.reports, io.display2), { groupBound: true });
		this.perfModeLeftButton = this.register(new PerformanceLeftButton(this, deck.reports, io.performanceModeLeft), { groupBound: true });
		this.viewButton = this.register(new ViewButton(this, deck.reports, io.view), { groupBound: true });
		this.displayButton3 = this.register(new ZoomOrScrollButton(deck, -1, {
			group: this.group,
			inKey: "waveform_zoom_down",
			outKey: "waveform_zoom_down",
			reports: deck.reports,
			io: io.display3
		}), { groupBound: true });
		this.displayButton4 = this.register(new ZoomOrScrollButton(deck, 1, {
			group: this.group,
			inKey: "waveform_zoom_up",
			outKey: "waveform_zoom_up",
			reports: deck.reports,
			io: io.display4
		}), { groupBound: true });
		this.perfModeRightButton = this.register(new PerformanceRightButton(deck, io.performanceModeRight), { groupBound: true });
		this.triggerComponents();
	}
	rebindGroup(group) {
		this.rebindGroupChildren(group);
	}
	openPopup(popup, autoClose = true) {
		if (this.popupTimer !== 0) {
			engine.stopTimer(this.popupTimer);
			this.popupTimer = 0;
		}
		if (this.activePopup === popup) {
			this.closePopup();
			return;
		}
		this.setActivePopup(popup);
		if (autoClose) this.resetPopupTimer();
	}
	closePopup() {
		if (this.popupTimer !== 0) {
			engine.stopTimer(this.popupTimer);
			this.popupTimer = 0;
		}
		this.setActivePopup(popupNames.none);
	}
	setActivePopup(popup) {
		const closesBrowser = this.activePopup === popupNames.browser && popup !== popupNames.browser;
		this.activePopup = popup;
		if (closesBrowser) this.deck.browser.onClosed();
		this.updatePopupOutputs();
	}
	resetPopupTimer() {
		if (this.popupTimer !== 0) engine.stopTimer(this.popupTimer);
		this.popupTimer = engine.beginTimer(this.popupTimeoutMillis, () => {
			this.popupTimer = 0;
			this.closePopup();
		}, true);
	}
	popupForDisplayButton2() {
		return this.deck.performanceMode === "remix" ? popupNames.quantize : popupNames.key;
	}
	updatePopupOutputs() {
		this.displayButton1.output(this.activePopup === popupNames.bpm ? 1 : 0);
		this.displayButton2.output(this.activePopup === popupNames.key || this.activePopup === popupNames.quantize ? 1 : 0);
		this.viewButton.flash(this.activePopup !== popupNames.none);
		this.deck.publishScreenState();
	}
	setPlaylistStatus(isActive) {
		if (!isActive) {
			this.isSorting = false;
			this.perfModeLeftButton.output(0);
			engine.setValue("[Skin]", "show_maximized_library", 0);
		}
		this.isPlaylistSelected = isActive;
	}
	togglePlaylistStatus() {
		this.setPlaylistStatus(!this.isPlaylistSelected);
	}
};
var PopupButton = class extends SingleColorOutMixin(InMixin(Component)) {
	constructor(display, popup, reports, io) {
		super({
			reports,
			io
		});
		this.display = display;
		this.popup = popup;
		this.output(0);
	}
	input(pressed) {
		if (!pressed) return;
		if (this.display.activePopup === popupNames.beatgrid) {
			if (this.popup === popupNames.bpm && !this.display.deck.isShifted) this.display.beatgrid.lock();
			else if (this.popup === popupNames.bpm) this.display.closePopup();
			else this.display.beatgrid.alignToPlayhead();
			return;
		}
		if (this.popup === popupNames.bpm && this.display.deck.isShifted) {
			this.display.openPopup(popupNames.beatgrid, false);
			return;
		}
		const popup = this.popup === popupNames.key ? this.display.popupForDisplayButton2() : this.popup;
		this.display.openPopup(popup);
	}
};
var SettingsButton = class extends SingleColorOutMixin(InMixin(Component)) {
	constructor(reports, io) {
		super({
			reports,
			io
		});
		this.output(0);
	}
	input(pressed) {
		if (!pressed) return;
		script.toggleControl("[Skin]", "show_maximized_library");
	}
};
var ViewButton = class extends SingleColorOutMixin(InMixin(Component)) {
	constructor(display, reports, io) {
		super({
			reports,
			io
		});
		this.display = display;
		this.blinkTimer = 0;
		this.blinkOn = false;
	}
	flash(on) {
		if (on && this.blinkTimer === 0) this.blinkTimer = engine.beginTimer(250, () => {
			this.blinkOn = !this.blinkOn;
			this.output(this.blinkOn ? 1 : 0);
		});
		else if (!on && this.blinkTimer !== 0) {
			engine.stopTimer(this.blinkTimer);
			this.blinkTimer = 0;
		}
		this.blinkOn = on;
		this.output(on ? 1 : 0);
	}
	input(pressed) {
		if (!pressed) return;
		if (this.display.activePopup !== popupNames.none) {
			this.display.closePopup();
			return;
		}
		script.toggleControl("[Skin]", "show_maximized_library");
	}
};
var ZoomOrScrollButton = class extends PushButton {
	constructor(deck, direction, options) {
		super(options);
		this.deck = deck;
		this.direction = direction;
	}
	input(pressed) {
		if (this.deck.display.activePopup === popupNames.beatgrid) {
			if (pressed && this.direction < 0) this.deck.display.beatgrid.tap();
			else if (pressed) this.deck.display.beatgrid.reset();
			return;
		}
		if (this.deck.performanceMode === "remix" && !this.deck.stems.available()) {
			if (pressed) {
				this.deck.remix.scroll(this.direction);
				this.deck.refreshModePads();
			}
			return;
		}
		super.input(pressed);
	}
};
// src/screen-state.ts
var api = () => engine;
function hasScreenApi() {
	return typeof api().setSharedValue === "function";
}
function publishScreenState(screenId, state) {
	if (!hasScreenApi()) return;
	for (const key of Object.keys(state)) api().setSharedValue(screenId, key, state[key]);
}
// src/color.ts
var RgbColor = class RgbColor {
	constructor(rgbNumber, _brightness = 1) {
		this.rgbNumber = rgbNumber;
		this._brightness = _brightness;
	}
	static fromRgb(r, g, b) {
		return new RgbColor((r << 16) + (g << 8) + b);
	}
	r() {
		return this._brightness * (this.rgbNumber >> 16 & 255);
	}
	g() {
		return this._brightness * (this.rgbNumber >> 8 & 255);
	}
	b() {
		return this._brightness * (this.rgbNumber & 255);
	}
	brightness(factor) {
		this._brightness = factor;
		return this;
	}
	static white() {
		return new RgbColor(8355711);
	}
	static blue() {
		return new RgbColor(127);
	}
};
// src/components/buttons/pad-button.ts
var PadButton = class extends RgbOutMixin(ShiftMixin(ControlInMixin(ControlOutMixin(ControlComponent)))) {
	constructor(number, deck, io) {
		super({
			group: deck.group,
			inKey: `hotcue_${number}_activate`,
			outKey: `hotcue_${number}_status`,
			reports: deck.reports,
			io
		});
		this.number = number;
		this.deck = deck;
		this.isActive = false;
		this.isPressed = false;
		this.fluxJumped = false;
		if (number < 1 || number > 32) throw Error("HotcueButton must have a number property of an integer between 1 and 32");
		this.colorComp = new ColorComponent(number === 1 ? RgbColor.white() : RgbColor.blue(), this);
		this.updateBindings();
		this.output(0);
	}
	onUnshift() {
		this.updateBindings();
	}
	onShift() {
		this.updateBindings();
	}
	updateBindings() {
		const hotcueNumber = this.deck.hotcueNumberForPad(this.number);
		this.setInKey(this.isShifted ? `hotcue_${hotcueNumber}_clear` : `hotcue_${hotcueNumber}_activate`);
		this.setOutKey(`hotcue_${hotcueNumber}_status`);
		this.colorComp.setOutKey(`hotcue_${hotcueNumber}_color`);
	}
	input(pressed) {
		this.isPressed = pressed !== 0;
		if (this.deck.performanceMode !== "hotcue") {
			this.deck.padInput(this.number, this.isPressed);
			return;
		}
		this.colorComp.colorOutput(this.isActive, this.isPressed);
		if (!pressed) {
			if (this.fluxJumped) {
				this.fluxJumped = false;
				engine.setValue(this.group, "slip_enabled", 0);
				engine.setValue(this.group, "slip_enabled", 1);
			}
			return;
		}
		this.updateBindings();
		engine.setValue(this.group, "scratch2_enable", 0);
		if (!this.isShifted && engine.getValue(this.group, "loop_enabled") !== 0) {
			engine.setValue(this.group, `hotcue_${this.deck.hotcueNumberForPad(this.number)}_setloop`, 1);
			return;
		}
		engine.setValue(this.group, this.inKey, 1);
		this.fluxJumped = !this.isShifted && engine.getValue(this.group, "slip_enabled") !== 0;
	}
	output(isActive) {
		this.isActive = isActive !== 0;
		this.colorComp.colorOutput(this.isActive, this.isPressed);
	}
	redraw() {
		this.colorComp.outTrigger();
		this.outTrigger();
	}
	paint(color) {
		this.outputRgb(color);
	}
	rebindGroup(group) {
		super.rebindGroup(group);
		this.colorComp.rebindGroup(group);
	}
};
var ColorComponent = class extends RgbOutMixin(ControlOutMixin(ControlComponent)) {
	constructor(color, padBtn) {
		super({
			group: padBtn.group,
			outKey: `hotcue_${padBtn.number}_color`,
			reports: padBtn.deck.reports,
			io: padBtn.io
		});
		this.color = color;
		this.padBtn = padBtn;
	}
	output(rgbNumber) {
		this.color = new RgbColor(rgbNumber);
		this.colorOutput(this.padBtn.isActive, false);
	}
	colorOutput(isActive, isPressed) {
		if (this.padBtn.deck.performanceMode !== "hotcue") return;
		this.outputRgb(this.color.brightness(!isActive ? 0 : isPressed ? 1 : .1));
	}
};
// src/components/buttons/hotcue-mode-button.ts
var HotcueModeButton = class extends DoubleColorOutMixin(LongPressMixin(ShiftMixin(OutMixin(InMixin(Component))))) {
	constructor(deck, io) {
		super({
			reports: deck.reports,
			io
		});
		this.deck = deck;
		this.output(0);
	}
	output(isOn) {
		const level = !isOn || this.deck.performanceMode !== "hotcue" ? 9 : this.deck.hotcuePage === 1 ? 127 : this.deck.hotcuePage === 2 ? 96 : 64;
		if (this.deck.currentDeckIdx === 0) this.outputDoubleColor(0, level);
		else this.outputDoubleColor(level, 0);
	}
	onShortPress() {
		if (this.deck.performanceMode !== "hotcue") {
			this.deck.hotcuePage = 1;
			this.deck.setPerformanceMode("hotcue");
			return;
		}
		this.deck.cycleHotcuePage();
	}
};
// src/components/buttons/freeze-button.ts
var FreezeButton = class extends DoubleColorOutMixin(OutMixin(InMixin(Component))) {
	constructor(deck, io) {
		super({
			reports: deck.reports,
			io
		});
		this.deck = deck;
		this.isPressed = false;
		this.output(0);
	}
	output(isOn) {
		if (this.deck.currentDeckIdx === 0) this.outputDoubleColor(0, isOn ? 127 : 9);
		else this.outputDoubleColor(isOn ? 127 : 9, 0);
	}
	input(pressed) {
		this.isPressed = pressed !== 0;
		if (pressed && this.deck.performanceMode !== "freeze") this.deck.setPerformanceMode("freeze");
		if (!pressed && this.deck.display.activePopup === "sliceSize") this.deck.display.closePopup();
	}
};
// src/components/buttons/remix-mode-button.ts
var RemixModeButton = class extends DoubleColorOutMixin(OutMixin(InMixin(Component))) {
	constructor(deck, io) {
		super({
			reports: deck.reports,
			io
		});
		this.deck = deck;
		this.output(0);
	}
	output(isOn) {
		if (this.deck.currentDeckIdx === 0) this.outputDoubleColor(0, isOn ? 127 : 9);
		else this.outputDoubleColor(isOn ? 127 : 9, 0);
	}
	input(pressed) {
		this.deck.remix.remixButtonHeld = pressed !== 0;
		this.deck.remix.invalidate();
		if (pressed && this.deck.performanceMode !== "remix") this.deck.setPerformanceMode("remix");
		this.deck.refreshModePads();
	}
};
// src/components/loop-led.ts
var LoopLed = class extends ControlOutMixin(ControlComponent) {
	constructor(deck, io) {
		super({
			group: deck.group,
			outKey: "loop_enabled",
			reports: deck.reports,
			io
		});
		this.deck = deck;
		this.blinkTimer = 0;
		this.blinkOn = false;
	}
	output(loopEnabled) {
		if (loopEnabled && this.blinkTimer === 0) this.blinkTimer = engine.beginTimer(250, () => {
			this.blinkOn = !this.blinkOn;
			this.render(this.blinkOn);
		});
		else if (!loopEnabled && this.blinkTimer !== 0) {
			engine.stopTimer(this.blinkTimer);
			this.blinkTimer = 0;
		}
		this.blinkOn = loopEnabled !== 0;
		this.render(this.blinkOn);
	}
	render(on) {
		const level = on ? 127 : 9;
		const isPrimaryDeck = this.deck.currentDeckIdx === 0;
		this.outReport.data[this.io.outByte] = isPrimaryDeck ? 0 : level;
		this.outReport.data[this.io.outByte + 1] = isPrimaryDeck ? level : 0;
		this.outReport.send();
	}
};
// src/components/freeze-slicer.ts
var sliceCount = 8;
var FreezeSlicer = class {
	constructor(deck) {
		this.deck = deck;
		this.start = 0;
		this.sliceLength = 0;
		this.slicer = false;
		this.heldPads = /* @__PURE__ */ new Set();
		this.fluxJumped = false;
		this.lastLeds = "";
	}
	get group() {
		return this.deck.group;
	}
	samplesPerBeat() {
		const bpm = engine.getValue(this.group, "file_bpm");
		return bpm > 0 ? 60 / bpm * engine.getValue(this.group, "track_samplerate") * 2 : 0;
	}
	freeze() {
		this.heldPads.clear();
		if (engine.getValue(this.group, "loop_enabled")) {
			const loopStart = engine.getValue(this.group, "loop_start_position");
			const loopEnd = engine.getValue(this.group, "loop_end_position");
			this.start = loopStart;
			this.sliceLength = (loopEnd - loopStart) / sliceCount;
			this.slicer = true;
		} else {
			const closestBeat = engine.getValue(this.group, "beat_closest");
			this.start = closestBeat >= 0 ? closestBeat : engine.getValue(this.group, "playposition") * engine.getValue(this.group, "track_samples");
			this.resize();
			this.slicer = false;
		}
		this.lastLeds = "";
	}
	resize() {
		this.sliceLength = this.samplesPerBeat() * this.deck.currentSliceSize();
		this.lastLeds = "";
	}
	toggleSlicer() {
		this.slicer = !this.slicer;
		if (!this.slicer) this.releaseLoop();
		this.lastLeds = "";
	}
	exit() {
		if (this.slicer) this.releaseLoop();
		this.slicer = false;
		this.heldPads.clear();
	}
	pad(padNumber, pressed) {
		if (pressed) this.heldPads.add(padNumber);
		else this.heldPads.delete(padNumber);
		const isFlux = engine.getValue(this.group, "slip_enabled") !== 0;
		if (this.slicer && !isFlux) {
			this.slicerPad(padNumber, pressed);
			return;
		}
		if (pressed) {
			this.jumpTo(this.sliceStart(padNumber));
			this.fluxJumped = isFlux;
		} else if (this.fluxJumped && this.heldPads.size === 0) {
			this.fluxJumped = false;
			engine.setValue(this.group, "slip_enabled", 0);
			engine.setValue(this.group, "slip_enabled", 1);
		}
	}
	slicerPad(padNumber, pressed) {
		if (this.heldPads.size === 0) {
			this.releaseLoop();
			return;
		}
		const held = [...this.heldPads];
		const first = Math.min(...held);
		const last = Math.max(...held);
		engine.setValue(this.group, "loop_start_position", this.sliceStart(first));
		engine.setValue(this.group, "loop_end_position", this.sliceStart(last + 1));
		if (!engine.getValue(this.group, "loop_enabled")) engine.setValue(this.group, "reloop_toggle", 1);
		if (pressed) this.jumpTo(this.sliceStart(padNumber));
	}
	releaseLoop() {
		if (engine.getValue(this.group, "loop_enabled")) engine.setValue(this.group, "reloop_toggle", 1);
	}
	sliceStart(padNumber) {
		return this.start + (padNumber - 1) * this.sliceLength;
	}
	jumpTo(samplePosition) {
		const trackSamples = engine.getValue(this.group, "track_samples");
		if (trackSamples <= 0) return;
		engine.setValue(this.group, "playposition", samplePosition / trackSamples);
		if (!engine.getValue(this.group, "play")) engine.setValue(this.group, "play", 1);
	}
	currentSlice() {
		if (this.sliceLength <= 0) return null;
		const position = engine.getValue(this.group, "playposition") * engine.getValue(this.group, "track_samples");
		const slice = Math.floor((position - this.start) / this.sliceLength) + 1;
		return slice >= 1 && slice <= sliceCount ? slice : null;
	}
	padColors() {
		const current = this.currentSlice();
		const slicer = this.slicer && !engine.getValue(this.group, "slip_enabled");
		return Array.from({ length: sliceCount }, (_, i) => {
			const color = slicer ? RgbColor.fromRgb(0, 127, 0) : RgbColor.blue();
			const bright = current === i + 1 || this.heldPads.has(i + 1);
			return color.brightness(bright ? 1 : .15);
		});
	}
	changedPadColors() {
		const colors = this.padColors();
		const key = colors.map((c) => `${c.r()},${c.g()},${c.b()}`).join(";");
		if (key === this.lastLeds) return null;
		this.lastLeds = key;
		return colors;
	}
};
var slots = 4;
var rowsPerPage = 2;
var slotColors = [
	8339200,
	32544,
	8323199,
	32639
];
var RemixSamplers = class {
	constructor(deck) {
		this.deck = deck;
		this.page = 0;
		this.remixButtonHeld = false;
		this.lastLeds = "";
	}
	get firstSampler() {
		return this.deck.decks[0] === 1 ? 1 : 17;
	}
	sampler(padNumber) {
		return `[Sampler${this.firstSampler + this.page * slots * rowsPerPage + padNumber - 1}]`;
	}
	samplersInSlot(slot) {
		return Array.from({ length: 16 / slots }, (_, row) => `[Sampler${this.firstSampler + row * slots + slot}]`);
	}
	pad(padNumber, pressed, shifted) {
		if (!pressed) return;
		const group = this.sampler(padNumber);
		if (this.remixButtonHeld) {
			for (const sampler of this.samplersInSlot((padNumber - 1) % slots)) script.toggleControl(sampler, "mute");
			return;
		}
		if (shifted) {
			engine.setValue(group, "cue_gotoandstop", 1);
			return;
		}
		if (!engine.getValue(group, "track_loaded")) {
			this.capture(group);
			return;
		}
		for (const sampler of this.samplersInSlot((padNumber - 1) % slots)) if (sampler !== group && engine.getValue(sampler, "play")) engine.setValue(sampler, "cue_gotoandstop", 1);
		if (engine.getValue(group, "hotcue_1_status")) {
			engine.setValue(group, "hotcue_1_activate", 1);
			engine.setValue(group, "hotcue_1_activate", 0);
			engine.setValue(group, "play", 1);
		} else engine.setValue(group, "cue_gotoandplay", 1);
	}
	capture(sampler) {
		const source = this.deck.group;
		if (!engine.getValue(source, "track_loaded")) return;
		const bpm = engine.getValue(source, "file_bpm");
		const samplesPerBeat = bpm > 0 ? 60 / bpm * engine.getValue(source, "track_samplerate") * 2 : 0;
		if (samplesPerBeat <= 0) return;
		const closestBeat = engine.getValue(source, "beat_closest");
		const start = closestBeat >= 0 ? closestBeat : engine.getValue(source, "playposition") * engine.getValue(source, "track_samples");
		const end = start + this.deck.currentLoopSize() * samplesPerBeat;
		const connection = engine.makeConnection(sampler, "track_loaded", (loaded) => {
			if (!loaded) return;
			connection === null || connection === void 0 || connection.disconnect();
			engine.setValue(sampler, "loop_start_position", start);
			engine.setValue(sampler, "loop_end_position", end);
			engine.setValue(sampler, "hotcue_1_setloop", 1);
			engine.setValue(sampler, "sync_enabled", 1);
		});
		engine.setValue(sampler, "LoadTrackFromDeck", this.deck.decks[this.deck.currentDeckIdx]);
	}
	scroll(direction) {
		this.page = Math.max(0, Math.min(1, this.page + direction));
		this.lastLeds = "";
	}
	padColors() {
		return Array.from({ length: 8 }, (_, i) => {
			const group = this.sampler(i + 1);
			if (this.remixButtonHeld) return RgbColor.white().brightness(engine.getValue(group, "mute") ? .1 : 1);
			if (!engine.getValue(group, "track_loaded")) return new RgbColor(0);
			return new RgbColor(slotColors[i % slots]).brightness(engine.getValue(group, "play") ? 1 : .2);
		});
	}
	changedPadColors() {
		const colors = this.padColors();
		const key = colors.map((c) => `${c.r()},${c.g()},${c.b()}`).join(";");
		if (key === this.lastLeds) return null;
		this.lastLeds = key;
		return colors;
	}
	invalidate() {
		this.lastLeds = "";
	}
};
// src/components/stem-pads.ts
var StemPads = class {
	constructor(deck) {
		this.deck = deck;
		this.page = "volume";
		this.selected = /* @__PURE__ */ new Set();
		this.lastLeds = "";
	}
	available() {
		return engine.getValue(this.deck.group, "stem_count") > 0;
	}
	stem(index) {
		return `[Channel${this.deck.decks[this.deck.currentDeckIdx]}_Stem${index}]`;
	}
	filter(index) {
		return `[QuickEffectRack1_${this.stem(index)}]`;
	}
	stemCount() {
		return Math.min(4, engine.getValue(this.deck.group, "stem_count"));
	}
	hasSelection() {
		return this.selected.size > 0;
	}
	pad(padNumber, pressed, shifted) {
		if (!pressed) return;
		const index = (padNumber - 1) % 4 + 1;
		if (index > this.stemCount()) return;
		if (padNumber <= 4) {
			if (!shifted) script.toggleControl(this.stem(index), "mute");
		} else if (shifted) this.reset(index);
		else if (this.selected.has(index)) this.selected.delete(index);
		else this.selected.add(index);
		this.lastLeds = "";
	}
	togglePage() {
		this.page = this.page === "volume" ? "filter" : "volume";
	}
	adjustVolume(direction) {
		for (const index of this.selected) {
			const group = this.stem(index);
			engine.setValue(group, "volume", clamp(engine.getValue(group, "volume") + direction * .05));
		}
	}
	resetVolume() {
		for (const index of this.selected) engine.setValue(this.stem(index), "volume", 1);
	}
	toggleFilter() {
		for (const index of this.selected) script.toggleControl(this.filter(index), "enabled");
	}
	adjustFilter(direction) {
		for (const index of this.selected) {
			const group = this.filter(index);
			engine.setValue(group, "super1", clamp(engine.getValue(group, "super1") + direction * .05));
		}
	}
	reset(index) {
		engine.setValue(this.stem(index), "volume", 1);
		engine.setValue(this.filter(index), "super1", .5);
		engine.setValue(this.filter(index), "enabled", 0);
	}
	clearSelection() {
		this.selected.clear();
		this.lastLeds = "";
	}
	padColors() {
		const count = this.stemCount();
		return Array.from({ length: 8 }, (_, i) => {
			const index = i % 4 + 1;
			if (index > count) return new RgbColor(0);
			if (i < 4) return new RgbColor(Math.max(0, engine.getValue(this.stem(index), "color")) >> 1 & 8355711).brightness(engine.getValue(this.stem(index), "mute") ? .1 : 1);
			return RgbColor.blue().brightness(this.selected.has(index) ? 1 : .15);
		});
	}
	changedPadColors() {
		const colors = this.padColors();
		const key = colors.map((c) => `${c.r()},${c.g()},${c.b()}`).join(";");
		if (key === this.lastLeds) return null;
		this.lastLeds = key;
		return colors;
	}
	invalidate() {
		this.lastLeds = "";
	}
};
function clamp(value) {
	return Math.max(0, Math.min(1, value));
}
// src/components/screen-browser.ts
var browserSortColumns = [
	"TITLE",
	"ARTIST",
	"BPM",
	"#",
	"KEY"
];
var defaultSortColumn = browserSortColumns.indexOf("#");
var fastScrollRows = 8;
var touchCloseDelayMillis = 3e3;
var ScreenBrowser = class {
	constructor(deck) {
		this.deck = deck;
		this.scrollRequest = 0;
		this.activateRequest = 0;
		this.backRequest = 0;
		this.previewRequest = 0;
		this.isSorting = false;
		this.sortColumn = defaultSortColumn;
		this.sortDescending = false;
		this.isPreviewMode = false;
		this.openedByTouch = false;
		this.closeTimer = 0;
		for (const group of channels) engine.makeConnection(group, "track_loaded", (loaded) => {
			if (loaded && group === this.deck.group) this.close();
		});
	}
	get enabled() {
		return hasScreenApi();
	}
	get isOpen() {
		return this.deck.display.activePopup === popupNames.browser;
	}
	open() {
		var _this$deck$otherSide;
		if (this.isOpen) return;
		(_this$deck$otherSide = this.deck.otherSide) === null || _this$deck$otherSide === void 0 || _this$deck$otherSide.browser.close();
		this.openedByTouch = false;
		this.deck.display.openPopup(popupNames.browser, false);
	}
	close() {
		if (!this.isOpen) return;
		this.deck.display.closePopup();
	}
	onClosed() {
		this.stopCloseTimer();
		this.isSorting = false;
		this.isPreviewMode = false;
		this.openedByTouch = false;
		this.deck.display.perfModeLeftButton.output(0);
	}
	scroll(direction, fast) {
		this.scrollRequest += direction * (fast ? fastScrollRows : 1);
		this.keepOpen();
		this.deck.publishScreenState();
	}
	activate() {
		this.activateRequest++;
		this.keepOpen();
		this.deck.publishScreenState();
	}
	back() {
		this.backRequest++;
		this.keepOpen();
		this.deck.publishScreenState();
	}
	touch(touched) {
		if (!settings.autoOpenBrowserOnTouch) return;
		if (touched) {
			this.stopCloseTimer();
			if (!this.isOpen && this.deck.display.activePopup === popupNames.none) {
				this.open();
				this.openedByTouch = true;
			}
		} else if (this.openedByTouch && this.isOpen) this.startCloseTimer();
	}
	keepOpen() {
		if (this.closeTimer !== 0) this.startCloseTimer();
	}
	startCloseTimer() {
		this.stopCloseTimer();
		this.closeTimer = engine.beginTimer(touchCloseDelayMillis, () => {
			this.closeTimer = 0;
			this.close();
		}, true);
	}
	stopCloseTimer() {
		if (this.closeTimer !== 0) {
			engine.stopTimer(this.closeTimer);
			this.closeTimer = 0;
		}
	}
	toggleSorting() {
		this.isSorting = !this.isSorting;
		this.deck.display.perfModeLeftButton.output(this.isSorting ? 1 : 0);
		this.keepOpen();
		this.deck.publishScreenState();
	}
	cycleSortColumn(direction) {
		const count = browserSortColumns.length;
		this.sortColumn = (this.sortColumn + direction + count) % count;
		this.keepOpen();
		this.deck.publishScreenState();
	}
	toggleSortOrder() {
		this.sortDescending = !this.sortDescending;
		this.keepOpen();
		this.deck.publishScreenState();
	}
	togglePreviewMode() {
		this.isPreviewMode = !this.isPreviewMode;
		if (!this.isPreviewMode) engine.setValue("[PreviewDeck1]", "play", 0);
		this.keepOpen();
		this.deck.publishScreenState();
	}
	togglePreview() {
		if (engine.getValue("[PreviewDeck1]", "play")) {
			engine.setValue("[PreviewDeck1]", "play", 0);
			return;
		}
		this.previewRequest++;
		this.keepOpen();
		this.deck.publishScreenState();
	}
	seekPreview(direction) {
		engine.setValue("[PreviewDeck1]", "beatjump", direction * 16);
		this.keepOpen();
	}
};
// src/components/s5-deck.ts
var S5Deck = class extends Deck {
	constructor(decks, effectUnit, mixer, reports, io) {
		super(decks);
		this.effectUnit = effectUnit;
		this.mixer = mixer;
		this.reports = reports;
		this.pads = [];
		this.performanceMode = "hotcue";
		this.hotcuePage = 1;
		this.loopSizePresets = [
			1 / 32,
			1 / 16,
			1 / 8,
			1 / 4,
			1 / 2,
			1,
			2,
			4,
			8,
			16,
			32
		];
		this.loopSizeIndex = 5;
		this.sliceSizePresets = [
			1 / 4,
			1 / 2,
			1,
			2,
			4
		];
		this.sliceSizeIndex = 2;
		this.quantizeSizes = [
			1 / 4,
			1 / 2,
			1,
			2,
			4,
			8,
			16
		];
		this.quantizeSizeIndex = 2;
		this.freezeSlicer = new FreezeSlicer(this);
		this.remix = new RemixSamplers(this);
		this.stems = new StemPads(this);
		this.browser = new ScreenBrowser(this);
		this.display = this.register(new DisplayArea(this, io.displayAreaAndControls), { groupBound: true });
		this.browserEncoder = this.register(new BrowserEncoder(this, io.browseControls.browse));
		this.browserBackButton = this.register(new BrowserBackButton(this.display, this.reports, io.browseControls.back));
		this.deckButton = this.register(new DeckButton(this, io.deck));
		this.loopEncoder = this.register(new loopEncoder(this, io.loop), { groupBound: true });
		this.loopLed = this.register(new LoopLed(this, io.loopLed), { groupBound: true });
		this.freezeButton = this.register(new FreezeButton(this, io.modeSelect.freeze), { groupBound: true });
		this.remixModeButton = this.register(new RemixModeButton(this, io.modeSelect.remix), { groupBound: true });
		this.hotcueModeButton = this.register(new HotcueModeButton(this, io.modeSelect.hotcueMode), { groupBound: true });
		this.fluxButton = this.register(new FluxButton(this, io.flux), { groupBound: true });
		this.touchStrip = this.register(new TouchStrip(this, io.touchStrip), { groupBound: true });
		const transCltr = io.transportControls;
		this.shiftButton = this.register(new ShiftButton(this, transCltr.shift));
		this.syncButton = this.register(new SyncButton(this, reports, transCltr.sync), { groupBound: true });
		this.cueButton = this.register(new CueButton(this, transCltr.cue), { groupBound: true });
		this.playButton = this.register(new PlayButton(this, reports, transCltr.play), { groupBound: true });
		for (let padNum = 1; padNum < 9; padNum++) this.pads.push(this.register(new PadButton(padNum, this, io.pads[padNum - 1]), { groupBound: true }));
		this.triggerComponents();
		this.updateModeButtons();
	}
	onShift() {
		super.onShift();
		this.effectUnit.shift();
	}
	onUnshift() {
		super.onUnshift();
		this.effectUnit.unshift();
	}
	switchDeck(newGroup) {
		if (this.performanceMode === "freeze") this.setPerformanceMode("hotcue");
		this.display.closePopup();
		super.switchDeck(newGroup);
		this.deckButton.output();
		this.updateModeButtons();
		this.redrawPads();
		this.publishScreenState();
	}
	publishScreenState() {
		publishScreenState(this.decks[0] === 1 ? "leftdeck" : "rightdeck", {
			group: this.group,
			popup: this.display.activePopup,
			sliceSize: this.sliceSizePresets[this.sliceSizeIndex],
			quantizeSize: this.quantizeSizes[this.quantizeSizeIndex],
			browserScrollRequest: this.browser.scrollRequest,
			browserActivateRequest: this.browser.activateRequest,
			browserBackRequest: this.browser.backRequest,
			browserPreviewRequest: this.browser.previewRequest,
			browserSorting: this.browser.isSorting,
			browserSortColumn: this.browser.sortColumn,
			browserSortDescending: this.browser.sortDescending,
			browserPreviewMode: this.browser.isPreviewMode
		});
	}
	phaseOffset() {
		var _others$find;
		if (!engine.getValue(this.group, "play") || engine.getValue(this.group, "sync_leader")) return null;
		const others = channels.filter((c) => c !== this.group && engine.getValue(c, "play"));
		const reference = (_others$find = others.find((c) => engine.getValue(c, "sync_leader"))) !== null && _others$find !== void 0 ? _others$find : others[0];
		if (!reference) return null;
		let offset = engine.getValue(this.group, "beat_distance") - engine.getValue(reference, "beat_distance");
		if (offset > .5) offset -= 1;
		else if (offset < -.5) offset += 1;
		return offset;
	}
	updatePhase() {
		const offset = this.phaseOffset();
		this.syncButton.setPhaseOffset(offset);
		this.touchStrip.showPhase(offset);
		this.refreshModePads();
	}
	setPerformanceMode(mode) {
		this.display.closePopup();
		if (this.performanceMode === "freeze" && mode !== "freeze") this.freezeSlicer.exit();
		if (mode !== "remix") this.stems.clearSelection();
		if (mode === "freeze" && this.performanceMode !== "freeze") this.freezeSlicer.freeze();
		this.performanceMode = mode;
		if (mode !== "hotcue") {
			this.hotcuePage = 1;
			this.refreshPads();
		}
		this.updateModeButtons();
		this.redrawPads();
	}
	isStemMode() {
		return this.performanceMode === "remix" && this.stems.available();
	}
	padInput(padNumber, pressed) {
		if (this.performanceMode === "freeze") this.freezeSlicer.pad(padNumber, pressed);
		else if (this.isStemMode()) this.stems.pad(padNumber, pressed, this.isShifted);
		else if (this.performanceMode === "remix") this.remix.pad(padNumber, pressed, this.isShifted);
		this.refreshModePads();
	}
	modePads() {
		if (this.performanceMode === "freeze") return this.freezeSlicer;
		if (this.performanceMode === "remix") return this.stems.available() ? this.stems : this.remix;
		return null;
	}
	redrawPads() {
		if (this.performanceMode === "hotcue") {
			for (const pad of this.pads) pad.redraw();
			return;
		}
		this.refreshModePads(true);
	}
	refreshModePads(force = false) {
		const source = this.modePads();
		if (!source) return;
		const colors = force ? source.padColors() : source.changedPadColors();
		if (!colors) return;
		this.pads.forEach((pad, i) => pad.paint(colors[i]));
	}
	currentSliceSize() {
		return this.sliceSizePresets[this.sliceSizeIndex];
	}
	cycleHotcuePage() {
		this.performanceMode = "hotcue";
		this.hotcuePage = this.hotcuePage % 3 + 1;
		this.refreshPads();
		this.updateModeButtons();
	}
	refreshPads() {
		for (const pad of this.pads) pad.updateBindings();
	}
	hotcueNumberForPad(padNumber) {
		if (this.hotcuePage === 1) return padNumber;
		if (this.hotcuePage === 2) return padNumber + 4;
		return padNumber + 12;
	}
	adjustLoopSize(direction) {
		this.loopSizeIndex = Math.max(0, Math.min(this.loopSizePresets.length - 1, this.loopSizeIndex + direction));
		const size = this.loopSizePresets[this.loopSizeIndex];
		engine.setValue(this.group, "beatloop_size", size);
		return size;
	}
	currentLoopSize() {
		return engine.getValue(this.group, "beatloop_size") || this.loopSizePresets[this.loopSizeIndex];
	}
	adjustSliceSize(direction) {
		this.sliceSizeIndex = Math.max(0, Math.min(this.sliceSizePresets.length - 1, this.sliceSizeIndex + direction));
		if (this.performanceMode === "freeze") this.freezeSlicer.resize();
		this.publishScreenState();
		return this.sliceSizePresets[this.sliceSizeIndex];
	}
	adjustQuantizeSize(direction) {
		this.quantizeSizeIndex = Math.max(0, Math.min(this.quantizeSizes.length - 1, this.quantizeSizeIndex + direction));
		this.publishScreenState();
		return this.quantizeSizes[this.quantizeSizeIndex];
	}
	updateModeButtons() {
		this.hotcueModeButton.output(this.performanceMode === "hotcue" ? 1 : 0);
		this.freezeButton.output(this.performanceMode === "freeze" ? 1 : 0);
		this.remixModeButton.output(this.performanceMode === "remix" ? 1 : 0);
	}
};
// src/components/buttons/fx-button.ts
var FxButton = class extends SingleColorOutMixin(LongPressMixin(ShiftMixin(ControlOutMixin(ControlInMixin(ControlComponent))))) {
	constructor(group, unit, reports, index, io) {
		const key = "enabled";
		super({
			group,
			inKey: key,
			outKey: key,
			reports,
			io: io[index + 1]
		});
		this.unit = unit;
		this.isResetButton = false;
	}
	applyMode(mode, index) {
		const effectNumber = index + 1;
		this.isResetButton = mode === "single" && index === 0;
		this.rebindGroup(this.unit.effectGroup(mode === "single" ? 1 : effectNumber));
		const key = mode === "single" && index > 0 ? `button_parameter${index}` : "enabled";
		this.setInKey(key);
		this.setOutKey(key);
	}
	onShortPress() {
		if (this.isResetButton && !this.isShifted) {
			this.unit.resetParameters();
			return;
		}
		if (!this.isShifted || this.unit.focusedEffect !== null) script.toggleControl(this.group, this.inKey);
	}
	onLongPress() {
		if (this.isShifted) this.unit.setFocusedEffect(this.unit.unitNumber);
	}
	onShortRelease() {
		if (this.isShifted && this.unit.focusedEffect === null) script.triggerControl(this.group, "next_effect", 50);
	}
	onLongRelease() {
		if (!this.isShifted && !this.isResetButton) script.toggleControl(this.group, this.inKey);
	}
};
// src/components/buttons/power-window-button.ts
var PowerWindowButton = class extends IndicatorMixin(ShiftMixin(ControlOutMixin(ControlInMixin(ControlComponent)))) {
	constructor(unit, reports, io) {
		const key = `group_[Channel${unit.unitNumber}]_enable`;
		super({
			group: unit.group,
			inKey: key,
			outKey: key,
			reports,
			io
		});
		this.unit = unit;
	}
	onShift() {
		this.group = this.unit.group;
		this.outKey = "group_[Master]_enable";
		this.outConnect();
		this.outTrigger();
	}
	onUnshift() {
		this.outDisconnect();
		this.group = this.unit.group;
		this.outKey = `group_[Channel${this.unit.unitNumber}]_enable`;
		this.output(0);
	}
	input(pressed) {
		if (this.isShifted) {
			if (pressed) this.unit.toggleMode();
			return;
		}
		if (this.unit.mode === "single") {
			if (pressed) {
				script.toggleControl(this.unit.effectGroup(1), "enabled");
				this.output(engine.getValue(this.unit.effectGroup(1), "enabled"));
			}
			return;
		}
		for (const effectNumber of [
			1,
			2,
			3
		]) engine.setValue(this.unit.effectGroup(effectNumber), "enabled", pressed);
		this.output(pressed);
	}
};
// src/components/s5-effect-unit.ts
var S5EffectUnit = class extends ComponentContainer {
	constructor(unitNumber, reports, io) {
		super(`[EffectRack1_EffectUnit${unitNumber}]`);
		this.unitNumber = unitNumber;
		this.mode = "group";
		this.focusedEffect = null;
		this.knobs = [];
		this.buttons = [];
		this.mixKnob = this.register(new Pot(this.group, "mix", reports, io.knobs[0].fade));
		this.mainButton = this.register(new PowerWindowButton(this, reports, io.buttons[0]));
		for (const effectNumber of [
			1,
			2,
			3
		]) {
			const effectGroup = this.effectGroup(effectNumber);
			this.knobs[effectNumber - 1] = this.register(new Pot(effectGroup, "meta", reports, io.knobs[effectNumber].fade));
			this.buttons[effectNumber - 1] = this.register(new FxButton(effectGroup, this, reports, effectNumber - 1, io.buttons));
		}
		const KnobTouch = InMixin(Component);
		const group = this.group;
		for (const knob of io.knobs) this.register(new KnobTouch({
			reports,
			io: knob.touch,
			input: (touched) => engine.setValue(group, "show_parameters", touched ? 1 : 0)
		}));
		this.triggerComponents();
	}
	effectGroup(effectNumber) {
		return `[EffectRack1_EffectUnit${this.unitNumber}_Effect${effectNumber}]`;
	}
	toggleMode() {
		this.mode = this.mode === "group" ? "single" : "group";
		this.knobs.forEach((knob, i) => {
			const effectNumber = i + 1;
			knob.group = this.mode === "single" ? this.effectGroup(1) : this.effectGroup(effectNumber);
			knob.inKey = this.mode === "single" ? `parameter${effectNumber}` : "meta";
			engine.softTakeover(knob.group, knob.inKey, true);
		});
		this.buttons.forEach((button, i) => button.applyMode(this.mode, i));
		this.mainButton.output(engine.getValue(this.effectGroup(1), "enabled"));
	}
	resetParameters() {
		for (const parameter of [
			1,
			2,
			3
		]) engine.setValue(this.effectGroup(1), `parameter${parameter}_set_default`, 1);
	}
	setFocusedEffect(effectIdx) {
		this.mainButton.indicator(effectIdx !== null);
		this.focusedEffect = effectIdx;
		engine.setValue(this.group, "show_parameters", this.focusedEffect !== null ? 1 : 0);
	}
};
// src/s5.ts
var S5 = class {
	constructor(io) {
		this.reports = new HIDReportHolder();
		if (engine.getValue("[App]", "num_decks") < 4) engine.setValue("[App]", "num_decks", 4);
		if (engine.getValue("[App]", "num_samplers") < 32) engine.setValue("[App]", "num_samplers", 32);
		this.fxUnitLeft = new S5EffectUnit(1, this.reports, io.fxUnitLeft);
		this.fxUnitRight = new S5EffectUnit(2, this.reports, io.fxUnitRight);
		this.mixer = new Mixer(this, io.mixer);
		this.deckLeft = new S5Deck([1, 3], this.fxUnitLeft, this.mixer, this.reports, io.deckLeft);
		this.deckRight = new S5Deck([2, 4], this.fxUnitRight, this.mixer, this.reports, io.deckRight);
		connectStartCues();
		this.deckLeft.otherSide = this.deckRight;
		this.deckRight.otherSide = this.deckLeft;
		const volumeMeter = [
			this.mixer.channelA.volumeMeter,
			this.mixer.channelC.volumeMeter,
			this.mixer.channelB.volumeMeter,
			this.mixer.channelD.volumeMeter
		];
		engine.makeConnection("[App]", "gui_tick_50ms_period_s", (_value) => {
			for (const meter of volumeMeter) meter.output();
			if (this.mixer.updateMainLevel() || volumeMeter.some((vm) => vm.isChange)) this.reports.out[130].send();
			this.deckLeft.updatePhase();
			this.deckRight.updatePhase();
		});
	}
	incomingData(data) {
		const reportId = data[0];
		if (isInputReportId(reportId)) this.reports.in[reportId].handleInput(data.buffer.slice(1));
		else console.warn(`Unsupported HID repord with ID ${reportId}. Contains: ${data}`);
	}
	init() {
		this.reports.in[2].handleInput(controller.getInputReport(2));
	}
	shutdown() {
		controller.sendOutputReport(128, (/* @__PURE__ */ new Uint8Array(104)).fill(0).buffer);
		controller.sendOutputReport(130, (/* @__PURE__ */ new Uint8Array(73)).fill(0).buffer);
		controller.sendOutputReport(129, (/* @__PURE__ */ new Uint8Array(104)).fill(0).buffer);
	}
};
// src/main.ts
var TraktorS5 = new S5(mapping);
console.info(" ---- Loaded Mixxx Traktor S5 Controller Mapping ---- ", TraktorS5);
