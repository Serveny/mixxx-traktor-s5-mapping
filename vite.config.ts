import { defineConfig } from 'vite';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
const fileName = 'Traktor-Kontrol-S5';
const outDir = 'dist';
const copyTargetDir = path.resolve('attic/mappings/controllers');
const xmlSource = 'mapping/Traktor Kontrol S5.hid.xml';

export default defineConfig({
	build: {
		outDir,
		target: 'es6',
		minify: false,

		lib: {
			entry: 'src/main.ts',
			name: 'MixxxTraktorKontrolS5Mapping',
			fileName,
			formats: ['es'],
		},

		terserOptions: {
			compress: false,
			mangle: false,
			format: {
				comments: 'all',
				beautify: true,
			},
		} as any,
	},
	plugins: [
		{
			name: 'copy-controller-build-to-attic',
			async writeBundle() {
				const source = path.resolve(outDir, `${fileName}.js`);
				const destination = path.join(copyTargetDir, `${fileName}.js`);

				try {
					await mkdir(copyTargetDir, { recursive: true });
					await copyFile(source, destination);
					await copyFile(path.resolve(xmlSource), path.join(copyTargetDir, path.basename(xmlSource)));
				} catch (error) {
					this.warn(`Skipping controller copy to ${destination}: ${error}`);
				}
			},
		},
	],
});
