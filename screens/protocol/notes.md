# S5 Display Protocol Notes

Verified on hardware (2026-10-29) with `tools/s5_screen_test` and Mixxx.

## USB

```text
Bus 003 Device 014: ID 17cc:1420 Native Instruments Traktor Kontrol S5
Interface 3: HID, interrupt IN 0x83, interrupt OUT 0x02
Interface 4: vendor-specific "Traktor Kontrol S5 BD", bulk OUT 0x03, max packet 512
Interface 5: DFU
```

## Frame format

The S5 uses the S8/D2 display protocol, **not** the S4 MK3 one
(see https://github.com/gusgustavodj/kontrol-s8-protocol).

- 2 screens, 480x272, RGB565 big-endian (`f800` = red), screen index `0` left, `1` right.
- The S4 MK3 format (320x240, `0x21` header, raw pixels) only produces grey noise.

```text
header (16 bytes):
  84 00 <screen> 60 00 00 00 00  <x:be16> <y:be16> <width:be16> <height:be16>
commands (4 bytes each):
  00 <n:be24> + n pixel pairs (4n bytes)   literal pixels
  01 <n:be24> <pixel> <pixel>               repeat one pixel pair n times
  02 <n:be24>                               skip n pixel pairs
  03 00 00 00                               blit
  40 00 <screen> 00                         end
```

Several complete packets can be concatenated in one bulk transfer.
The first transfer after claiming the interface takes ~1 s, then a full frame takes ~16 ms.

## Mixxx notes

- Mixxx's GLES build (`QGLES2=ON`) swapped R/B whenever `endian` != native and ignored
  `reversed`. Patched locally in `../mixxx/src/controllers/rendering/controllerrenderingengine.cpp`
  to swap only when `reversed="true"`; the preset uses `reversed="false" endian="big"`.
