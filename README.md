# Mixxx Traktor S5 Mapping

`mixxx --controller-debug`

### Report-ID

1. Buttons
2. Fader
3.

### JS get type

```JS
function getType(value) {
  return Object.prototype.toString.call(value);
}
```

### Controller Outputs

#### Display Area

```JS
{
  settingsButton: [
    [1,0,0,0,0,0,0,0,64,0,0,0,0,0,0,0,0,0,94,251,0,0,0,0,200,235,0,0,0,0],
    [1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,33,248,0,0,0,0,139,232,0,0,0,0]
  ],
  displayButton1: [
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0, 90,178,0,0,0,0,155,162,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,121,189,0,0,0,0,170,180,0,0,0,0]
  ],
  displayButton2: [
    [1,0,0,0,0,0,0,0,128,0,0,0,0,0,0,0,0,0, 51,226,0,0,0,0,44,211,0,0,0,0],
    [1,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,232, 30,0,0,0,0,14, 15,0,0,0,0]
  ],
  performanceModeButton1: [
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,191,252,0,0,0,0, 46,237,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 64, 17,0,0,0,0,192,  1,0,0,0,0]
  ],
  viewButton: [
    [1,0,0,0,0,0,0,16,0,0,0,0,0,0,0,0,0,0,111,211,0,0,0,0,107,195,0,0,0,0],
    [1,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,  7,131,0,0,0,0,161,115,0,0,0,0]
  ],
  displayButton3: [
    [1,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,205,214,0,0,0,0,136,199,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,121, 68,0,0,0,0,146, 52,0,0,0,0]
  ],
  displayButton4: [
    [1,0,0,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0, 88,126,0,0,0,0, 56,110,0,0,0,0],
    [1,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,127,180,0,0,0,0,119,165,0,0,0,0]
  ],
  performanceModeButton2: [
    [1,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0, 34,102,0,0,0,0, 56,86,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,162, 63,0,0,0,0,133,47,0,0,0,0]
  ],
}
```

##### Report-ID 1 (IN)

```
Unknown[0x0..0xf]: 0x0
Unknown[0x0..0xf]: 0x0
Unknown[0x0..0xf]: 0x0
Unknown[0x0..0xf]: 0x0
Unknown[0x0..0xf]: 0x0
Unknown[0x0..0xf]: 0x0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown: 0
Unknown[0..65535]: 18734
Unknown[0..1023]: 0
Unknown[0..1023]: 0
Unknown[0..65535]: 15038
Unknown[0..1023]: 0
Unknown[0..1023]: 0

```

##### Report-ID 2 (IN)

- Used for fader data
- 38 Values of 16 bit (here 0-4095)
- 1 Number is 2 bytes (1. byte = substep (0-255), 2. byte = step (0-15))

```JS
[
  0, 0, // channel A: volume fader
  0, 0, // channel B: volume fader
  0, 0, // channel C: volume fader
  0, 0, // channel D: volume fader
  0, 0, // crossfader
  0, 0, // main gain
  0, 0, // booth gain
  0, 0, // cue mix
  0, 0, // cue vol
  0, 0, // channel A: gain
  0, 0, // channel A: hi eq
  0, 0, // channel A: mid eq
  0, 0, // channel A: low eq
  0, 0, // channel A: filter
  0, 0, // channel B: gain
  0, 0, // channel B: hi eq
  0, 0, // channel B: mid eq
  0, 0, // channel B: low eq
  0, 0, // channel B: filter
  0, 0, // channel C: gain
  0, 0, // channel C: hi eq
  0, 0, // channel C: mid eq
  0, 0, // channel C: low eq
  0, 0, // channel C: filter
  0, 0, // channel D: gain
  0, 0, // channel D: hi eq
  0, 0, // channel D: mid eq
  0, 0, // channel D: low eq
  0, 0, // channel D: filter
  0, 0, // left fx1
  0, 0, // left fx2
  0, 0, // left fx3
  0, 0, // left fx4
  0, 0, // right fx1
  0, 0, // right fx2
  0, 0, // right fx3
  0, 0, // right fx4
  0, 0, // UNKNOWN
  0, 0, // UNKNOWN
]
```

// TODO

#### Report-ID 128, 129 (OUT)

- Used to control the LED's of the left and right fx units, decks, transport buttons and touch bar
- Report-ID 128 for left side
- Report-ID 129 for right side
- length: 104 byte (832 bit)

```JS
[
  127, 0, 31, // left pad 1 (rgb color)
  127, 0, 31, // left pad 2 (rgb color)
  127, 0, 31, // left pad 3 (rgb color)
  127, 0, 31, // left pad 4 (rgb color)
  127, 0, 31, // left pad 5 (rgb color)
  127, 0, 31, // left pad 6 (rgb color)
  127, 0, 31, // left pad 7 (rgb color)
  127, 0, 31, // left pad 8 (rgb color)
  127, // left fx button 1
  127, // left fx button 2
  127, // left fx button 3
  127, // left fx button 4
  127, // left setting button
  127, // left display button 1
  127, // left display button 2
  127, // left performance button
  127, // left view button
  127, // left display button 3
  127, // left display button 4
  127, // left performance button 2
  127, // left back button
  31, // EMPTY
  14, 127, // left deck button (2 bit color (white/blue))
  127, // left loop LED
  0, // EMPTY
  20, 127, // left Hotcue button (2 bit color (white/blue))
  20, 127, // left freeze button (2 bit color (white/blue))
  20, 127, // left remix button (2 bit color (white/blue))
  127, // left flux button
  127, // left shift button
  127, 127, // left sync button (2 bit color (green/red))
  127, // left cue button
  127, // left play button
  96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, // left touch table 25 LED's (blue)
  84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, // left touch table 25 LED's (red)
]
```

Byte 0-23: 8 Pad-Buttons RGB of 3 byte

Brightness from 0 to 127 ( --> 7 bit?)

Pad buttons color:
Byte 1 (0-127): red
Byte 2 (0-127): green
Byte 3 (0-127): blue

# Report-ID 130 (OUT)

- Used to control the LEDS of the mixer
- length: 73 byte (584 bit)

```JS
[
  127, // channel C: fx assign left button
  127, // channel C: fx assign right button
  127, // channel A: fx assign left button
  127, // channel A: fx assign right button
  127, // snap button
  127, // quantize button
  127, // channel B: fx assign left button
  127, // channel B: fx assign right button
  127, // channel D: fx assign left button
  127, // channel D: fx assign right button
  127, // channel C: filter button
  127, // channel A: filter button
  127, // channel B: filter button
  127, // channel D: filter button
  127, // channel C: cue button
  127, // channel A: cue button
  0, // UNKNOWN: maybe AUX?
  127, // channel B: cue button
  127, // channel D: cue button
  127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, // channel A: 11 LED's loudness meter
  127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, // channel C: 11 LED's loudness meter
  127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, // channel B: 11 LED's loudness meter
  127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, // channel D: 11 LED's loudness meter
  127, // main gain left: loudness meter top LED
  127, // main gain right: Loudness meter top LED
  0, 0, 0, 0, 0, 0, 0, 0, // last 8 byte UNKNOWN
]
```

#### Displays

- prop. Bulk/Isochronous endpoint
- layout with QML
