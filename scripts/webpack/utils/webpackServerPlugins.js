
const webpack = require('webpack')

module.exports = function webpackServerPlugins(dev, name) {
  let plugins = [
    new webpack.DefinePlugin({
      'process.env.RUNTIME_ENV': JSON.stringify('server'),
      'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
    })
    // ,
    // new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
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
