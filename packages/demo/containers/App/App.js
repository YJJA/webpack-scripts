import React from 'react'
import {ConnectedRouter as Router} from 'react-router-redux'
import {Route} from 'react-router-dom'
import Loadable from 'react-loadable'

import Loading from '../../components/Loading'

const Home = Loadable({
  loader: () => import('../Home'),
  loading: Loading
})

const NotFound = Loadable({
  loader: () => import('../NotFound'),
  loading: Loading
})

function App({history}) {
  return (
    <Router history={history}>
      <Route path="/" exart component={Home} />
      <Route component={NotFound} />
    </Router>
  )
}

export default App
