import { vi } from 'vitest';

type StoredValues = Map<string, number>;

function keyFor(group: string, control: string) {
	return `${group}::${control}`;
}

export interface MockConnection {
	disconnect: ReturnType<typeof vi.fn>;
	trigger: ReturnType<typeof vi.fn>;
	group: string;
	control: string;
	callback: (value: number) => void;
}

export interface MixxxTestState {
	values: StoredValues;
	connections: MockConnection[];
	outputReports: Array<{ reportId: number; data: Uint8Array }>;
	inputReports: Map<number, ArrayBuffer>;
	timers: Map<number, () => void>;
	nextTimerId: number;
}

declare global {
	var __mixxxTestState: MixxxTestState;
}

export function createMixxxTestState(): MixxxTestState {
	return {
		values: new Map(),
		connections: [],
		outputReports: [],
		inputReports: new Map(),
		timers: new Map(),
		nextTimerId: 1,
	};
}

export function installMixxxGlobals() {
	const state = createMixxxTestState();
	globalThis.__mixxxTestState = state;
	const scope = globalThis as typeof globalThis & {
		engine: any;
		controller: any;
		script: any;
		ColorMapper: any;
	};

	scope.engine = {
		getValue: vi.fn((group: string, control: string) => {
			return state.values.get(keyFor(group, control)) ?? 0;
		}),
		setValue: vi.fn((group: string, control: string, value: number) => {
			state.values.set(keyFor(group, control), value);
		}),
		getSetting: vi.fn(() => 0),
		makeConnection: vi.fn(
			(group: string, control: string, callback: (value: number) => void) => {
				const connection: MockConnection = {
					group,
					control,
					callback,
					disconnect: vi.fn(() => {
						state.connections = state.connections.filter(
							(candidate) => candidate !== connection
						);
					}),
					trigger: vi.fn(() => {
						callback(state.values.get(keyFor(group, control)) ?? 0);
					}),
				};
				state.connections.push(connection);
				return connection;
			}
		),
		beginTimer: vi.fn((_: number, callback: () => void) => {
			const timerId = state.nextTimerId++;
			state.timers.set(timerId, callback);
			return timerId;
		}),
		stopTimer: vi.fn((timerId: number) => {
			state.timers.delete(timerId);
		}),
		softTakeover: vi.fn(),
		scratchEnable: vi.fn(),
		scratchDisable: vi.fn(),
		scratchTick: vi.fn(),
		isScratching: vi.fn(() => false),
	};

	scope.controller = {
		sendOutputReport: vi.fn((reportId: number, data: ArrayBuffer) => {
			state.outputReports.push({ reportId, data: new Uint8Array(data) });
		}),
		getInputReport: vi.fn((reportId: number) => {
			return state.inputReports.get(reportId) ?? new ArrayBuffer(0);
		}),
		send: vi.fn(),
		sendFeatureReport: vi.fn(),
		getFeatureReport: vi.fn(),
	};

	scope.script = {
		toggleControl: vi.fn((group: string, control: string) => {
			const current = state.values.get(keyFor(group, control)) ?? 0;
			state.values.set(keyFor(group, control), current ? 0 : 1);
		}),
	};

	scope.ColorMapper = class {
		mapping: Record<number, number>;

		constructor(mapping: Record<number, number>) {
			this.mapping = mapping;
		}
	};

	return state;
}

export function resetMixxxGlobals() {
	return installMixxxGlobals();
}
