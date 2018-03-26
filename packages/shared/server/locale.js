const api = require('./api')
const config = require('./config')

module.exports = async (ctx, next) => {
  // 尝试重新获取用户信息
  if (ctx.session.token) {
    try {
      const [userInfo, userHead] = await Promise.all([
        api.userInfo(ctx.session.token),
        api.userHead(ctx.session.token)
      ])
      ctx.session.user = {
        ...userInfo.data,
        acctIcon: userHead.data.acctIcon,
        acctIcon1: userInfo.data.acctIcon
      }
    } catch (e) {
      if (e.status === 4002) {
        ctx.session.user = null
        ctx.session.token = null
      }
      console.log('----------------------')
      console.log('尝试重新获取用户信息失败', e)
    }
  }

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
