
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = function (dev, name) {
  return [
    {
      test: /\.js$/,
      enforce: 'pre',
      loader: 'eslint-loader',
      include: [path.resolve('./packages')],
      exclude: /node_modules/,
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    },
    {
      test: /\.js$/,
      include: [path.resolve('./packages')],
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader']
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
