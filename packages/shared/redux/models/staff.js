import {normalize, denormalize} from 'normalizr'
import {createReducer, allEntitiesSelecter, entitiesSelecter} from '../redux-normalizr'
import * as schema from '../schema'

// action type
const LOAD = 'mw/staff/LOAD'
const LOAD_SUCCESS = 'mw/staff/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/staff/LOAD_FAILURE'

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
export const fetchStaff = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/ecback/Employee')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.staff]})
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
export const addStaff = body => (dispatch, getState, {schema, actions, request}) => {
  return request
    .post('/ecback/Employee')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.staff, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.staff, payload))
      throw payload
    })
}

// 编辑
export const editStaff = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.rulePricesList, body.id))
  return request
    .put('/ecback/Employee')
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.staff, body.id, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.staff, body.id, payload))
      throw payload
    })
}

// 停用人员权限
export const disabledPermissions = (id, status) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.staff, id))
  return request
    .put(`/ecback/Employee/${id}/${status}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.staff, id, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.staff, id, payload))
      return payload
    })
}

// 启用人员权限
export const abledPermissions = (id, status) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.staff, id))
  return request
    .put(`/ecback/Employee/${id}/${status}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.staff, id, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.staff, id, payload))
      return payload
    })
}

// selecter
export const staffSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.staff, {list: [schema.staff]}, entities)
}
