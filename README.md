# 构建流程

## 运行环境
Node.js >=  v8.9.0
Yarn >= 1.2.0

## 目录结构
```
/docs             // 文档
/src              // 开发目录
  /admin          // 平台
  /antd-components        // 平台 & 商家 公共组件
  /business       // 商家
  /config         // 服务端配置文件
  /front          // 前台
    /components       // 组件
    /containers       // 容器（页面）
    /lib
    /mock             // mock
    /public           // 公共文件
    /redux            // redux
    /server           // 服务端文件
    /theme            // 主题（公共样式文件）
    client.js        // 客户端入口文件
    index.html
    index.js          // 服务端入口文件
    routes.js         // 前端路由
  /modules        // 公共文件模块
  /server         // 服务端配置文件
  /sso            // 单点登录
/tools            // 开发工具
```
## 技术栈
React
Redux (React-Redux)
Antd-design (中后台UI组件库)
[Eslint](http://eslint.cn/)
[Stylelint](https://stylelint.io/)
[Cssnext](http://cssnext.io/)

### javascript 代码规范
[standard](https://github.com/standard/standard/blob/master/docs/RULES-zhcn.md#javascript-standard-style)

### css 代码规范
[css-modules](https://github.com/css-modules/css-modules)
[stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard)

### redux 文件组织规范
[ducks-modular-redux](https://github.com/erikras/ducks-modular-redux)

"rc-checkbox": "^2.1.1",
"rc-dialog": "^7.0.2",
"rc-form": "^2.1.0",
"rc-pagination": "^1.12.11"
