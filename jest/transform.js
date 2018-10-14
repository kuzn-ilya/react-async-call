const babelJest = require('babel-jest')

const babelOptions = {
  presets: [
    [
      'env',
      {
        loose: true,
      },
    ],
    'react',
  ],
  plugins: [
    'transform-class-properties',
    'transform-object-rest-spread',
    [
      'transform-runtime',
      {
        helpers: false,
        polyfill: false,
        regenerator: true,
      },
    ],
  ],
}

module.exports = babelJest.createTransformer(babelOptions)
