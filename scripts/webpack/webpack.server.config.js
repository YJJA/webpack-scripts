
'use strict'
/*
  webpack server config
 */
const path = require('path')
const fse = require('fs-extra')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = require('../config')
const packageJson = require(path.resolve('./package.json'))

// webpack server config
module.exports = function webpackServerConfig(name, argv) {
  const dev = process.env.NODE_ENV === 'development'
  // entry
  let entry = [
    path.resolve(`packages/${name}/index`)
  ]
  if (dev) {
    entry.push.apply(entry, [
      'webpack/hot/poll?1000'
    ])
  }

  // output
  const output = {
    path: path.resolve(dev ? config.temp : config.dist, name),
    publicPath: '/',
    filename: 'index.js',
    libraryTarget: 'commonjs',
    chunkFilename: `server/[name].js`
  }

  const module = {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          cacheDirectory: false,
          presets: [
            [require.resolve('@babel/preset-env'), {
              targets: {
                node: 'current'
              }
            }],
            require.resolve('@babel/preset-react')
          ],
          plugins: [
            require.resolve('@babel/plugin-transform-runtime'),
            require.resolve('@babel/plugin-proposal-object-rest-spread'),
            require.resolve('@babel/plugin-proposal-class-properties'),
            require.resolve('@babel/plugin-syntax-dynamic-import')
          ]
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: dev ? 1024 * 100 : 1024 * 8,
          name: `static/images/[name]${dev ? '' : '.[hash:8]'}.[ext]`
        }
      }
    ]
  }

  // plugins
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.RUNTIME_ENV': JSON.stringify('server'),
      'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
      'process.env.PROJECT_NAME': JSON.stringify(name),
      'process.env.BUILD_TIME': JSON.stringify(new Date()),
      'process.env.PROJECT_VERSION': JSON.stringify(packageJson.version)
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
  ]

  if (dev) {
    plugins.push.apply(plugins, [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ])
  }

  return {
    entry,
    plugins,
    output: {
      path: path.resolve(dev ? config.temp : config.dist, name),
      publicPath: '/',
      filename: 'server.js',
      libraryTarget: 'commonjs',
      chunkFilename: `server/[name].js`
    },
    externals: Object.keys(packageJson.dependencies),
    target: 'node',
    resolve: {
      alias: {
        'server': path.resolve('./src/server')
      }
    },
    module,
    context: __dirname,
    node: {
      __filename: false,
      __dirname: false
    },
    devtool: dev ? 'cheap-module-source-map' : false
  }
}
