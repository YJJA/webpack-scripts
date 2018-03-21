/**
 * 后台商品配置
 */

import {normalize, denormalize} from 'normalizr'
import * as schema from '../schema'
import {
  createReducer,
  allEntitiesSelecter,
  entitiesSelecter,
  entitiesSelecterById,
  fetchStatusSelecter,
  fetchStatusSelecterById
} from '../redux-normalizr'

// action types
const LOAD = 'mw/configurations/LOAD'
const LOAD_SUCCESS = 'mw/configurations/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/configurations/LOAD_FAILURE'

const initialState = {
  isFetching: false,
  list: [],
  total: 0,
  error: null
}

// reducer
export default createReducer(initialState, {
  [LOAD]: (state, action) => {
    return {...state, isFetching: true, error: null}
  },
  [LOAD_SUCCESS]: (state, {payload}) => {
    return {...state, list: payload.list, total: payload.total}
  },
  [LOAD_FAILURE]: (state, {payload}) => {
    return {...state, isFetching: true, error: payload}
  }
})

// actions
export const fetchConfigurations = query => {
  return (dispatch, getState, {schema, actions, request}) => {
    dispatch({type: LOAD})
    return request
      .get('/manufactory/models/configs')
      .query(query)
      .then(payload => {
        const data = normalize(payload.data, {list: [schema.configurations]})
        dispatch(actions.add(data.entities))
        dispatch({type: LOAD_SUCCESS, payload: data.result})
      })
      .catch(payload => {
        dispatch({type: LOAD_FAILURE, payload})
        throw payload
      })
  }
}

export const fetchConfigurationsOne = id => {
  return (dispatch, getState, {schema, actions, request}) => {
    dispatch(actions.load(schema.configurations, id))
    return request
      .get(`/manufactory/models/configs/${id}`)
      .then(payload => {
        dispatch(actions.loadSuccess(schema.configurations, id, payload.data || {}))
        return payload
      })
      .catch(payload => {
        dispatch(actions.loadFailure(schema.configurations, id, payload))
        throw payload
      })
  }
}

export const updateConfigurations = (id, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.configurations, id))
  return request
    .put(`/manufactory/models/configs`)
    .send({...body, id})
    .then(payload => {
      dispatch(actions.insertSuccess(schema.configurations, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.configurations, id, payload))
      throw payload
    })
}

export const insertConfigurations = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.configurations, 'insert'))
  return request
    .post('/manufactory/models/configs')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.configurations, 'insert'))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.configurations, 'insert', payload))
      throw payload
    })
}

export const deleteConfigurations = id => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.configurations, id))
  return request
    .del(`/manufactory/models/configs/${id}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.configurations, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.configurations, id, payload))
      throw payload
    })
}

// 启用
export const enabledConfigurations = id => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.configurations, id))
  return request
    .put(`/manufactory/models/configs/${id}/on`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.configurations, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.configurations, id, payload))
      throw payload
    })
}

// 禁用
export const disableConfigurations = id => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.configurations, id))
  return request
    .put(`/manufactory/models/configs/${id}/off`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.configurations, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.configurations, id, payload))
      throw payload
    })
}

// selecter
export const configurationsSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  const configurations = denormalize(state.configurations, {list: [schema.configurations]}, entities)
  return configurations
}

export const orderOneSelecter = (state, id) => {
  return entitiesSelecterById(state, schema.configurations, id)
}
