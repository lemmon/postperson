import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/app/index.js',
  output: {
    file: 'public/build/bundle.js',
    format: 'iife',
  },
  plugins: [
    babel({ babelHelpers: 'bundled', presets: ['@babel/preset-env'] }),
    resolve(),
    terser({
      output: {
        comments: false,
      },
    }),
  ],
}
