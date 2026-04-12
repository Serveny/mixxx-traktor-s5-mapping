import { describe, expect, test } from 'vitest';
import coverage from './manual-coverage.json';

describe('manual coverage matrix', () => {
	test('contains the required metadata for each feature row', () => {
		expect(coverage.length).toBeGreaterThan(0);

		for (const row of coverage) {
			expect(row.manualSection).toBeTruthy();
			expect(row.feature).toBeTruthy();
			expect(row.component).toBeTruthy();
			expect(row.automationLevel).toBeTruthy();
			expect(row.status).toBeTruthy();
		}
	});
});
