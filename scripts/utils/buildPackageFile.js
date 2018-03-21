const fse = require('fs-extra')
const path = require('path')
const config = require('../config')

module.exports = function(names, argv) {
  const packageJsonPath = path.resolve('package.json')
  const distPackageJsonPath = path.resolve(`${config.dist}/package.json`)

  return fse.copy(packageJsonPath, distPackageJsonPath)
}
