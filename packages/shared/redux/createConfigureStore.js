import {createStore, compose, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {routerMiddleware} from 'react-router-redux'
import {
  createEntitiesReducer,
  entitiesActions
} from './redux-normalizr'
import * as schema from './schema'
import request from '../server/request'

const entitiesReducer = createEntitiesReducer(schema)

const logger = store => next => action => {
  console.log('dispatching', action)
  return next(action)
}

const createConfigureStore = (reducers, hot) => (history, initialState) => {
  const middlewares = [
    thunk.withExtraArgument({schema, request, actions: entitiesActions}),
    routerMiddleware(history),
    logger
  ]

  const dev = process.env.NODE_ENV !== 'production' && typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'
  const enhancers = [
    applyMiddleware(...middlewares),
    dev ? window.devToolsExtension() : f => f
  ]

  const rootReducer = combineReducers({...reducers, entities: entitiesReducer})
  const store = createStore(rootReducer, initialState, compose(...enhancers))

  if (module.hot) {
    hot((reducers) => {
      const nextRootReducer = combineReducers({...reducers, entities: entitiesReducer})
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default createConfigureStore
