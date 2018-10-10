import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  input: 'src/index.js',
  external: ['react', 'prop-types'],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers'],
    }),
    resolve(),
    commonjs(),
  ],
  output: [
    {
      exports: 'named',
      sourcemap: true,
      file: pkg.main,
      format: 'cjs',
    },
    {
      exports: 'named',
      sourcemap: true,
      file: pkg.module,
      format: 'es',
    },
    {
      exports: 'named',
      globals: {
        react: 'React',
        'prop-types': 'PropTypes',
      },
      sourcemap: true,
      file: pkg['umd:main'],
      format: 'umd',
      name: 'ReactAsyncCall',
    },
  ],
}
