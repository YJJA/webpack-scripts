import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Loadable from 'react-loadable'

import Loading from '../../components/Loading'

const Home = Loadable({
  loader: () => import(/* webpackChunkName: "Home" */'../Home'),
  loading: Loading
})

const NotFound = Loadable({
  loader: () => import(/* webpackChunkName: "NotFound" */'../NotFound'),
  loading: Loading
})

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default App
