
'use strict'
/*
  webpack client config
 */
const path = require('path')
const os = require('os')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const config = require('../config')
const packageJson = require(path.resolve('./package.json'))
const moment = require('moment')
const HappyPack = require('happypack')
// const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const stylesPaths = [
  path.resolve(`./src/admin/components`),
  path.resolve(`./src/admin/containers`),
  path.resolve(`./src/front/components`),
  path.resolve(`./src/front/containers`),
  path.resolve(`./src/business/components`),
  path.resolve(`./src/business/containers`),
  path.resolve(`./src/sso/components`),
  path.resolve(`./src/sso/containers`),
  path.resolve(`./src/mobile/components`),
  path.resolve(`./src/mobile/containers`),
  path.resolve(`./src/components`)
]

module.exports = function webpackClientConfig(name, argv) {
  const dev = process.env.NODE_ENV === 'development'
  // entry
  let entry = {
    app: path.resolve(`./src/${name}/client.js`),
    vendor: [
      'babel-polyfill',
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-router',
      'react-router-dom',
      'history',
      'react-hot-loader',
      'superagent',
      'validator'
    ]
  }

  if (dev) {
    entry.app = [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=true',
      entry.app
    ]
  }

  // output
  const output = {
    path: path.resolve(config.dist, name, 'public'),
    publicPath: '/',
    filename: `static/scripts/[name]${dev ? '' : '.[chunkhash]'}.js`,
    chunkFilename: `static/scripts/[name]${dev ? '' : '.[chunkhash]'}.js`
  }

  // resolve
  const resolve = {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  }

  // module
  const module = {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: [path.resolve('./src')],
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      // {
      //   test: /\.js$/,
      //   include: [path.resolve('./src')],
      //   exclude: /node_modules/,
      //   loader: 'babel-loader',
      //   options: {
      //     cacheDirectory: true
      //   }
      // },
      {
        test: /\.js$/,
        include: [path.resolve('./src')],
        exclude: /node_modules/,
        loader: `${path.resolve('./node_modules/happypack/loader')}?id=happybabel`
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: dev ? 1024 * 100 : 1024 * 8,
          name: `static/images/[name]${dev ? '' : '.[hash:8]'}.[ext]`
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: dev ? 1024 * 100 : 1024 * 8,
          name: `static/fonts/[name]${dev ? '' : '.[hash:8]'}.[ext]`
        }
      }
    ]
  }

  if (dev) {
    module.rules.unshift.apply(module.rules, [
      {
        test: /\.css$/,
        include: stylesPaths,
        loaders: [
          'style-loader',
          `${path.resolve('./node_modules/happypack/loader')}?id=happynextcss`
        ]
      },
      {
        test: /\.css$/,
        exclude: stylesPaths,
        loaders: [
          'style-loader',
          `${path.resolve('./node_modules/happypack/loader')}?id=happycss`
        ]
      }
    ])
  } else {
    module.rules.unshift.apply(module.rules, [
      {
        test: /\.css$/,
        include: stylesPaths,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: `${path.resolve('./node_modules/happypack/loader')}?id=happynextcss`
        })
      },
      {
        test: /\.css$/,
        exclude: stylesPaths,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: `${path.resolve('./node_modules/happypack/loader')}?id=happycss`
        })
      }
    ])
  }

  // plugins
  const plugins = [
    new HappyPack({
      id: 'happybabel',
      loaders: [
        {
          path: 'babel-loader',
          query: {
            cacheDirectory: true
          }
        }
      ],
      threads: 2
    }),
    new HappyPack({
      id: 'happynextcss',
      loaders: [
        {
          path: 'css-loader',
          query: {
            modules: true,
            sourceMap: dev,
            minimize: !dev,
            importLoaders: 1,
            localIdentName: '[folder]-[name]-[local]--[hash:base64:5]',
            discardComments: { removeAll: true }
          }
        },
        'postcss-loader'
      ],
      threads: 2
    }),
    new HappyPack({
      id: 'happycss',
      loaders: [
        {
          path: 'css-loader',
          query: {
            sourceMap: dev,
            minimize: !dev,
            importLoaders: 1,
            discardComments: { removeAll: true }
          }
        },
        'postcss-loader'
      ],
      threads: 2
    }),
    new HtmlWebpackPlugin({
      filename: dev ? 'view/index.html' : '../index.html',
      template: path.resolve(`./src/${name}/index.html`)
    }),
    new webpack.LoaderOptionsPlugin({
      debug: dev
    }),
    new webpack.DefinePlugin({
      'process.env.RUNTIME_ENV': JSON.stringify('client'),
      'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
      'process.env.BUILD_TIME': JSON.stringify(moment().format('YYYY-MM-DD HH:mm:ss')),
      'process.env.PROJECT_NAME': JSON.stringify(name),
      'process.env.PROJECT_VERSION': JSON.stringify(packageJson.version)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve('src', name, 'public'),
        to: ''
      }
    ]),
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new LodashModuleReplacementPlugin({
      paths: true
    })
  ]

  if (dev) {
    plugins.push.apply(plugins, [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ])
  } else {
    plugins.push.apply(plugins, [
      new ExtractTextPlugin({
        filename: `static/styles/[name]${dev ? '' : '.[contenthash]'}.css`,
        allChunks: true
      }),
      new ParallelUglifyPlugin({
        cacheDir: 'node_modules/.uglify-cache/',
        uglifyJS: {
          compress: {
            warnings: false,
            unused: true,
            dead_code: true,
            drop_console: true
          },
          output: {
            comments: false
          }
        }
      })// ,
      // new BundleAnalyzerPlugin()
    ])
  }

  const node = {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
  const cache = dev
  const target = 'web'
  const devtool = dev ? 'cheap-module-source-map' : 'source-map'

  return {
    entry,
    output,
    resolve,
    module,
    plugins,
    node,
    cache,
    target,
    devtool
  }
}
