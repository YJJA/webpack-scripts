const api = require('./api')
const config = require('./config')

module.exports = async (ctx, next) => {
  const initialState = {
    user: {
      data: ctx.session.user || null
    }
  }

  ctx.localeData = {
    __APPID__: ctx.appId,
    // 图片预览地址
    __FILE_VIEW__: config.fileview,
    // 多应用Host地址
    __HOSTS__: config.hosts,
    // 初始化 State
    __INITIAL_STATE__: initialState
  }

  await next()
}
