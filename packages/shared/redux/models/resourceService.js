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
const LOAD = 'mw/resourceService/LOAD'
const LOAD_SUCCESS = 'mw/resourceService/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/resourceService/LOAD_FAILURE'

// initialState
const initialState = {
  list: [],
  error: null
}

// reducer
export default createReducer(initialState, {
  [LOAD]: (state, action) => {
    return { ...state, error: null }
  },
  [LOAD_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      list: payload.list
    }
  },
  [LOAD_FAILURE]: (state, action) => {
    return {...state, error: action.payload}
  }
})

// 获取授权信息
export const getResourcesService = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/manufactory/resources/service/6')
    .then(payload => {
      // payload后端反回数据 normalize前面的参数是原始数据，后面的是规范的
      const data = normalize({list: payload.data}, {list: [schema.resourceService]})
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

export const setResourcesService = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD_SUCCESS, payload: {list: []}})
}

// selecter
export const resourceServiceSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  // state点后面的是reducer里面的名称
  // 参数1 参数2模式规范 参数3
  return denormalize(state.resourceService, {list: [schema.resourceService]}, entities)
}
