
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

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

module.exports = function (dev, name) {
  const cssModuleLoaders = [
    {
      loader: 'css-loader',
      options: {
        modules: true,
        sourceMap: dev,
        minimize: !dev,
        importLoaders: 1,
        localIdentName: '[folder]-[name]-[local]--[hash:base64:5]',
        discardComments: { removeAll: true }
      }
    },
    'postcss-loader'
  ]

  const cssNormalLoaders = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: dev,
        minimize: !dev,
        importLoaders: 1,
        discardComments: { removeAll: true }
      }
    },
    'postcss-loader'
  ]

  return [
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
    {
      test: /\.js$/,
      include: [path.resolve('./src')],
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
    },
    {
      test: /\.css$/,
      include: stylesPaths,
      ...(dev ? {
        loaders: [
          'style-loader',
          ...cssModuleLoaders
        ]
      } : {
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssModuleLoaders
        })
      })
    },
    {
      test: /\.css$/,
      exclude: stylesPaths,
      ...(dev ? {
        loaders: [
          'style-loader',
          ...cssNormalLoaders
        ]
      } : {
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssNormalLoaders
        })
      })
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
