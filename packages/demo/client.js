import './theme/global.css'

import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {ConnectedRouter as Router} from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import configureStore from './redux/store'
import App from './containers/App'
import Loadable from 'react-loadable'

const initialState = window.__INITIAL_STATE__
const history = createHistory()
const store = configureStore(history, initialState)
const mountNode = document.getElementById('app')

let prevLocation = {}
history.listen(location => {
  const pathChanged = prevLocation.pathname !== location.pathname
  const hashChanged = prevLocation.hash !== location.hash
  if (pathChanged || hashChanged) window.scrollTo(0, 0)
  prevLocation = location
})

Loadable.preloadReady().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <App/>
      </Router>
    </Provider>,
    mountNode
  )
})
