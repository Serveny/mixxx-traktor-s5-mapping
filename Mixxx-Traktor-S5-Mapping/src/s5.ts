export class S5 {
  getActiveButtons(signal: Uint8Array): number[] {
    const dataView = new DataView(signal.buffer);
    const activeButtonIds = [];
    let id = 0;
    for (let i = 3; i < 17; i++) {
      const byte = dataView.getUint8(i);
      for (let j = 0; j < 8; j++) {
        id++;
        if ((byte & (1 << j)) !== 0) activeButtonIds.push(id);
      }
    }
    return activeButtonIds;
  }

  incomingData(data: Uint8Array) {
    const reportId = data[0];
    if (reportId === 1) {
      console.log(this.getActiveButtons(data));
    } else if (reportId === 2) {
      // TODO
    } else {
      console.warn(
        `Unsupported HID repord with ID ${reportId}. Contains: ${data}`
      );
    }
  }
  init() {}
  shutdown() {}
}
