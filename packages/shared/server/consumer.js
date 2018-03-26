const url = require('url')
const koaRouter = require('koa-router')
const qs = require('querystring')
const Api = require('./api')
const config = require('./config')
const request = require('./request')

const router = koaRouter()

// 获取被代理后的 host
const getHost = ctx => {
  const proxyHost = ctx.headers['x-forwarded-host']
  const proxyProto = ctx.headers['x-forwarded-proto']
  if (proxyHost) {
    return `${proxyProto}://${proxyHost}`
  }

  return ctx.origin
}

// 获取 referer
const getReferer = ctx => {
  let refererObj = {}
  try {
    refererObj = url.parse(ctx.query.referer || ctx.headers.referer, true)
  } catch (e) {}
  return refererObj.path || '/'
}

// 登录认证
router.get('/authentication', async (ctx, next) => {
  const {appId, ticket: token, acctType, sessionId: remoteSessionId} = ctx.query

  // 没有认证token
  if (!token || !acctType || !remoteSessionId) {
    const redirect = getHost(ctx)
    const query = {
      appId: ctx.appId,
      redirect,
      type: 'relogin'
    }
    const redirectUrl = `${ctx.ssoAppHost}?${qs.stringify(query)}`
    return ctx.redirect(redirectUrl)
  }

  // 尝试使用该 token 获取用户信息
  let result = null
  try {
    result = await Api.userInfo(token)
  } catch (e) {
    console.log(e)
    const redirect = getHost(ctx)
    const query = {
      appId: ctx.appId,
      redirect,
      type: 'relogin'
    }
    const redirectUrl = `${ctx.ssoAppHost}?${qs.stringify(query)}`
    return ctx.redirect(redirectUrl)
  }
  const user = result.data

  // 角色较验
  const acctTypes = config.acctTypes[ctx.appId]
  if (!acctTypes.includes(user.acctType)) {
    const redirect = getHost(ctx)
    const query = {
      appId: ctx.appId,
      redirect,
      type: 'relogin',
      message: '该用户暂无权限登录此应用'
    }
    const redirectUrl = `${ctx.ssoAppHost}?${qs.stringify(query)}`
    return ctx.redirect(redirectUrl)
  }

  // 设置用户登录信息
  ctx.session.token = token
  ctx.session.user = user
  ctx.session.sso = remoteSessionId

  // 关联登录服务凭证
  const sessionOptions = ctx.sessionOptions
  const localSessionId = ctx.cookies.get(sessionOptions.key, sessionOptions)
  sessionOptions.store.set(`sso:${ctx.appId}:${remoteSessionId}`, localSessionId)

  // 跳转至发起登录需求页面
  ctx.redirect(ctx.session.referer || '/')
})

// 发起登录并跳转到登录服务
router.get('/login', async (ctx, next) => {
  const {type} = ctx.query
  const redirect = getHost(ctx)
  const {appId, ssoAppHost} = ctx
  const query = {appId, redirect, type}

  if (type === 'relogin') {
    ctx.session.user = null
    ctx.session.token = null
  }

  const target = `${ctx.ssoAppHost}?${qs.stringify(query)}`

  // 设置登录成功后的地址
  ctx.session.referer = ctx.referer || getReferer(ctx)
  ctx.redirect(target)
})

// 用户退出(本地注销)
router.get('/logout', async (ctx, next) => {
  const {appId, ssoAppHost} = ctx

  // 通知登录服务器退出
  const remoteSessionId = ctx.session.sso
  if (remoteSessionId) {
    const remoteQuery = {appId, sessionId: remoteSessionId}
    const remotePathname = '/api/destroy'
    const remoteDestroyUrl = `${ssoAppHost}${remotePathname}?${qs.stringify(remoteQuery)}`
    try {
      await request.get(remoteDestroyUrl)
    } catch (e) {
      console.log(e)
    }
  }

  // 注销本地登录用户
  ctx.session.user = null
  ctx.session.token = null
  const sessionOptions = ctx.sessionOptions
  await sessionOptions.store.destroy(`sso:${ctx.appId}:${remoteSessionId}`)

  if (ctx.headers['content-type'] === 'application/json') {
    ctx.body = {status: 2000, redirect: '/'}
  } else {
    ctx.redirect('/')
  }
})

// 用户注册
router.get('register', async (ctx, next) => {
  ctx.redirect(`${ctx.ssoAppHost}/register`)
})

// 用户注销(远程被注销)
router.get('destroy', async (ctx, next) => {
  const {sessionId: remoteSessionId} = ctx.query

  // 获取本地用户信息
  const sessionOptions = ctx.sessionOptions
  const localSessionId = await sessionOptions.store.get(`sso:${ctx.appId}:${remoteSessionId}`)
  const session = await sessionOptions.store.get(localSessionId)

  // 清除本地用户信息
  const {user, token, referer, ...data} = session || {}
  await sessionOptions.store.set(localSessionId, data)
  await sessionOptions.store.destroy(`sso:${ctx.appId}:${remoteSessionId}`)

  ctx.body = {status: 2000, message: '用户注销成功'}
})

module.exports = router.routes()
