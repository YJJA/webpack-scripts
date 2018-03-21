import {normalize, denormalize} from 'normalizr'
import {createReducer, allEntitiesSelecter, entitiesSelecter} from '../redux-normalizr'
import * as schema from '../schema'

import '../mocks/staff'

// action type
const LOAD = 'mw/rolePermissions/LOAD'
const LOAD_SUCCESS = 'mw/rolePermissions/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/rolePermissions/LOAD_FAILURE'

const initialState = {
  isFetching: false,
  error: null,
  list: [],
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
  [LOAD_FAILURE]: (state, {payload}) => {
    return {...state, isFetching: false, error: payload}
  }
})

// action
export const fetchRolePermissions = () => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/ecback/Employee/getRoleList')
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.rolePermissions]})
      dispatch(actions.add(data.entities))
      dispatch({type: LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

// 编辑分配权限查询

// 分配权限
export const addStaff = body => (dispatch, getState, {schema, actions, request}) => {
  return request
    .post('/ecback/Employee')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.rolePermissions, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.rolePermissions, payload))
      throw payload
    })
}

// selecter
export const rolePermissionsSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.rolePermissions, {list: [schema.rolePermissions]}, entities)
}
