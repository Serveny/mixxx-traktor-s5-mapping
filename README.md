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

##### Report-ID 1

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

#### Controller Inputs

Report-ID 128

[128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

FX Button 2: byte 25

Brightness from 0 to 127 ( --> 7 bit?)

#### Displays

- prop. Bulk/Isochronous endpoint
- layout with QML
