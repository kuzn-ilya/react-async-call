const chalk = require('chalk')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const codeFrame = require('babel-code-frame')
const uglify = require('rollup-plugin-uglify').uglify
const fs = require('fs')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const ncp = require('ncp').ncp
const path = require('path')

// const pkg = JSON.parse(fs.readFileSync('./package.json'))

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

function handleRollupWarning(warning) {
  if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
    // Don't warn. We will remove side effectless require() in a later pass.
    return
  }

  if (typeof warning.code === 'string') {
    // This is a warning coming from Rollup itself.
    // These tend to be important (e.g. clashes in namespaced exports)
    // so we'll fail the build on any of them.
    console.error()
    console.error(warning.message || warning)
    console.error()
    process.exit(1)
  } else {
    // The warning is from one of the plugins.
    // Maybe it's not important, so just print it.
    console.warn(warning.message || warning)
  }
}

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

function getOutputFileName(options) {
  const env = options.isProduction ? '.production' : '.development'
  const min = options.uglify ? '.min' : ''
  return `build/${options.output.format}/react-async-call${env}${min}.js`
}

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
    ].filter(Boolean),
  }
}

async function build(options) {
  const file = getOutputFileName(options)
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

function asyncCopyTo(from, to) {
  return asyncMkDirP(path.dirname(to)).then(
    () =>
      new Promise((resolve, reject) => {
        ncp(from, to, error => {
          if (error) {
            // Wrap to have a useful stack trace.
            reject(new Error(error))
            return
          }
          resolve()
        })
      }),
  )
}

function asyncMkDirP(filepath) {
  return new Promise((resolve, reject) =>
    mkdirp(filepath, error => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    }),
  )
}

function asyncRimRaf(filepath) {
  return new Promise((resolve, reject) =>
    rimraf(filepath, error => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    }),
  )
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
}

buildAll()
