import {normalize, denormalize} from 'normalizr'
import {createReducer, allEntitiesSelecter, entitiesSelecter} from '../redux-normalizr'
import * as schema from '../schema'

// action type
const LOAD = 'mw/role/LOAD'
const LOAD_SUCCESS = 'mw/role/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/role/LOAD_FAILURE'
const UPDATE_SUCCESS = 'mw/role/UPDATE_SUCCESS'

const initialState = {
  isFetching: false,
  error: null,
  list: [],
  detail: {},
  total: 0
}

// reducer
export default createReducer(initialState, {
  [LOAD]: (state) => {
    return {...state, isFetching: true, error: null}
  },
  [LOAD_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      isFetching: false,
      list: payload.list,
      total: payload.total
    }
  },
  [UPDATE_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      isFetching: false,
      detail: payload
    }
  },
  [LOAD_FAILURE]: (state, {payload}) => {
    return {...state, isFetching: false, error: payload}
  }
})

// action
export const fetchRole = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/manufactory/roles')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.role]})
      dispatch(actions.add(data.entities))
      dispatch({type: LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

// 新增
export const addRole = body => (dispatch, getState, {schema, actions, request}) => {
  return request
    .post('/manufactory/roles')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.role, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.role, payload))
      throw payload
    })
}

// 编辑
export const editRole = (body, id) => (dispatch, getState, {schema, actions, request}) => {
  return request
    .put(`/manufactory/roles/${id}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.role, id, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.role, id, payload))
      throw payload
    })
}

// 删除
export const delRole = id => (dispatch, getState, {schema, actions, request}) => {
  return request
    .del(`/manufactory/roles/${id}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.role, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.role, id))
      throw payload
    })
}

// 获取详情
export const fetchRoleDetail = id => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.load(schema.goods, id))
  return request
    .get(`/manufactory/roles/${id}`)
    .then(payload => {
      dispatch({type: UPDATE_SUCCESS, payload: payload.data})
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.role, id, payload))
      throw payload
    })
}

// selecter
export const roleSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.role, {list: [schema.role]}, entities)
}
