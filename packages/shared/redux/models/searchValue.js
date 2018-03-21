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
const VALUE_LOAD = 'mw/searchFilters/VALUE_LOAD'
const VALUE_LOAD_SUCCESS = 'mw/searchFilters/VALUE_LOAD_SUCCESS'
const VALUE_LOAD_FAILURE = 'mw/searchFilters/VALUE_LOAD_FAILURE'

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
  [VALUE_LOAD]: (state, action) => {
    return { ...state, error: null, spinning: true }
  },
  [VALUE_LOAD_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      list: payload.list,
      page: payload.page,
      pageSize: payload.pageSize,
      total: payload.total,
      spinning: false
    }
  },
  [VALUE_LOAD_FAILURE]: (state, action) => {
    return {...state, error: action.payload}
  }
})

// 列表
export const getSearchValueList = (query, searchItemId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: VALUE_LOAD})
  return request
    .get(`/manufactory/searchItemValue/${searchItemId}`)
    .query(query)
    .then(payload => {
      // payload后端反回数据 normalize前面的参数是原始数据，后面的是规范的
      const data = normalize(payload.data, {list: [schema.searchValue]})
      // data数据处理
      dispatch(actions.add(data.entities))
      dispatch({type: VALUE_LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: VALUE_LOAD_FAILURE, payload})
      throw payload
    })
}

// 删除
export const delSearchValuePer = (id) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.searchValue, id))
  return request
    .del(`/manufactory/searchItemValue/${id}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.searchValue, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.searchValue, id, payload))
      throw payload
    })
}

// 新建
export const addSearchValue = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.searchValue, body))
  return request
    .post('/manufactory/searchItemValue')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.searchValue, body))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.searchValue, body, payload))
      throw payload
    })
}

// 修改
export const updateSearchValuePer = (body, id) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.searchValue, id))
  return request
    .put(`/manufactory/searchItemValue/${id}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.searchValue, id, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.searchValue, id, payload))
      throw payload
    })
}

// 启用停用
export const openSearchValuePer = (id, status) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.searchValue, id))
  return request
    .put(`/manufactory/searchItemValue/${id}/${status}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.searchValue, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.searchValue, id, payload))
      throw payload
    })
}

// selecter
export const searchValueSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  // state点后面的是reducer里面的名称
  // 参数1 参数2模式规范 参数3
  return denormalize(state.searchValue, {list: [schema.searchValue]}, entities)
}
