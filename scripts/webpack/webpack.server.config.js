
'use strict'
/*
  webpack server config
 */
const path = require('path')
const fse = require('fs-extra')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = require('../config')
const webpackServerPlugins = require('./utils/webpackServerPlugins')
const webpackServerModuleRules = require('./utils/webpackServerModuleRules')

// webpack server config
module.exports = function webpackServerConfig(name, argv) {
  const dev = process.env.NODE_ENV === 'development'
  const packageJson = require(path.resolve(`packages/${name}/package.json`))

  return {
    entry: dev ? [
      path.resolve(`packages/${name}/index`),
      'webpack/hot/poll?1000'
    ] : path.resolve(`packages/${name}/index`),
    mode: dev ? 'development' : 'production',
    output: {
      path: config.getDistPath(name, dev),
      publicPath: '/',
      filename: 'server.js',
      libraryTarget: 'commonjs',
      chunkFilename: `server/[name].js`
    },
    optimization: {
      minimizer: []
    },
    externals: Object.keys(packageJson.dependencies),
    target: 'node',
    module: {
      rules: webpackServerModuleRules(dev, name)
    },
    plugins: webpackServerPlugins(dev, name),
    context: __dirname,
    node: {
      __filename: false,
      __dirname: false
    },
    devtool: dev ? 'cheap-module-source-map' : false
  }
}
