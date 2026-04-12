import type {
	BytePosIn,
	HidInReportField,
	InputReportId,
	OutputReportId,
} from './types/mapping';

/*
 * HID report parsing library
 */
export class HIDInputReport {
	reportId: InputReportId;
	fields: HidInReportField[];
	constructor(reportId: InputReportId) {
		this.reportId = reportId;
		this.fields = [];
	}

	registerCallback(
		callback: (value: number) => void,
		io: BytePosIn,
		defaultOldData: number | undefined = undefined
	): ScriptConnection {
		if (typeof callback !== 'function') {
			throw Error('callback must be a function');
		}

		if (!Number.isInteger(io.inByte)) {
			throw Error('inByte must be 0 or a positive integer');
		}
		if (!Number.isInteger(io.inBit) || io.inBit < 0) {
			throw Error('inBit must be 0 or a positive integer');
		}
		if (
			!Number.isInteger(io.inBit) ||
			io.inLengthBit < 1 ||
			io.inLengthBit > 32
		) {
			throw Error('bitLength must be an integer between 1 and 32');
		}

		const field: HidInReportField = {
			callback: callback,
			io,
			oldData: defaultOldData,
		};
		this.fields.push(field);

		return {
			disconnect: () => {
				this.fields = this.fields.filter((element) => {
					return element !== field;
				});
			},
			trigger: () => {},
		} as ScriptConnection;
	}

	handleInput(reportData: ArrayBufferLike) {
		const view = new DataView(reportData);

		for (const field of this.fields) {
			const numBytes = Math.ceil(field.io.inLengthBit / 8);
			let data;

			// Little endianness is specified by the HID standard.
			// The HID standard allows signed integers as well, but I am not aware
			// of any HID DJ controllers which use signed integers.
			if (numBytes === 1) {
				data = view.getUint8(field.io.inByte);
			} else if (numBytes === 2) {
				data = view.getUint16(field.io.inByte, true);
			} else if (numBytes === 3) {
				data = view.getUint32(field.io.inByte, true) >>> 8;
			} else if (numBytes === 4) {
				data = view.getUint32(field.io.inByte, true);
			} else {
				throw Error('field bitLength must be between 1 and 32');
			}

			// The >>> 0 is required for 32 bit unsigned ints to not magically turn negative
			// because all Numbers are really 32 bit signed floats. Because JavaScript.
			data = ((data >> field.io.inBit) & (2 ** field.io.inLengthBit - 1)) >>> 0;

			if (field.oldData !== data) {
				field.callback(data);
				field.oldData = data;
			}
		}
	}
}

export class HIDOutputReport {
	reportId: OutputReportId;
	data: Uint8Array;

	constructor(reportId: OutputReportId, length: number) {
		this.reportId = reportId;
		this.data = new Uint8Array(length).fill(0);
	}
	send() {
		controller.sendOutputReport(this.reportId, this.data.buffer as ArrayBuffer);
	}
}

export function isInputReportId(reportId: number): reportId is InputReportId {
	return reportId === 1 || reportId === 2;
}

export class HIDReportHolder {
	in: Record<InputReportId, HIDInputReport>;
	out: Record<OutputReportId, HIDOutputReport>;

	constructor() {
		this.in = {
			1: new HIDInputReport(1), // Buttons, encoder, touch strip
			2: new HIDInputReport(2), // Knobs, Fader
		};

		this.out = {
			128: new HIDOutputReport(128, 104), // LED's left deck
			129: new HIDOutputReport(129, 104), // LED's right deck
			130: new HIDOutputReport(130, 73), // LED's mixer
		};
	}
}

export class HIDReportHodler extends HIDReportHolder {}
