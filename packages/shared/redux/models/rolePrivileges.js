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

// 角色权限 =》 角色管理

// action type
const LOAD = 'mw/rolePrivileges/LOAD'
const LOAD_SUCCESS = 'mw/rolePrivileges/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/rolePrivileges/LOAD_FAILURE'
const UPDATE_SUCCESS = 'mw/rolePrivilegesEdit/UPDATE_SUCCESS'

// initialState
const initialState = {
  isFetching: false,
  list: [],
  error: null,
  page: 1,
  pageSize: 10,
  total: 0
}

// reducer
export default createReducer(initialState, {
  [LOAD]: (state, action) => {
    return { ...state, isFetching: true, error: null }
  },
  [LOAD_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      isFetching: false,
      list: payload.list,
      page: payload.page,
      pageSize: payload.pageSize,
      total: payload.total
    }
  },
  [LOAD_FAILURE]: (state, action) => {
    return {...state, isFetching: false, error: action.payload}
  },
  [UPDATE_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      resourceIds: payload.resourceIds,
      roleName: payload.roleName,
      description: payload.description
    }
  }
})

// 获取列表
export const fetchroleList = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/manufactory/roles')
    .query(query)
    .then(payload => {
      // payload后端反回数据 normalize前面的参数是原始数据，后面的是规范的
      const data = normalize(payload.data, {list: [schema.rolePrivileges]})
      // data数据处理
      dispatch(actions.add(data.entities))
      dispatch({type: LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

// 删除
export const delRolePer = id => (dispatch, getState, {schema, actions, request}) => {
  // 删除开始
  dispatch(actions.del(schema.rolePrivileges, id))
  // console.log(id)
  return request
    .del(`/manufactory/roles/${id}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.rolePrivileges, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.rolePrivileges, id, payload))
      throw payload
    })
}

// 新增
export const saveInsertRolePer = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.rolePrivileges, body))
  return request
    .post('/manufactory/roles')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.rolePrivileges, body))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.rolePrivileges, body, payload))
      throw payload
    })
}

// 获取详情
export const getPerRoleInfo = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.load(schema.goods, body.id))
  return request
    .get(`/manufactory/roles/${body.id}`)
    .query(body)
    .then(payload => {
      dispatch({type: UPDATE_SUCCESS, payload: payload.data})
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.rolePrivileges, body.id, payload))
      throw payload
    })
}

// 修改
export const saveUpdateRolePer = body => (dispatch, getState, {schema, actions, request}) => {
  let pathName = window.location.pathname
  let id = pathName.split('/')[pathName.split('/').length - 1]
  dispatch(actions.update(schema.rolePrivileges, id))
  return request
    .put(`/manufactory/roles/${id}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.rolePrivileges, id, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.rolePrivileges, id, payload))
      throw payload
    })
}

// selecter
export const rolePrivilegesSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  // state点后面的是reducer里面的名称
  // 参数1 参数2模式规范 参数3
  return denormalize(state.rolePrivileges, {list: [schema.rolePrivileges]}, entities)
}
