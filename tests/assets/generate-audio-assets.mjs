import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const sampleRate = 44100;
const durationSeconds = 2;
const amplitude = 0.35;

const tracks = [
	{ path: 'tests/assets/audio/deck-a-intro.wav', frequency: 220 },
	{ path: 'tests/assets/audio/deck-b-mix-in.wav', frequency: 330 },
	{ path: 'tests/assets/audio/loop-track.wav', frequency: 440 },
];

function createSineWaveWav(frequency) {
	const frameCount = sampleRate * durationSeconds;
	const dataSize = frameCount * 2;
	const buffer = Buffer.alloc(44 + dataSize);

	buffer.write('RIFF', 0);
	buffer.writeUInt32LE(36 + dataSize, 4);
	buffer.write('WAVE', 8);
	buffer.write('fmt ', 12);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(1, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE(sampleRate * 2, 28);
	buffer.writeUInt16LE(2, 32);
	buffer.writeUInt16LE(16, 34);
	buffer.write('data', 36);
	buffer.writeUInt32LE(dataSize, 40);

	for (let i = 0; i < frameCount; i++) {
		const sample = Math.sin((2 * Math.PI * frequency * i) / sampleRate);
		buffer.writeInt16LE(sample * 32767 * amplitude, 44 + i * 2);
	}

	return buffer;
}

for (const track of tracks) {
	const absolutePath = resolve(process.cwd(), track.path);
	mkdirSync(dirname(absolutePath), { recursive: true });
	writeFileSync(absolutePath, createSineWaveWav(track.frequency));
	console.log(`Wrote ${track.path}`);
}
