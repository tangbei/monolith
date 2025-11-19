import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  external: ['axios'],
  treeshake: true,
  minify: true,
  target: 'es2018',
  onSuccess: 'echo "Build completed successfully!"',
});