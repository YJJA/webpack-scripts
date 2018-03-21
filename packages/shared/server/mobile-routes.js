const koaRouter = require('koa-router')
const Api = require('./api')
const request = require('./request')

const router = koaRouter()

// 用户登录接口
/**
 * acctType 0是普通用户；1公司管理员用户; 2平台管理员
 * 移动端Web站点只能是以个人用户登录（备注）
 */
router.post('/api/login', async (ctx, next) => {
  // 1) 登录，获取token
  const loginInfo = await Api.login(ctx.request.body)
  const {tokenId: token, acctType} = loginInfo.data

  // 2) acctType 判断
  if (acctType !== 0) {
    ctx.body = {status: 4001, message: '该用户不可登录'}
    return
  }

  // 3) 确认身份接口, 个人用户确认时 companyId 设为 0
  const companyId = 0
  await Api.loginConfirm(token, companyId)

  // 4) 获取用户信息
  const userInfo = await Api.userInfo(token)

  // 5) 设置登录信息
  ctx.session.token = token
  ctx.session.user = userInfo.data

  ctx.body = userInfo
})

// 用户退出
router.get('/api/logout', async (ctx, next) => {
  const token = ctx.session.token
  ctx.session.user = null
  ctx.session.token = null

  try {
    const result = await Api.logout(token)
    ctx.body = result
  } catch (e) {
    ctx.body = {status: 2000, message: '用户退出成功'}
  }
})

module.exports = router.routes()
