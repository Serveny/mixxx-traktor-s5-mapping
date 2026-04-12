import { describe, expect, test } from 'vitest';
import { evaluateAudioManifest } from './audio-preflight';

describe('audio preflight', () => {
	test('returns full when all required tracks are available', () => {
		const result = evaluateAudioManifest(
			{
				tracks: [
					{ id: 'deckAIntro', path: '/tmp/a.wav', required: true },
					{ id: 'deckBMixIn', path: '/tmp/b.wav', required: true },
				],
			},
			(path) => path !== ''
		);

		expect(result.mode).toBe('full');
		expect(result.missingFiles).toEqual([]);
	});

	test('returns degraded when optional files are missing', () => {
		const result = evaluateAudioManifest(
			{
				tracks: [
					{ id: 'deckAIntro', path: '/tmp/a.wav', required: true },
					{ id: 'loopTrack', path: '/tmp/missing.wav', required: false },
				],
			},
			(path) => path === '/tmp/a.wav'
		);

		expect(result.mode).toBe('degraded');
		expect(result.missingFiles).toEqual(['/tmp/missing.wav']);
		expect(result.warnings[0]).toContain('loopTrack');
	});

	test('returns blocked when required files are missing', () => {
		const result = evaluateAudioManifest(
			{
				tracks: [
					{ id: 'deckAIntro', path: '/tmp/missing-a.wav', required: true },
					{ id: 'deckBMixIn', path: '/tmp/missing-b.wav', required: true },
				],
			},
			() => false
		);

		expect(result.mode).toBe('blocked');
		expect(result.warnings).toHaveLength(2);
	});
});
