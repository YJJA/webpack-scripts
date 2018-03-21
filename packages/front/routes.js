import React from 'react'
import App from './containers/App'

export default [
  {
    component: App,
    routes: [
      {
        path: '/',
        title: '首页',
        exact: true,
        asyncComponent: () => import(
          /* webpackChunkName: "Index" */
          './containers/Index'
        )
      },
      // 404
      {
        path: '',
        title: '页面找不到了',
        component: () => <div>暂无页面</div>
      }
    ]
  }
]
