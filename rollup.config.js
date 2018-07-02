import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'lib/browser.js',
  output: [
    {
      file: 'dist/prefetchSvg.esm.js',
      format: 'es',
    },
    {
      file: 'dist/prefetchSvg.umd.js',
      format: 'umd',
      name: 'prefetchSvg',
    },
  ],
  plugins: [
    commonjs(),
  ],
};
