# S5 Screen Test Tool

`s5_screen_test` sends one RGB565 rectangle over USB bulk using the verified
S5/S8 display packet format (see `../protocol/notes.md`). Screens are 480x272.

## Build

```bash
make
```

Requires `libusb-1.0` development headers.

## Usage

```bash
S5_PRODUCT_ID=0x1420 S5_INTERFACE=4 S5_OUT_EP=0x03 ./s5_screen_test <screen_idx> <x> <y> <width> <height> <rgb565_hex>
```

Examples:

```bash
S5_PRODUCT_ID=0x1420 S5_INTERFACE=4 S5_OUT_EP=0x03 ./s5_screen_test 0 0 0 480 272 f800
S5_PRODUCT_ID=0x1420 S5_INTERFACE=4 S5_OUT_EP=0x03 ./s5_screen_test 1 40 40 120 80 07e0
```

Environment variables:

- `S5_VENDOR_ID`, default `0x17cc`
- `S5_PRODUCT_ID`, verified S5 value `0x1420`
- `S5_INTERFACE`, verified S5 value `4`
- `S5_OUT_EP`, verified S5 value `0x03`
- `S5_REPEAT`, optional: resend the frame n times, 100 ms apart, and print transfer times

Common RGB565 colors:

- `f800`: red
- `07e0`: green
- `001f`: blue
- `ffff`: white
- `0000`: black
