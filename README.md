# Mixxx Traktor S5 Mapping

Very **Work in progress** Traktor S5 mapping for the Mixxx DJ software in TypeScript. At the moment only

## Current status

- ✅ Reverse engineered Traktor S5 HID mapping
- ✅ Created basic TypeScript code foundation & types
- ✅ Working components: Loop encoder, crossfader, cue button, play button

## How to use

1. Install dev dependencies: `npm install`
2. Check if the files referenced to in tsconfig.json exits or change paths to your mixxx files folder
3. Add symlink from `../attic/mappings/controllers/`to your mixxx controllers folder (f.e: `/home/[user]/software/mixxx/res/controllers`)
4. Build JS: `vite build` (The buildscript will copy the builded JS into the controllers folder)

Mixxx debug command on linux: `mixxx --controller-debug`

## HID IN/OUT-PUTS

Reverse engineered HID mapping. Some bits/byte in the reports are empty between (or I didn't found out the usage).

### Report-ID 1 (IN)

- Used for button and knob touch data
- Size: 30 byte (240 bit)

| Byte | Bit | Length (Bit) | Element                                               |
| ---: | --: | -----------: | :---------------------------------------------------- |
|    0 |   0 |            4 | deckLeft.browseControls.browse.**fade**               |
|    0 |   4 |            4 | deckLeft.loop.**fade**                                |
|    1 |   0 |            4 | deckRight.browseControls.browse.**fade**              |
|    1 |   4 |            4 | deckRight.loop.**fade**                               |
|    2 |   0 |            4 | mixer.**tempo**                                       |
|    3 |   0 |            1 | fxUnitLeft.knobs[3].**touch**                         |
|    3 |   1 |            1 | fxUnitLeft.knobs[2].**touch**                         |
|    3 |   2 |            1 | fxUnitLeft.knobs[1].**touch**                         |
|    3 |   3 |            1 | fxUnitLeft.knobs[0].**touch**                         |
|    3 |   4 |            1 | fxUnitRight.knobs[3].**touch**                        |
|    3 |   5 |            1 | fxUnitRight.knobs[2].**touch**                        |
|    3 |   6 |            1 | fxUnitRight.knobs[1].**touch**                        |
|    3 |   7 |            1 | fxUnitRight.knobs[0].**touch**                        |
|    4 |   0 |            1 | mixer.**snap**                                        |
|    4 |   1 |            1 | mixer.channelA.**fxUnitAssignLeft**                   |
|    4 |   2 |            1 | mixer.channelC.**fxUnitAssignRight**                  |
|    4 |   3 |            1 | mixer.channelC.**fxUnitAssignLeft**                   |
|    4 |   4 |            1 | mixer.channelC.**cue**                                |
|    4 |   5 |            1 | mixer.channelC.**filterBtn**                          |
|    4 |   6 |            1 | mixer.channelA.**fxUnitAssignRight**                  |
|    4 |   7 |            1 | mixer.**quantize**                                    |
|    5 |   0 |            1 | mixer.channelA.**cue**                                |
|    5 |   1 |            1 | mixer.channelA.**filterBtn**                          |
|    5 |   2 |            1 | fxUnitLeft.**buttons[0]**                             |
|    5 |   3 |            1 | fxUnitLeft.**buttons[2]**                             |
|    5 |   4 |            1 | fxUnitLeft.**buttons[3]**                             |
|    5 |   5 |            1 | fxUnitLeft.**buttons[1]**                             |
|    6 |   0 |            1 | deckLeft.browseControls.**back**                      |
|    6 |   1 |            1 | deckLeft.browseControls.browse.**press**              |
|    6 |   2 |            1 | deckLeft.displayAreaAndControls.**performanceMode2**  |
|    6 |   3 |            1 | deckLeft.displayAreaAndControls.**display3**          |
|    6 |   4 |            1 | deckLeft.displayAreaAndControls.**view**              |
|    6 |   5 |            1 | deckLeft.displayAreaAndControls.**display4**          |
|    6 |   6 |            1 | deckLeft.loop.**press**                               |
|    6 |   7 |            1 | deckLeft.**deck**                                     |
|    7 |   0 |            1 | deckLeft.displayAreaAndControls.**performanceMode1**  |
|    7 |   1 |            1 | deckLeft.displayAreaAndControls.**display1**          |
|    7 |   6 |            1 | deckLeft.displayAreaAndControls.**settings**          |
|    7 |   7 |            1 | deckLeft.displayAreaAndControls.**display2**          |
|    8 |   0 |            1 | deckLeft.**pads[7]**                                  |
|    8 |   1 |            1 | deckLeft.**pads[5]**                                  |
|    8 |   2 |            1 | deckLeft.transportControls.**play**                   |
|    8 |   3 |            1 | deckLeft.transportControls.**sync**                   |
|    8 |   4 |            1 | deckLeft.transportControls.**shift**                  |
|    8 |   5 |            1 | deckLeft.transportControls.**cue**                    |
|    8 |   6 |            1 | deckLeft.**pads[4]**                                  |
|    8 |   7 |            1 | deckLeft.**pads[6]**                                  |
|    9 |   0 |            1 | deckLeft.**flux**                                     |
|    9 |   1 |            1 | deckLeft.modeSelect.**freeze**                        |
|    9 |   2 |            1 | deckLeft.**pads[3]**                                  |
|    9 |   3 |            1 | deckLeft.**pads[1]**                                  |
|    9 |   4 |            1 | deckLeft.**pads[0]**                                  |
|    9 |   5 |            1 | deckLeft.**pads[2]**                                  |
|    9 |   6 |            1 | deckLeft.modeSelect.**hotcue**                        |
|    9 |   7 |            1 | deckLeft.modeSelect.**remix**                         |
|   10 |   2 |            1 | mixer.channelB.**filterBtn**                          |
|   10 |   3 |            1 | mixer.**auxToggle**                                   |
|   10 |   4 |            1 | mixer.channelD.**cue**                                |
|   10 |   5 |            1 | mixer.channelB.**cue**                                |
|   10 |   6 |            1 | mixer.channelD.**filterBtn**                          |
|   11 |   0 |            1 | mixer.**aux**                                         |
|   11 |   1 |            1 | deckRight.transportControls.**sync**                  |
|   11 |   2 |            1 | deckRight.transportControls.**cue**                   |
|   11 |   4 |            1 | deckRight.transportControls.**shift**                 |
|   11 |   5 |            1 | deckRight.transportControls.**play**                  |
|   12 |   0 |            1 | mixer.channelB.**fxUnitAssignLeft**                   |
|   12 |   1 |            1 | mixer.channelB.**fxUnitAssignRight**                  |
|   12 |   2 |            1 | mixer.channelD.**fxUnitAssignLeft**                   |
|   12 |   3 |            1 | mixer.channelD.**fxUnitAssignRight**                  |
|   12 |   4 |            1 | deckRight.displayAreaAndControls.**settings**         |
|   12 |   5 |            1 | deckRight.displayAreaAndControls.**display1**         |
|   12 |   6 |            1 | deckRight.displayAreaAndControls.**display2**         |
|   12 |   7 |            1 | deckRight.displayAreaAndControls.**performanceMode1** |
|   13 |   0 |            1 | fxUnitRight.**buttons[0]**                            |
|   13 |   1 |            1 | fxUnitRight.**buttons[1]**                            |
|   13 |   2 |            1 | fxUnitRight.**buttons[2]**                            |
|   13 |   3 |            1 | fxUnitRight.**buttons[3]**                            |
|   13 |   4 |            1 | deckLeft.browseControls.browse.**touch**              |
|   13 |   5 |            1 | deckLeft.loop.**touch**                               |
|   13 |   6 |            1 | deckRight.browseControls.browse.**touch**             |
|   13 |   7 |            1 | deckRight.loop.**touch**                              |
|   14 |   0 |            1 | deckRight.browseControls.browse.**press**             |
|   14 |   1 |            1 | deckRight.browseControls.**back**                     |
|   14 |   2 |            1 | deckRight.**deck**                                    |
|   14 |   3 |            1 | deckRight.loop.**press**                              |
|   15 |   0 |            1 | deckRight.**flux**                                    |
|   15 |   1 |            1 | deckRight.**pads[2]**                                 |
|   15 |   2 |            1 | deckRight.**pads[5]**                                 |
|   15 |   3 |            1 | deckRight.**pads[0]**                                 |
|   15 |   4 |            1 | deckRight.**pads[4]**                                 |
|   15 |   5 |            1 | deckRight.**pads[1]**                                 |
|   15 |   6 |            1 | deckRight.**pads[6]**                                 |
|   15 |   7 |            1 | deckRight.modeSelect.**remix**                        |
|   16 |   0 |            1 | deckRight.modeSelect.**hotcue**                       |
|   16 |   1 |            1 | deckRight.displayAreaAndControls.**performanceMode2** |
|   16 |   2 |            1 | deckRight.displayAreaAndControls.**display3**         |
|   16 |   3 |            1 | deckRight.**pads[7]**                                 |
|   16 |   4 |            1 | deckRight.**pads[3]**                                 |
|   16 |   5 |            1 | deckRight.displayAreaAndControls.**view**             |
|   16 |   6 |            1 | deckRight.displayAreaAndControls.**display4**         |
|   16 |   7 |            1 | deckRight.modeSelect.**freeze**                       |
|   19 |   0 |           16 | deckLeft.touchStrip.**touch**                         |
|   25 |   0 |           16 | deckRight.touchStrip.**touch**                        |

### Report-ID 2 (IN)

- Used for fader data
- Size: 79 byte (632 bit)
- 38 Values of 16 bit (here 0-4095)
- 1 Number is 2 bytes (1. byte = substep (0-255), 2. byte = step (0-15))

| Byte | Bit | Length (Bit) | Element                       |
| ---: | --: | -----------: | :---------------------------- |
|    0 |   0 |           16 | mixer.channelA.**volume**     |
|    2 |   0 |           16 | mixer.channelB.**volume**     |
|    4 |   0 |           16 | mixer.channelC.**volume**     |
|    6 |   0 |           16 | mixer.channelD.**volume**     |
|    8 |   0 |           16 | mixer.**cross**               |
|   10 |   0 |           16 | mixer.**mainGain**            |
|   12 |   0 |           16 | mixer.**boothGain**           |
|   14 |   0 |           16 | mixer.**cueMix**              |
|   16 |   0 |           16 | mixer.**cueGain**             |
|   18 |   0 |           16 | mixer.channelA.**gain**       |
|   20 |   0 |           16 | mixer.channelA.**eqHigh**     |
|   22 |   0 |           16 | mixer.channelA.**eqMid**      |
|   24 |   0 |           16 | mixer.channelA.**eqLow**      |
|   26 |   0 |           16 | mixer.channelA.**filter**     |
|   28 |   0 |           16 | mixer.channelB.**gain**       |
|   30 |   0 |           16 | mixer.channelB.**eqHigh**     |
|   32 |   0 |           16 | mixer.channelB.**eqMid**      |
|   34 |   0 |           16 | mixer.channelB.**eqLow**      |
|   36 |   0 |           16 | mixer.channelB.**filter**     |
|   38 |   0 |           16 | mixer.channelC.**gain**       |
|   40 |   0 |           16 | mixer.channelC.**eqHigh**     |
|   42 |   0 |           16 | mixer.channelC.**eqMid**      |
|   44 |   0 |           16 | mixer.channelC.**eqLow**      |
|   46 |   0 |           16 | mixer.channelC.**filter**     |
|   48 |   0 |           16 | mixer.channelD.**gain**       |
|   50 |   0 |           16 | mixer.channelD.**eqHigh**     |
|   52 |   0 |           16 | mixer.channelD.**eqMid**      |
|   54 |   0 |           16 | mixer.channelD.**eqLow**      |
|   56 |   0 |           16 | mixer.channelD.**filter**     |
|   58 |   0 |           16 | fxUnitLeft.knobs[0].**fade**  |
|   60 |   0 |           16 | fxUnitLeft.knobs[1].**fade**  |
|   62 |   0 |           16 | fxUnitLeft.knobs[2].**fade**  |
|   64 |   0 |           16 | fxUnitLeft.knobs[3].**fade**  |
|   66 |   0 |           16 | fxUnitRight.knobs[0].**fade** |
|   68 |   0 |           16 | fxUnitRight.knobs[1].**fade** |
|   70 |   0 |           16 | fxUnitRight.knobs[2].**fade** |
|   72 |   0 |           16 | fxUnitRight.knobs[3].**fade** |

### Report-ID 128, 129 (OUT)

- Used to control the LED's of the left and right fx units, decks, transport buttons and touch bar
- Size: 104 byte (832 bit)
- Report-ID 128 for left side
- Report-ID 129 for right side

| Byte | Bit | Length (Bit) | Element                                              |
| ---: | --: | -----------: | :--------------------------------------------------- |
|    0 |   0 |           24 | deckLeft.**pads[0]**                                 |
|    3 |   0 |           24 | deckLeft.**pads[1]**                                 |
|    6 |   0 |           24 | deckLeft.**pads[2]**                                 |
|    9 |   0 |           24 | deckLeft.**pads[3]**                                 |
|   12 |   0 |           24 | deckLeft.**pads[4]**                                 |
|   15 |   0 |           24 | deckLeft.**pads[5]**                                 |
|   18 |   0 |           24 | deckLeft.**pads[6]**                                 |
|   21 |   0 |           24 | deckLeft.**pads[7]**                                 |
|   24 |   0 |            8 | fxUnitLeft.**buttons[0]**                            |
|   25 |   0 |            8 | fxUnitLeft.**buttons[1]**                            |
|   26 |   0 |            8 | fxUnitLeft.**buttons[2]**                            |
|   27 |   0 |            8 | fxUnitLeft.**buttons[3]**                            |
|   28 |   0 |            8 | deckLeft.displayAreaAndControls.**settings**         |
|   29 |   0 |            8 | deckLeft.displayAreaAndControls.**display1**         |
|   30 |   0 |            8 | deckLeft.displayAreaAndControls.**display2**         |
|   31 |   0 |            8 | deckLeft.displayAreaAndControls.**performanceMode1** |
|   32 |   0 |            8 | deckLeft.displayAreaAndControls.**view**             |
|   33 |   0 |            8 | deckLeft.displayAreaAndControls.**display3**         |
|   34 |   0 |            8 | deckLeft.displayAreaAndControls.**display4**         |
|   35 |   0 |            8 | deckLeft.displayAreaAndControls.**performanceMode2** |
|   36 |   0 |            8 | deckLeft.browseControls.**back**                     |
|   38 |   0 |           16 | deckLeft.**deck**                                    |
|   42 |   0 |           16 | deckLeft.modeSelect.**hotcue**                       |
|   44 |   0 |           16 | deckLeft.modeSelect.**freeze**                       |
|   46 |   0 |           16 | deckLeft.modeSelect.**remix**                        |
|   48 |   0 |            8 | deckLeft.**flux**                                    |
|   49 |   0 |            8 | deckLeft.transportControls.**shift**                 |
|   50 |   0 |           16 | deckLeft.transportControls.**sync**                  |
|   52 |   0 |            8 | deckLeft.transportControls.**cue**                   |
|   53 |   0 |            8 | deckLeft.transportControls.**play**                  |
|   54 |   0 |          400 | deckLeft.**phase**                                   |

Byte 0-23: 8 Pad-Buttons RGB of 3 byte

Brightness/color value from 0 to 127

Pad buttons color:
Byte 1 (0-127): red
Byte 2 (0-127): green
Byte 3 (0-127): blue

### Report-ID 130 (OUT)

- Used to control the LEDS of the mixer
- Size: 73 byte (584 bit)

| Byte | Bit | Length (Bit) | Element                              |
| ---: | --: | -----------: | :----------------------------------- |
|    0 |   0 |            8 | mixer.channelC.**fxUnitAssignLeft**  |
|    1 |   0 |            8 | mixer.channelC.**fxUnitAssignRight** |
|    2 |   0 |            8 | mixer.channelA.**fxUnitAssignLeft**  |
|    3 |   0 |            8 | mixer.channelA.**fxUnitAssignRight** |
|    4 |   0 |            8 | mixer.**snap**                       |
|    5 |   0 |            8 | mixer.**quantize**                   |
|    6 |   0 |            8 | mixer.channelB.**fxUnitAssignLeft**  |
|    7 |   0 |            8 | mixer.channelB.**fxUnitAssignRight** |
|    8 |   0 |            8 | mixer.channelD.**fxUnitAssignLeft**  |
|    9 |   0 |            8 | mixer.channelD.**fxUnitAssignRight** |
|   10 |   0 |            8 | mixer.channelC.**filterBtn**         |
|   11 |   0 |            8 | mixer.channelA.**filterBtn**         |
|   12 |   0 |            8 | mixer.channelB.**filterBtn**         |
|   13 |   0 |            8 | mixer.channelD.**filterBtn**         |
|   14 |   0 |            8 | mixer.channelC.**cue**               |
|   15 |   0 |            8 | mixer.channelA.**cue**               |
|   16 |   0 |            8 | mixer.**aux**                        |
|   16 |   0 |            8 | mixer.**auxToggle**                  |
|   17 |   0 |            8 | mixer.channelB.**cue**               |
|   18 |   0 |            8 | mixer.channelD.**cue**               |
|   19 |   0 |           88 | mixer.channelC.**volumeLevel**       |
|   30 |   0 |           88 | mixer.channelA.**volumeLevel**       |
|   41 |   0 |           88 | mixer.channelB.**volumeLevel**       |
|   52 |   0 |           88 | mixer.channelD.**volumeLevel**       |

## Displays

- prop. Bulk/Isochronous endpoint
- layout with QML
