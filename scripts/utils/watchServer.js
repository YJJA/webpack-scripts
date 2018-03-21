
'use strict'

/*
  watch client
 */
const webpack = require('webpack')
const path = require('path')
const config = require('../config')
const webpackServerConfig = require('../webpack/webpack.server.config')

// watchServer
module.exports = (name, argv) => {
  return new Promise((resolve, reject) => {
    const serverConfig = webpackServerConfig(name, argv)
    const serverCompiler = webpack(serverConfig)
    const serverPath = path.join(serverConfig.output.path, serverConfig.output.filename)
    let isResolve = false

    serverCompiler.watch({
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    }, (error, stats) => {
      if (error) {
        reject(error)
        return
      }
      if (!isResolve) {
        isResolve = true
        console.log('watch server is watching....')
        resolve(serverPath)
      }
      stats = stats.toJson()
      stats.errors.forEach(err => console.error(err))
      stats.warnings.forEach(err => console.warn(err))
    })
  })
}
