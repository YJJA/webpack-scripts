
'use strict'

/*
  watch client
 */
const path = require('path')
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const fse = require('fs-extra')

const config = require('../config')
const webpackClientConfig = require('../webpack/webpack.client.config')

// watchClient
module.exports = (name, argv) => {
  return new Promise((resolve, reject) => {
    const clientConfig = webpackClientConfig(name, argv)
    const clientCompiler = webpack(clientConfig)
    const devConfig = {
      publicPath: clientConfig.output.publicPath,
      noInfo: false,
      quiet: false,
      stats: 'minimal'
    }
    const devMiddleware = webpackDevMiddleware(clientCompiler, devConfig)
    const hotMiddleware = webpackHotMiddleware(clientCompiler)
    let isResolve = false

    clientCompiler.plugin('done', () => {
      const fsd = devMiddleware.fileSystem
      const filePath = path.join(clientConfig.output.path, 'view/index.html')
      if (fsd.existsSync(filePath)) {
        let index = fsd.readFileSync(filePath, 'utf-8')
        const indexPath = config.getDistPath(name, true, 'index.html')
        fse.outputFileSync(indexPath, index, 'utf8')
      }

      if (!isResolve) {
        isResolve = true
        console.log('watch client is running....')
        resolve([devMiddleware, hotMiddleware])
      }
    })
  })
}
