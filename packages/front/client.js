import '../lib/common'
import './theme/global.css'

import '@babel/polyfill'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import {Provider} from 'react-redux'
import {ConnectedRouter as Router} from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import {renderRoutes} from 'react-router-config'
import {LocaleProvider} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import configureStore from './redux/store'
import AsyncRoutes from '../components/AsyncRoutes'

const initialState = window.__INITIAL_STATE__
const history = createHistory()
const store = configureStore(history, initialState)
const mountNode = document.getElementById('app')

const renderApp = () => {
  const routes = require('./routes').default

  render(
    <AppContainer>
      <LocaleProvider locale={zhCN}>
        <Provider store={store}>
          <Router history={history}>
            <AsyncRoutes routes={routes} store={store}/>
          </Router>
        </Provider>
      </LocaleProvider>
    </AppContainer>,
    mountNode
  )
}

if (module.hot) {
  const reRenderApp = () => {
    try {
      renderApp()
    } catch (error) {
      const RedBox = require('redbox-react').default
      render(<RedBox error={error} />, mountNode)
    }
  }

  module.hot.accept('./routes', () => {
    setImmediate(() => {
      unmountComponentAtNode(mountNode)
      reRenderApp()
    })
  })
}

renderApp()
