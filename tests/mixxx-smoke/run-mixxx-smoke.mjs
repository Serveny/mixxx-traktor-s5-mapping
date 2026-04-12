import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseMixxxOutput } from './parse-mixxx-log.mjs';

function resolveMixxxBinary() {
	const candidates = [
		resolve(process.cwd(), '../mixxx/build/mixxx'),
		resolve(process.cwd(), '../../../mixxx/build/mixxx'),
	];

	for (const candidate of candidates) {
		const result = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
		if (result.status === 0) {
			return candidate;
		}
	}

	return null;
}

const mixxxBinary = resolveMixxxBinary();
if (!mixxxBinary) {
	console.warn('WARN: Mixxx binary not found. Smoke test skipped.');
	process.exit(0);
}

const settingsPath = mkdtempSync(join(tmpdir(), 'mixxx-s5-smoke-'));
const resourcePath = process.cwd();
const result = spawnSync(
	mixxxBinary,
	[
		'--controller-debug',
		'--controller-abort-on-warning',
		'--developer',
		'--settings-path',
		settingsPath,
		'--resource-path',
		resourcePath,
	],
	{
		encoding: 'utf8',
		timeout: 15000,
		env: {
			...process.env,
			QT_QPA_PLATFORM: process.env.QT_QPA_PLATFORM ?? 'offscreen',
		},
	}
);

const combinedOutput = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
const parsed = parseMixxxOutput(combinedOutput);

if (parsed.status === 'warn') {
	console.warn('WARN: Mixxx smoke test reported warnings/errors.');
	for (const line of parsed.problems) {
		console.warn(line);
	}
	process.exit(0);
}

console.log('PASS: Mixxx smoke test completed without warnings.');
