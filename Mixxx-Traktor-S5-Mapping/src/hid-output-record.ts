export class HIDOutputReport {
  reportId: number;
  data: Uint8Array;

  constructor(reportId: number, length: number) {
    this.reportId = reportId;
    this.data = new Uint8Array(length).fill(0);
  }
  send() {
    console.log('CONTROLLER LEL: ', controller);
    controller.sendOutputReport(this.reportId, this.data.buffer as ArrayBuffer);
  }
}
