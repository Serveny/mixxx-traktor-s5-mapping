import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';
import { evaluateAudioManifest, type AudioManifest } from './audio-preflight';

describe('scenario audio assets', () => {
	test('provide the required tracks from the manifest', () => {
		const manifestPath = resolve(process.cwd(), 'tests/assets/tracks-manifest.json');
		const manifest = JSON.parse(
			readFileSync(manifestPath, 'utf8')
		) as AudioManifest;

		const result = evaluateAudioManifest(manifest, (path) =>
			existsSync(resolve(process.cwd(), path))
		);

		expect(result.mode).toBe('full');
	});
});
