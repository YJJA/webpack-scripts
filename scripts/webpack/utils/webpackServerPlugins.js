
const path = require('path')
const webpack = require('webpack')
const moment = require('moment')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const packageJson = require(path.resolve('./package.json'))
const config = require('../../config')

module.exports = function webpackServerPlugins(dev, name) {
  let plugins = [
    new webpack.DefinePlugin({
      'process.env.RUNTIME_ENV': JSON.stringify('server'),
      'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
  ]

  if (dev) {
    plugins = [
      ...plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ]
  }

  return plugins
}
