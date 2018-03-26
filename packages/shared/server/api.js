const request = require('./request')
const config = require('./config')

const apiAuthHost = `${config.api['/manufactory']}${config.version}`

// 账号密码登录
exports.login = body => {
  return request
    .post(`${apiAuthHost}/manufactory/auth/login`)
    .send(body)
}

// 公司用户选择公司确认接口
exports.loginConfirm = (token, companyId) => {
  return request
    .get(`${apiAuthHost}/manufactory/auth/confirm/${companyId}`)
    .set('tokenId', token)
}

// 用户信息
exports.userInfo = (token) => {
  return request
    .get(`${apiAuthHost}/manufactory/auth/currentUser`)
    .set('tokenId', token)
}

// 退出
exports.logout = (token) => {
  return request
    .get(`${apiAuthHost}/manufactory/auth/logout`)
    .set('tokenId', token)
}

// 用户头像信息
exports.userHead = (token) => {
  return request
    .get(`${apiAuthHost}/front/user/acctInfo`)
    .set('tokenId', token)
}
