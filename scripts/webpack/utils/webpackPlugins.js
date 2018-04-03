
const path = require('path')
const webpack = require('webpack')
const moment = require('moment')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const {ReactLoadablePlugin} = require('react-loadable/webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const config = require('../../config')

module.exports = function (dev, name) {
  let plugins = [
    new HtmlWebpackPlugin({
      filename: dev ? 'view/index.html' : './index.html',
      template: path.resolve(`./packages/${name}/index.html`)
    }),
    new webpack.LoaderOptionsPlugin({
      debug: dev
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve('packages', name, 'public'),
        to: dev ? '' : 'public'
      }
    ]),
    new webpack.DefinePlugin({
      'process.env.RUNTIME_ENV': JSON.stringify('client'),
      'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
    }),
    new LodashModuleReplacementPlugin({
      paths: true
    }),
    new ReactLoadablePlugin({
      filename: `${dev ? config.temp : config.dist}/${name}/react-loadable.json`
    }),
    new MiniCssExtractPlugin({
      filename: `static/styles/[name]${dev ? '' : '.[contenthash]'}` + '.css'
    })
  ]

  if (dev) {
    plugins = [
      ...plugins,
      new webpack.HotModuleReplacementPlugin()
    ]
  } else {
    plugins = [
      ...plugins
    ]
  }

  return plugins
}
