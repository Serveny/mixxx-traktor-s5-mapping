import { beforeEach } from 'vitest';
import { installMixxxGlobals, resetMixxxGlobals } from './mixxx-globals';

installMixxxGlobals();

beforeEach(() => {
	resetMixxxGlobals();
});
