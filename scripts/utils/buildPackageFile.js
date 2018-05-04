const fse = require('fs-extra')
const path = require('path')
const config = require('../config')

module.exports = function(names, argv) {
  const promises = names.map(async (name) => {
    const packageJsonPath = path.resolve(`packages/${name}/package.json`)
    const distPackageJsonPath = config.getDistPath(name, false, 'package.json')
    return fse.copy(packageJsonPath, distPackageJsonPath)
  })
  const rootPackageJsonPath = path.resolve(`package.json`)
  const distRootPackageJsonPath = path.resolve(`${config.distRoot}/package.json`)
  promises.push(
    fse.copy(rootPackageJsonPath, distRootPackageJsonPath)
  )
  return Promise.all(promises)
}
