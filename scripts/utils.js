const codeFrame = require('babel-code-frame')
const fs = require('fs')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const ncp = require('ncp').ncp
const path = require('path')

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

function getOutputFileName({ format, isProduction, uglify }) {
  const env = isProduction === undefined ? '' : isProduction ? '.production' : '.development'
  const min = uglify ? '.min' : ''
  return `build/${format}/react-async-call${env}${min}.js`
}

module.exports = {
  handleRollupError,
  handleRollupWarning,
  asyncCopyTo,
  asyncMkDirP,
  asyncRimRaf,
  getOutputFileName,
}
