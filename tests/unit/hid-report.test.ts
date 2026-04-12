import { describe, expect, test, vi } from 'vitest';
import { HIDInputReport, HIDOutputReport } from '../../src/hid-report';

describe('HIDInputReport', () => {
	test('extracts a single-bit field from input data', () => {
		const report = new HIDInputReport(1);
		const callback = vi.fn();

		report.registerCallback(callback, {
			inReportId: 1,
			inByte: 0,
			inBit: 3,
			inLengthBit: 1,
		});

		// Byte 0 = 0b00001000 = 8 => bit 3 is 1
		const buffer = new ArrayBuffer(4);
		new DataView(buffer).setUint8(0, 0b00001000);
		report.handleInput(buffer);

		expect(callback).toHaveBeenCalledWith(1);
	});

	test('extracts a multi-bit field across byte boundary', () => {
		const report = new HIDInputReport(1);
		const callback = vi.fn();

		report.registerCallback(callback, {
			inReportId: 1,
			inByte: 1,
			inBit: 0,
			inLengthBit: 16,
		});

		// Little-endian 16-bit at byte 1: 0x0200 = 512
		const buffer = new ArrayBuffer(4);
		const view = new DataView(buffer);
		view.setUint16(1, 512, true);
		report.handleInput(buffer);

		expect(callback).toHaveBeenCalledWith(512);
	});

	test('only fires callback when value changes', () => {
		const report = new HIDInputReport(1);
		const callback = vi.fn();

		report.registerCallback(callback, {
			inReportId: 1,
			inByte: 0,
			inBit: 0,
			inLengthBit: 8,
		});

		const buffer = new ArrayBuffer(4);
		new DataView(buffer).setUint8(0, 42);

		report.handleInput(buffer);
		report.handleInput(buffer);

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(42);
	});

	test('fires callback again when value changes back', () => {
		const report = new HIDInputReport(1);
		const callback = vi.fn();

		report.registerCallback(callback, {
			inReportId: 1,
			inByte: 0,
			inBit: 0,
			inLengthBit: 8,
		});

		const buf1 = new ArrayBuffer(4);
		new DataView(buf1).setUint8(0, 100);
		report.handleInput(buf1);

		const buf2 = new ArrayBuffer(4);
		new DataView(buf2).setUint8(0, 0);
		report.handleInput(buf2);

		expect(callback).toHaveBeenCalledTimes(2);
		expect(callback).toHaveBeenNthCalledWith(1, 100);
		expect(callback).toHaveBeenNthCalledWith(2, 0);
	});

	test('disconnect removes a callback', () => {
		const report = new HIDInputReport(1);
		const callback = vi.fn();

		const connection = report.registerCallback(callback, {
			inReportId: 1,
			inByte: 0,
			inBit: 0,
			inLengthBit: 8,
		});

		connection.disconnect();

		const buffer = new ArrayBuffer(4);
		new DataView(buffer).setUint8(0, 99);
		report.handleInput(buffer);

		expect(callback).not.toHaveBeenCalled();
	});

	test('handles defaultOldData to skip initial identical value', () => {
		const report = new HIDInputReport(1);
		const callback = vi.fn();

		// Set default old data to 42, so if first input is 42 it should not fire
		report.registerCallback(
			callback,
			{ inReportId: 1, inByte: 0, inBit: 0, inLengthBit: 8 },
			42
		);

		const buffer = new ArrayBuffer(4);
		new DataView(buffer).setUint8(0, 42);
		report.handleInput(buffer);

		expect(callback).not.toHaveBeenCalled();

		// Now change to different value
		new DataView(buffer).setUint8(0, 43);
		report.handleInput(buffer);

		expect(callback).toHaveBeenCalledWith(43);
	});
});

describe('HIDOutputReport', () => {
	test('initializes data buffer with zeros', () => {
		const report = new HIDOutputReport(128, 10);

		expect(report.data.length).toBe(10);
		expect(report.data.every((b) => b === 0)).toBe(true);
	});

	test('send transmits data via controller.sendOutputReport', () => {
		const report = new HIDOutputReport(128, 4);
		report.data[0] = 127;
		report.data[1] = 64;

		report.send();

		expect(controller.sendOutputReport).toHaveBeenCalledWith(
			128,
			report.data.buffer
		);
	});
});
