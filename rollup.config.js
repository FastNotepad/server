/// Rollup config
import { defineConfig } from 'rollup';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

// Export default
export default defineConfig({
	input: 'src/app.mts',
	output: {
		file: 'dist/app.esm.min.mjs',
		format: 'esm'
	},
	plugins: [
		terser(),
		typescript()
	]
});
