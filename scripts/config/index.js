const path = require('path')
// temp build dirname
module.exports = {
  distRoot: path.resolve('./build'),
  getDistPath: function (name, dev, ...args) {
    return dev
      ? path.resolve(`./packages/${name}/node_modules/.temp`, ...args)
      : path.resolve(`./build/packages/${name}`, ...args)
  }
}
