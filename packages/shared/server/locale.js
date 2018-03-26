module.exports = async (ctx, next) => {
  const initialState = {
    user: {
      data: ctx.session.user || null
    }
  }

  ctx.localeData = {
    __APPID__: ctx.appId,
    __INITIAL_STATE__: initialState
  }

  await next()
}
