const chalk = require('chalk')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify').uglify
const sizes = require('./sizes-plugin')
const { printStats, saveStats } = require('./stats')
const { getOutputFileName, handleRollupError, handleRollupWarning, asyncRimRaf, asyncCopyTo } = require('./utils')

const outputOptions = {
  exports: 'named',
  sourcemap: true,
}

const builds = [
  {
    output: {
      format: 'cjs',
    },
  },
  {
    output: {
      format: 'cjs',
    },
    isProduction: true,
    uglify: true,
  },
  {
    output: {
      format: 'cjs',
    },
    isProduction: true,
  },
  {
    output: {
      format: 'umd',
      globals: {
        react: 'React',
        'prop-types': 'PropTypes',
      },
      name: 'ReactAsyncCall',
    },
    isProduction: true,
  },
  {
    output: {
      format: 'umd',
      globals: {
        react: 'React',
        'prop-types': 'PropTypes',
      },
      name: 'ReactAsyncCall',
    },
    isProduction: true,
    uglify: true,
  },
]

const newStats = []

const sizesPlugin = () =>
  sizes({
    onGetSize: (file, size, gzippedSize) => {
      options = builds.find(
        item =>
          file ===
          getOutputFileName({ format: item.output.format, isProduction: item.isProduction, uglify: item.uglify }),
      )
      if (options) {
        newStats.push({
          format: options.output.format,
          isProduction: options.isProduction,
          uglify: options.uglify,
          size,
          gzippedSize,
        })
      }
    },
  })

function getInputOptions(options) {
  const inputOptions = {
    input: 'src/index.js',
    external: ['react', 'prop-types'],
    treeshake: { pureExternalModules: false },
    onwarn: handleRollupWarning,
  }

  return {
    ...inputOptions,
    ...options.input,
    plugins: [
      babel({
        exclude: 'node_modules/**',
        plugins: ['external-helpers'],
      }),
      replace({
        'process.env.NODE_ENV': options.isProduction ? "'production'" : "'development'",
      }),
      resolve(),
      commonjs(),
      options.uglify &&
        uglify({
          mangle: {
            toplevel: true,
          },
        }),
      sizesPlugin(),
    ].filter(Boolean),
  }
}

async function build(options) {
  const file = getOutputFileName({
    format: options.output.format,
    isProduction: options.isProduction,
    uglify: options.uglify,
  })
  const logFileName = chalk.bold(`${file}`)
  console.log(`${chalk.bgYellow.black(' BUILDING ')} ${logFileName}`)
  try {
    const input = getInputOptions(options)

    const output = {
      ...outputOptions,
      ...options.output,
      file,
    }

    // create a bundle
    const bundle = await rollup.rollup(input)

    // or write the bundle to disk
    await bundle.write(output)
    console.log(`${chalk.bgGreen.black(' FINISHED ')} ${logFileName}`)
  } catch (error) {
    console.log(`${chalk.bgRed.black(' ERROR!!! ')} ${logFileName}`)
    handleRollupError(error)
  }
}

async function buildAll() {
  await asyncRimRaf('./build')

  for (let i = 0; i < builds.length; i++) {
    await build(builds[i])
  }

  await Promise.all([
    asyncCopyTo(`npm`, `build`),
    asyncCopyTo('README.md', `build/README.md`),
    asyncCopyTo('LICENSE', `build/LICENSE`),
    asyncCopyTo(`package.json`, `build/package.json`),
    asyncCopyTo(`src/index.d.ts`, `build/index.d.ts`),
  ])
  printStats(newStats)
  saveStats(newStats)
}

buildAll()
