const chalk = require('chalk')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const codeFrame = require('babel-code-frame')
const fs = require('fs')

// const pkg = JSON.parse(fs.readFileSync('./package.json'))

const inputOptions = {
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
}

const outputOptions = [
  {
    exports: 'named',
    sourcemap: true,
    file: 'lib/index.js',
    format: 'cjs',
  },
  {
    exports: 'named',
    globals: {
      react: 'React',
      'prop-types': 'PropTypes',
    },
    sourcemap: true,
    file: 'lib/index.umd.js',
    format: 'umd',
    name: 'ReactAsyncCall',
  },
]

function handleRollupError(error) {
  if (!error.code) {
    console.error(error)
    return
  }
  console.error(`\x1b[31m-- ${error.code}${error.plugin ? ` (${error.plugin})` : ''} --`)
  console.error(error.stack)
  if (error.loc && error.loc.file) {
    const { file, line, column } = error.loc
    // This looks like an error from Rollup, e.g. missing export.
    // We'll use the accurate line numbers provided by Rollup but
    // use Babel code frame because it looks nicer.
    const rawLines = fs.readFileSync(file, 'utf-8')
    // column + 1 is required due to rollup counting column start position from 0
    // whereas babel-code-frame counts from 1
    const frame = codeFrame(rawLines, line, column + 1, {
      highlightCode: true,
    })
    console.error(frame)
  } else if (error.codeFrame) {
    // This looks like an error from a plugin (e.g. Babel).
    // In this case we'll resort to displaying the provided code frame
    // because we can't be sure the reported location is accurate.
    console.error(error.codeFrame)
    handleRollupError(error)
  }
}

async function build(input, output) {
  const logFileName = chalk.bold(`${output.file}`)
  console.log(`${chalk.bgYellow.black(' BUILDING ')} ${logFileName}`)

  try {
    // create a bundle
    const bundle = await rollup.rollup(input)

    // or write the bundle to disk
    await bundle.write(output)
    console.log(`${chalk.bgGreen.black(' FINSHED! ')} ${logFileName}`)
  } catch (error) {
    console.log(`${chalk.bgRed.black(' ERROR!!! ')} ${logFileName}`)
    handleRollupError(error)
  }
}

async function buildAll() {
  for (let i = 0; i < outputOptions.length; i++) {
    await build(inputOptions, outputOptions[i])
  }
}

buildAll()
