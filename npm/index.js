'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-async-call.production.min.js')
} else {
  module.exports = require('./cjs/react-async-call.development.js')
}
