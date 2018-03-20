import babel from 'rollup-plugin-babel'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  input: 'src/index.js',
  external: ['react', 'prop-types', 'fbjs/lib/shallowEqual', 'fbjs/lib/invariant'],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers'],
    }),
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
        'fbjs/lib/shallowEqual': 'shallowEqual',
        'fbjs/lib/invariant': 'invariant',
      },
      sourcemap: true,
      file: pkg['umd:main'],
      format: 'umd',
      name: 'ReactAsyncCall',
    },
  ],
}
