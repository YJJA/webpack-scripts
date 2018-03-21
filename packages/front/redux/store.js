import reducers from './reducers'
import createConfigureStore from '../../shared/redux/createConfigureStore'

const configureStore = createConfigureStore(reducers, replaceReducer => {
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      try {
        const reducers = require('./reducers').default
        replaceReducer(reducers)
      } catch (error) {
        console.error(`==> 😭  Reducer hot reloading error ${error}`)
      }
    })
  }
})

export default configureStore
