import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function evaluateAudioManifest(manifest) {
	const missingTracks = manifest.tracks.filter((track) => !existsSync(resolve(process.cwd(), track.path)));
	const missingRequired = missingTracks.filter((track) => track.required);
	return {
		mode: missingRequired.length
			? 'blocked'
			: missingTracks.length
				? 'degraded'
				: 'full',
		warnings: missingTracks.map(
			(track) =>
				`Track '${track.id}' is missing at ${track.path}${track.required ? ' (required)' : ' (optional)'}`
		),
	};
}

function buildDjSetScenario(mode) {
	if (mode === 'blocked') {
		return {
			mode,
			steps: [],
			warnings: ['Required audio tracks are missing; the DJ set scenario cannot run.'],
		};
	}

	const controlOnlySteps = [
		'Walk through deck switching, shift combinations, and browser navigation',
	];
	const audioSteps = [
		'Load deck A and B, then run the visible mix sequence',
	];

	return {
		mode,
		steps: mode === 'full' ? [...audioSteps, ...controlOnlySteps] : controlOnlySteps,
		warnings:
			mode === 'degraded'
				? ['Optional scenario tracks are missing; running control-only fallback steps.']
				: [],
	};
}

const manifestPath = resolve(process.cwd(), 'tests/assets/tracks-manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const preflight = evaluateAudioManifest(manifest);
const scenario = buildDjSetScenario(preflight.mode);

console.log(`DJ set mode: ${scenario.mode}`);
for (const warning of [...preflight.warnings, ...scenario.warnings]) {
	console.warn(`WARN: ${warning}`);
}

if (scenario.mode === 'blocked') {
	process.exit(1);
}

for (const step of scenario.steps) {
	console.log(step);
}
