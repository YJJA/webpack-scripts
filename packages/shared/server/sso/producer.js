const url = require('url')
const koaRouter = require('koa-router')
const Api = require('../api')
const config = require('../../config')
const qs = require('querystring')
const request = require('../request')
const httpError = require('http-errors')

//
const isNotDev = process.env.NODE_ENV !== 'development'

// 组合返回跳转 rul
const createRedirectUrl = (ctx, appId, ticket, redirect, acctType) => {
  const {protocol, host} = url.parse(redirect, true)
  const sessionOptions = ctx.sessionOptions
  const sessionId = ctx.cookies.get(sessionOptions.key, sessionOptions)
  const query = {appId, ticket, sessionId, acctType}
  const pathname = '/authentication'
  return url.format({protocol, host, pathname, query})
}

// 组合远程注销 url
const createDestroyUrl = (appId, sessionId, redirect) => {
  const {protocol, host} = url.parse(redirect, true)
  const pathname = '/destroy'
  const query = {appId, sessionId}
  return url.format({protocol, host, pathname, query})
}

// 注销远程登录用户
const destroyRemote = async ({acctType, companyId}, sessionId, excludeId) => {
  // 如果是个人用户并且是以个人身份登录
  if (acctType === 0 && companyId === 0) {
    const appId = excludeId === 'front' ? 'business' : 'front'
    const redirect = config.hosts[appId]
    const url = createDestroyUrl(appId, sessionId, redirect)
    await request.get(url)
      .catch(err => {
        console.error(err)
        console.log(appId, url)
      })
  }
}

const router = koaRouter()

// 用户登录页面
router.get('/', async (ctx, next) => {
  // 没有登录直接返回登录页面
  const token = ctx.session.token
  if (!token) {
    await next()
    return
  }

  const {acctType, companyId} = ctx.session.user
  // 个人用户已登录但未选择登录身份时，直接返回登录页面
  if (acctType === 0 && typeof companyId === 'undefined') {
    await next()
    return
  }

  let {appId, redirect, type} = ctx.query
  if (type === 'relogin') {
    ctx.session.token = null
    ctx.session.user = null
    await next()
    return
  }

  // 已经登录
  if (isNotDev) {
    if (acctType === 1 || (acctType === 0 && companyId !== 0)) {
      appId = 'business'
      redirect = config.hosts[appId]
    } else if (acctType === 2) {
      appId = 'admin'
      redirect = config.hosts[appId]
    } else {
      appId = 'front'
      redirect = config.hosts[appId]
    }
  } else {
    // 开发环境执行此操作
    if (!appId || !redirect) {
      ctx.session.token = null
      ctx.session.user = null
      await next()
      return
    }
  }

  // 创建跳转授权链接
  const redirectUrl = createRedirectUrl(ctx, appId, token, redirect, acctType)
  ctx.redirect(redirectUrl)
})

// 用户登录接口
router.post('/api/login', async (ctx, next) => {
  // 默认登录应用参数
  let appId = ctx.defaultAppId
  let redirect = ctx.defaultAppHost

  // 尝试获取当前登录应用参数
  try {
    const {query} = url.parse(ctx.header.referer, true)
    appId = query.appId || appId
    redirect = query.redirect || redirect
  } catch (e) {}

  // 登录，获取token
  const result = await Api.login(ctx.request.body)
  const {tokenId: token, acctType, companyList} = result.data

  // 设置已经登录标记
  ctx.session.token = token
  ctx.session.user = {acctType}

  // acctType 0 是普通用户；1公司管理员用户; 2平台管理员
  // 跟据 acctType 类型设置跳转地址
  if (isNotDev) {
    if (acctType === 1) {
      // 公司管理员只登录商家中台
      appId = 'business'
      redirect = config.hosts.business
    } else if (acctType === 2) {
      // 平台管理员只登录后台
      appId = 'admin'
      redirect = config.hosts.admin
    } else {
      // 个人用户，请选择个人登录还是公司登录后再做判断
    }
  }

  // 组合跳转 url
  const redirectUrl = createRedirectUrl(ctx, appId, token, redirect, acctType)
  ctx.body = {
    status: 2000,
    data: {acctType, companyList, redirect: redirectUrl}
  }
})

// 个人用户选择身份确认接口
router.post('/api/confirm', async (ctx, next) => {
  // 默认登录应用参数
  let appId = ctx.defaultAppid
  let redirect = ctx.defaultAppHost

  // 尝试获取当前登录应用参数
  try {
    const {query} = url.parse(ctx.header.referer, true)
    appId = query.appId || appId
    redirect = query.redirect || redirect
  } catch (e) {}

  // 登录状态判断
  const token = ctx.session.token
  if (!token) {
    ctx.body = {status: 4002, message: '用户未登录'}
    return
  }

  const {companyId} = ctx.request.body
  let redirectUrl = null
  let sameRedirectUrl = null
  if (isNotDev) {
    if (companyId === 0 && appId !== 'front' && appId !== 'business') {
      // 如果是以个人身份登录，则相看来源页
      // 如果来源页是前台或中台，哪来回哪去
      // 如果来源页是前台或中台以外的，则默认跳前台
      appId = 'front'
      redirect = config.hosts.front
    } else if (companyId > 0) {
      // 如果是以公司身份登录，则跳转到公司中台
      appId = 'business'
      redirect = config.hosts.business
    }

    const {acctType} = ctx.session.user

    // 如果是个人用户登录, 则要同时登录前台或中台
    if (companyId === 0) {
      let sameAppId = null
      let sameRedirect = null
      // 如果当前登录的是前台、则要同时登录客户中台
      if (appId === 'front') {
        sameAppId = 'business'
        sameRedirect = config.hosts.business
      } else if (appId === 'business') {
        // 如果当前登录的是客户中台、则要同时登录前台
        sameAppId = 'front'
        sameRedirect = config.hosts.front
      }
      sameRedirectUrl = createRedirectUrl(ctx, sameAppId, token, sameRedirect, acctType)
    }

    // 重新组合跳转
    redirectUrl = createRedirectUrl(ctx, appId, token, redirect, acctType)
  }

  try {
    const result = await Api.loginConfirm(token, companyId)
    ctx.session.user = {...ctx.session.user, companyId}
    ctx.body = {...result, redirect: redirectUrl, sameRedirect: sameRedirectUrl}
  } catch (e) {
    ctx.session.token = null
    ctx.body = e
  }
})

// 注销登录用户(远程注销)
router.get('/api/destroy', async (ctx, next) => {
  const {sessionId, appId} = ctx.query
  if (!sessionId) {
    ctx.throw(400, '注销用户操作缺少关键参数')
  }

  // 获取登录用户信息
  const sessionOptions = ctx.sessionOptions
  const session = await sessionOptions.store.get(sessionId)
  if (session) {
    const {token, user, ...data} = session
    // 注销远程登录用户(排除发送注销操作的服务)
    await destroyRemote(session.user, sessionId, appId)
    // 本地注销
    await sessionOptions.store.set(sessionId, data)
  }

  ctx.body = {status: 2000, message: '注销成功'}
})

module.exports = router.routes()
