import { beforeEach } from 'vitest';
import { mapping } from '../../src/mapping';
import { S5 } from '../../src/s5';
import { settings } from '../../src/settings';

/**
 * Registers a beforeEach that initializes a fresh S5 instance with 4 decks and
 * 16 samplers. Call inside a describe block; use the returned getter in tests.
 */
export function setupS5(): { get: () => S5 } {
	let s5: S5;

	beforeEach(() => {
		globalThis.engine.setValue('[App]', 'num_decks', 4);
		globalThis.engine.setValue('[App]', 'num_samplers', 16);
		settings.useKeylockOnMaster = false;
		s5 = new S5(mapping);
	});

	return { get: () => s5 };
}

/** Injects a value directly into the mock engine state, bypassing write-only guards. */
export function setEngineValue(group: string, control: string, value: number) {
	globalThis.__mixxxTestState.values.set(`${group}::${control}`, value);
}

/** Returns all active connections for the given group+control pair. */
export function activeConnectionsFor(group: string, control: string) {
	return globalThis.__mixxxTestState.connections.filter(
		(c) => c.group === group && c.control === control
	);
}
