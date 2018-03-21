import {normalize, denormalize} from 'normalizr'
import {createReducer, allEntitiesSelecter} from '../redux-normalizr'
import * as schema from '../schema'

// action type
const LOAD_REQUEST = 'mw/factories/LOAD_REQUEST'
const LOAD_SUCCESS = 'mw/factories/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/factories/LOAD_FAILURE'

const ADDLISTDATE_SUCCESS = 'mw/factories/ADDLISTDATE_SUCCESS'

const CANCELLISTDATE_SUCCESS = 'mw/factories/CANCELLISTDATE_SUCCESS'

const initialState = {
  isFetching: false,
  error: null,
  list: [],
  total: 0
}

// reducer
export default createReducer(initialState, {
  [LOAD_REQUEST]: (state) => {
    return {...state, isFetching: true, error: null}
  },
  [LOAD_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      list: payload.list,
      total: payload.total,
      isFetching: false
    }
  },
  [ADDLISTDATE_SUCCESS]: (state, {payload}) => {
    return {...state, ...payload, isFetching: false}
  },
  [CANCELLISTDATE_SUCCESS]: (state, {payload}) => {
    return {...state, ...payload, isFetching: false}
  },
  [LOAD_FAILURE]: (state, {payload}) => {
    return {...state, isFetching: false, error: payload}
  }
})

// action
export const fetchFactories = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({ type: LOAD_REQUEST })
  return request
    .get('/ecback/factorys')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.factories]})
      dispatch(actions.add(data.entities))
      dispatch({type: LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({ type: LOAD_FAILURE, payload })
      throw payload
    })
}

export const updateFactories = (factoriesId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.factories, factoriesId))
  return request
    .put(`/ecback/factorys/${factoriesId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.factories, factoriesId, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.factories, factoriesId, payload))
      throw payload
    })
}

export const deleteFactories = factoriesId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.factories, factoriesId))
  return request
    .del(`/ecback/factorys/${factoriesId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.factories, factoriesId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.factories, factoriesId, payload))
      throw payload
    })
}

export const addListData = factories => (dispatch, getState, {schema, actions}) => {
  const data = normalize(factories, {list: [schema.factories]})
  dispatch(actions.add(data.entities))
  dispatch({type: ADDLISTDATE_SUCCESS, payload: data.result})
}

export const cancelListData = factories => (dispatch, getState, {schema, actions}) => {
  const data = normalize(factories, {list: [schema.factories]})
  dispatch(actions.add(data.entities))
  dispatch({type: CANCELLISTDATE_SUCCESS, payload: data.result})
}

export const addFactories = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.factories))
  return request
    .post('/ecback/factorys')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.factories, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.factories, payload))
      throw payload
    })
}

// selecter
export const factoriesSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.factories, {list: [schema.factories]}, entities)
}
