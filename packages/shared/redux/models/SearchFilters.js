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

// 搜索筛选

// action type
const FIRST_LOAD = 'mw/searchFilters/FIRST_LOAD'
const FIRST_LOAD_SUCCESS = 'mw/searchFilters/FIRST_LOAD_SUCCESS'
const FIRST_LOAD_FAILURE = 'mw/searchFilters/FIRST_LOAD_FAILURE'

// initialState
const initialState = {
  list: [],
  page: 1,
  pageSize: 10,
  total: 0,
  spinning: false,
  error: null
}

// reducer
export default createReducer(initialState, {
  [FIRST_LOAD]: (state, action) => {
    return { ...state, error: null, spinning: true }
  },
  [FIRST_LOAD_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      list: payload.list,
      page: payload.page,
      pageSize: payload.pageSize,
      total: payload.total,
      spinning: false
    }
  },
  [FIRST_LOAD_FAILURE]: (state, action) => {
    return {...state, error: action.payload, spinning: false}
  }
})

// 列表
export const getFirstList = (query) => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: FIRST_LOAD})
  return request
    .get('/manufactory/searchCategory')
    .query(query)
    .then(payload => {
      // payload后端反回数据 normalize前面的参数是原始数据，后面的是规范的
      const data = normalize(payload.data, {list: [schema.searchFilters]})
      // data数据处理
      dispatch(actions.add(data.entities))
      dispatch({type: FIRST_LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: FIRST_LOAD_FAILURE, payload})
      throw payload
    })
}

// 删除
export const delSearchPer = (id) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.searchFilters, id))
  return request
    .del(`/manufactory/searchCategory/${id}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.searchFilters, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.searchFilters, id, payload))
      throw payload
    })
}

// 新建
export const addSearchPer = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.searchFilters, body))
  return request
    .post('/manufactory/searchCategory')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.searchFilters, body))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.searchFilters, body, payload))
      throw payload
    })
}

// 修改
export const updateSearchPer = (body, id) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.searchFilters, id))
  return request
    .put(`/manufactory/searchCategory/${id}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.searchFilters, id, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.searchFilters, id, payload))
      throw payload
    })
}

// 启用停用
export const openSearchPer = (id, status) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.searchFilters, id))
  return request
    .put(`/manufactory/searchCategory/${id}/${status}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.searchFilters, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.searchFilters, id, payload))
      throw payload
    })
}

// selecter
export const searchFiltersSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  // state点后面的是reducer里面的名称
  // 参数1 参数2模式规范 参数3
  return denormalize(state.searchFilters, {list: [schema.searchFilters]}, entities)
}
