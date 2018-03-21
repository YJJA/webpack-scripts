
const path = require('path')
const webpack = require('webpack')
const moment = require('moment')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const packageJson = require(path.resolve('./package.json'))

module.exports = function (dev, name) {
  let plugins = [
    new HtmlWebpackPlugin({
      filename: dev ? 'view/index.html' : '../index.html',
      template: path.resolve(`./src/${name}/index.html`)
    }),
    new webpack.LoaderOptionsPlugin({
      debug: dev
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve('src', name, 'public'),
        to: ''
      }
    ]),
    new webpack.DefinePlugin({
      'process.env.RUNTIME_ENV': JSON.stringify('client'),
      'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
      'process.env.BUILD_TIME': JSON.stringify(moment().format('YYYY-MM-DD HH:mm:ss')),
      'process.env.PROJECT_NAME': JSON.stringify(name),
      'process.env.PROJECT_VERSION': JSON.stringify(packageJson.version)
    }),
    new LodashModuleReplacementPlugin({
      paths: true
    })
  ]

  if (dev) {
    plugins = [
      ...plugins,
      new webpack.HotModuleReplacementPlugin()
    ]
  } else {
    plugins = [
      ...plugins,
      new ExtractTextPlugin({
        filename: `static/styles/[name]${dev ? '' : '.[contenthash]'}` + '.css',
        allChunks: true
      })// ,
      // new BundleAnalyzerPlugin()
    ]
  }

  return plugins
}
