const path = require('path')
const fse = require('fs-extra')
const config = require('../config')

const copyServerOfName = (dist, name) => {
  return Promise.all([
    fse.copy(
      path.resolve(`./packages/${name}/index.js`),
      path.resolve(dist, `./${name}/index.js`)
    ),
    fse.copy(
      path.resolve(`./packages/${name}/server`),
      path.resolve(dist, `./${name}/server`)
    )
  ])
}

const copyServerCommon = (dist) => {
  return Promise.all([
    fse.copy(
      path.resolve(`./packages/shared/server`),
      path.resolve(dist, `./shared/server`)
    )
  ])
}

let isCommonCopied = false
module.exports = async (name, argv) => {
  const dev = process.env.NODE_ENV === 'development'
  const dist = dev ? config.temp : config.dist
  const serverPath = path.resolve(dist, `./${name}/index.js`)
  if (!isCommonCopied) {
    isCommonCopied = true
    await copyServerCommon(dist)
  }
  await copyServerOfName(dist, name)
  return serverPath
}
