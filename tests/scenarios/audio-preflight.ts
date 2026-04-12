import { existsSync } from 'node:fs';

export interface AudioTrackEntry {
	id: string;
	path: string;
	required: boolean;
}

export interface AudioManifest {
	tracks: AudioTrackEntry[];
}

export interface AudioPreflightResult {
	mode: 'full' | 'degraded' | 'blocked';
	missingFiles: string[];
	availableFiles: string[];
	warnings: string[];
}

export function evaluateAudioManifest(
	manifest: AudioManifest,
	exists: (path: string) => boolean = existsSync
): AudioPreflightResult {
	const missingTracks = manifest.tracks.filter((track) => !exists(track.path));
	const missingRequired = missingTracks.filter((track) => track.required);
	const mode = missingRequired.length
		? 'blocked'
		: missingTracks.length
			? 'degraded'
			: 'full';

	return {
		mode,
		missingFiles: missingTracks.map((track) => track.path),
		availableFiles: manifest.tracks
			.filter((track) => exists(track.path))
			.map((track) => track.path),
		warnings: missingTracks.map(
			(track) =>
				`Track '${track.id}' is missing at ${track.path}${track.required ? ' (required)' : ' (optional)'}`
		),
	};
}
