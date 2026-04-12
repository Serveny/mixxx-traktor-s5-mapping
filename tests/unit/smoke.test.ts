import { describe, expect, test } from 'vitest';

describe('test environment', () => {
	test('provides Mixxx globals', () => {
		expect(globalThis.engine).toBeDefined();
		expect(globalThis.controller).toBeDefined();
		expect(globalThis.script).toBeDefined();
	});
});
