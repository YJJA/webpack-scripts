import {normalize, denormalize} from 'normalizr'
import {createReducer, allEntitiesSelecter, entitiesSelecter} from '../redux-normalizr'
import * as schema from '../schema'

// action type
const LOAD = 'mw/menusPermissions/LOAD'
const LOAD_SUCCESS = 'mw/menusPermissions/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/menusPermissions/LOAD_FAILURE'

const initialState = {
  error: null,
  list: []
}

// reducer
export default createReducer(initialState, {
  [LOAD]: (state) => {
    return {...state, error: null}
  },
  [LOAD_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      list: payload.list
    }
  },
  [LOAD_FAILURE]: (state, {payload}) => {
    return {...state, error: payload}
  }
})

// action
export const getResourcesService = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/manufactory/resources/service/4')
    .query(query)
    .then(payload => {
      const data = normalize({list: payload.data}, {list: [schema.menusPermissions]})
      dispatch(actions.add(data.entities))
      dispatch({type: LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

export const setResourcesService = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD_SUCCESS, payload: {list: []}})
}

// selecter
export const resourceServiceSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.menusPermissions, {list: [schema.menusPermissions]}, entities)
}
