
'use strict'
/*
  webpack client config
 */
const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
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
      path.resolve(`./packages/${name}/client.js`)
    ] : path.resolve(`./packages/${name}/client.js`),
    output: {
      path: path.resolve(config.dist, name),
      publicPath: '/',
      filename: `static/scripts/[name]${dev ? '' : '.[contenthash]'}.js`,
      chunkFilename: `static/scripts/[name]${dev ? '' : '.[contenthash]'}.js`
    },
    optimization: dev ? {} : {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true
            }
          },
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            safe: true,
            discardComments: {removeAll: true}
          }
        })
      ]
    },
    resolve: {
      modules: [
        path.resolve('./packages'),
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
