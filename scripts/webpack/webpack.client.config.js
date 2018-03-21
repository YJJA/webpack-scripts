
'use strict'
/*
  webpack client config
 */
const path = require('path')
const webpack = require('webpack')

const config = require('../config')
const packageJson = require(path.resolve('./package.json'))
const webpackModuleRules = require('./utils/webpackModuleRules')
const webpackPlugins = require('./utils/webpackPlugins')

module.exports = function webpackClientConfig(name, argv) {
  const dev = process.env.NODE_ENV === 'development'

  return {
    mode: dev ? 'development' : 'production',
    entry: dev ? [
      'webpack-hot-middleware/client?reload=true',
      path.resolve(`./src/${name}/client.js`)
    ] : path.resolve(`./src/${name}/client.js`),
    output: {
      path: path.resolve(config.dist, name, 'public'),
      publicPath: '/',
      filename: `static/scripts/[name]${dev ? '' : '.[chunkhash]'}.js`,
      chunkFilename: `static/scripts/[name]${dev ? '' : '.[chunkhash]'}.js`
    },
    resolve: {
      modules: [
        path.resolve('./src'),
        path.resolve('./node_modules')
      ]
    },
    module: {
      rules: webpackModuleRules(dev, name)
    },
    plugins: webpackPlugins(dev, name),
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    cache: dev,
    target: 'web',
    devtool: dev ? 'cheap-module-source-map' : 'source-map'
  }
}
