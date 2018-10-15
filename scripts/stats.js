const Table = require('cli-table')
const chalk = require('chalk')
const fs = require('fs')
const { join } = require('path')
const { getOutputFileName } = require('./utils')
const prevStats = require('./stats.json')

const na = arg => (arg ? arg : 'n/a')

const diff = (prev, next) => (prev === undefined || next === undefined ? undefined : next - prev)
const percent = (prev, next) =>
  prev === undefined || next === undefined || prev === 0 ? undefined : 100 * ((next - prev) / prev)

const areEntriesEqual = (a, b) => a.format === b.format && a.isProduction === b.isProduction && a.uglify === b.uglify

const calculateEntryStats = (newStats, entry) => {
  const newEntryStats = newStats.find(item => areEntriesEqual(item, entry)) || {}
  return {
    format: entry.format,
    isProduction: entry.isProduction,
    uglify: entry.uglify,
    newSize: newEntryStats.size,
    newGzippedSize: newEntryStats.gzippedSize,
    oldSize: entry.size,
    oldGzippedSize: entry.gzippedSize,
    diffSize: diff(entry.size, newEntryStats.size),
    diffSizePercent: percent(entry.size, newEntryStats.size),
    diffGzippedSize: diff(entry.gzippedSize, newEntryStats.gzippedSize),
    diffGzippedSizePercent: percent(entry.gzippedSize, newEntryStats.gzippedSize),
  }
}

const headers = [
  'Format',
  'Prod',
  'Min',
  'Old\nSize,\nBytes',
  'New\nSize,\nBytes',
  'Diff\nSize,\nBytes',
  'Diff\nSize,\n%',
  'Old\nGzipped\nSize,\nBytes',
  'New\nGzipped\nSize,\nBytes',
  'Diff\nGzipped\nSize,\nBytes',
  'Diff\nGzipped\nSize,\n%',
]

const formatDiff = diff =>
  typeof diff === 'number'
    ? diff <= 0
      ? chalk.green.bold(diff)
      : chalk.red.bold('+' + diff)
    : chalk.gray.bold(na(diff))

const formatDiffPercent = diff =>
  typeof diff === 'number'
    ? diff <= 0
      ? chalk.green.bold(diff.toString().substr(0, 5))
      : chalk.red.bold(('+' + diff).substr(0, 5))
    : chalk.gray.bold(na(diff))

const formatBool = arg => (arg !== undefined ? (arg ? '✓' : '✗') : '-')
const printStats = newStats => {
  const table = new Table({
    head: headers.map(label => chalk.gray.yellow(label)),
  })

  const stats = prevStats.map(item => calculateEntryStats(newStats, item)).concat(
    newStats.filter(item => !prevStats.find(old => areEntriesEqual(item, old))).map(item => ({
      format: item.format,
      isProduction: item.isProduction,
      uglify: item.uglify,
      oldSize: item.size,
      oldGzippedSize: item.gzippedSize,
    })),
  )

  stats.forEach(entry => {
    table.push([
      chalk.white.bold(`${entry.format}`),
      chalk.white.bold(`${formatBool(entry.isProduction)}`),
      chalk.white.bold(`${formatBool(!!entry.uglify)}`),
      chalk.gray.bold(na(entry.oldSize)),
      chalk.white.bold(na(entry.newSize)),
      formatDiff(entry.diffSize),
      formatDiffPercent(entry.diffSizePercent),
      chalk.gray.bold(na(entry.oldGzippedSize)),
      //   percentChangeString(result.prevFileSizeChange),
      chalk.white.bold(na(entry.newGzippedSize)),
      //   percentChangeString(result.prevGzipSizeChange),
      formatDiff(entry.diffGzippedSize),
      formatDiffPercent(entry.diffGzippedSizePercent),
    ])
  })

  console.log(table.toString())
}

const saveStats = stats => {
  fs.writeFileSync(join('scripts', 'stats.json'), JSON.stringify(stats, null, 2))
}

module.exports = {
  printStats,
  saveStats,
}
