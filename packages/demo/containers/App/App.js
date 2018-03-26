import React from 'react'
import {Switch, Route} from 'react-router-dom'
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

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default App
