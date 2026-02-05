import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const fileName = 'Traktor-Kontrol-S5';

export default defineConfig({
	build: {
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
		//dts({
		//insertTypesEntry: true,
		//}),
		viteStaticCopy({
			targets: [
				{
					src: `dist/${fileName}.js`,
					dest: `../attic/mappings/controllers/`,
				},
			],
		}),
	],
});
