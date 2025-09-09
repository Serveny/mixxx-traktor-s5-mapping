export class HidReport1 {
  // 1. usage {ff01:3}: 6 values 4 bits each (3 bytes)
  encoders: number[] = [];

  // 2. usage {ff01:2}: 112 single bits (14 bytes)
  pushButtons: boolean[] = [];

  // 4. usage {ff01:4}: 2 values of 16 bits each (4 bytes)
  leftTouchStrip: number[];

  // 6. usage {ff01:41}: 2 values of 16 bits each (4 bytes)
  rightTouchStrip: number[];

  constructor(signal: Uint8Array) {
    const payload = new Uint8Array(signal.slice(1));
    const dataView = new DataView(payload.buffer);
    // encoders
    for (let i = 0; i < 3; i++) {
      const byte = dataView.getUint8(i);
      this.encoders.push(byte & 0x0f); // Untere 4 Bits
      this.encoders.push(byte >> 4); // Obere 4 Bits
    }

    // push buttonns
    for (let i = 3; i < 17; i++) {
      const byte = dataView.getUint8(i);
      for (let j = 0; j < 8; j++) {
        this.pushButtons.push((byte & (1 << j)) !== 0);
      }
    }

    // 3. unknown: maybe timestamp
    // vendor_ff01_4_a = dataView.getUint16(17, true);

    // 4. Usage {ff01:4}: 2 Werte zu je 16 Bits (4 Bytes)
    this.leftTouchStrip = [
      dataView.getUint16(19, true),
      dataView.getUint16(21, true),
    ];

    // 5. unknown: maybe timestamp
    // vendor_ff01_32 = dataView.getUint16(23, true);

    // 6. Usage {ff01:41}: 2 Werte zu je 16 Bits (4 Bytes)
    this.rightTouchStrip = [
      dataView.getUint16(25, true),
      dataView.getUint16(27, true),
    ];
  }
}
