import { cpSync, existsSync, mkdtempSync, mkdirSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseMixxxOutput } from './parse-mixxx-log.mjs';

const projectRoot = process.cwd();

// --- Locate the Mixxx binary ---

function resolveMixxxBinary() {
	const candidates = [
		resolve(projectRoot, '../mixxx/build/mixxx'),
		resolve(projectRoot, '../../../mixxx/build/mixxx'),
	];

	for (const candidate of candidates) {
		const result = spawnSync(candidate, ['--version'], {
			encoding: 'utf8',
			timeout: 5000,
		});
		if (result.status === 0) {
			console.log(`Found Mixxx: ${result.stdout.trim()}`);
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

// --- Locate the Mixxx resource path (for system skins, etc.) ---

const mixxxResourcePath = resolve(mixxxBinary, '../../res');
if (!existsSync(resolve(mixxxResourcePath, 'controllers'))) {
	console.warn(
		`WARN: Mixxx resource path not found at ${mixxxResourcePath}. Smoke test skipped.`
	);
	process.exit(0);
}

// --- Ensure the mapping JS is built ---

const builtJs = resolve(projectRoot, 'dist/Traktor-Kontrol-S5.js');
if (!existsSync(builtJs)) {
	console.warn(
		'WARN: Built controller JS not found at dist/Traktor-Kontrol-S5.js.'
	);
	console.warn('      Run "npm run build" first. Smoke test skipped.');
	process.exit(0);
}

// --- Locate the HID XML mapping ---

const hidXmlSource = resolve(
	homedir(),
	'.mixxx/controllers/Traktor Kontrol S5.hid.xml'
);
if (!existsSync(hidXmlSource)) {
	console.warn(
		`WARN: HID XML mapping not found at ${hidXmlSource}. Smoke test skipped.`
	);
	process.exit(0);
}

// --- Set up isolated settings directory with controller files ---

const settingsPath = mkdtempSync(join(tmpdir(), 'mixxx-s5-smoke-'));
const controllerDir = join(settingsPath, 'controllers');
mkdirSync(controllerDir, { recursive: true });

// Copy the built JS and HID XML mapping into the isolated settings
cpSync(builtJs, join(controllerDir, 'Traktor-Kontrol-S5.js'));
cpSync(hidXmlSource, join(controllerDir, 'Traktor Kontrol S5.hid.xml'));
console.log('Installed controller mapping into temp settings directory.');

// --- Run Mixxx ---

console.log(`Settings path: ${settingsPath}`);
console.log(`Resource path: ${mixxxResourcePath}`);

const result = spawnSync(
	mixxxBinary,
	[
		'--controller-debug',
		'--controller-abort-on-warning',
		'--developer',
		'--settings-path',
		settingsPath,
		'--resource-path',
		mixxxResourcePath,
	],
	{
		encoding: 'utf8',
		timeout: 20000,
		env: {
			...process.env,
			QT_QPA_PLATFORM: process.env.QT_QPA_PLATFORM ?? 'offscreen',
		},
	}
);

const combinedOutput = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
const parsed = parseMixxxOutput(combinedOutput);

// --- Check for controller-specific issues ---

const controllerErrors = parsed.problems.filter(
	(line) =>
		/controller|script|mapping|hid|traktor/i.test(line) &&
		/error|exception|abort|fatal/i.test(line)
);

const scriptLoadLines = parsed.lines.filter((line) =>
	/Traktor.Kontrol.S5|TraktorS5|Loaded.*controller/i.test(line)
);

if (controllerErrors.length > 0) {
	console.error('FAIL: Controller errors detected:');
	for (const line of controllerErrors) {
		console.error(`  ${line}`);
	}
	process.exit(1);
}

if (parsed.status === 'warn') {
	console.warn('WARN: Mixxx reported warnings (non-controller):');
	for (const line of parsed.problems.slice(0, 10)) {
		console.warn(`  ${line}`);
	}
}

if (scriptLoadLines.length > 0) {
	console.log('Controller load evidence:');
	for (const line of scriptLoadLines) {
		console.log(`  ${line}`);
	}
}

console.log(
	`PASS: Mixxx smoke test completed. ${parsed.problems.length} warnings, ${controllerErrors.length} controller errors.`
);
