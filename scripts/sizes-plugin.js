const gzip = require('gzip-size')

module.exports = ({ onGetSize }) => ({
  name: 'react-async-call/sizes-plugin',
  ongenerate(bundle, obj) {
    if (!onGetSize) {
      throw new Error('onGetSize should be passed')
    }
    const size = Buffer.byteLength(obj.code)
    const gzippedSize = gzip.sync(obj.code)

    onGetSize(bundle.file, size, gzippedSize)
  },
})
