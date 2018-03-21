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
const ITEM_LOAD = 'mw/searchFilters/ITEM_LOAD'
const ITEM_LOAD_SUCCESS = 'mw/searchFilters/ITEM_LOAD_SUCCESS'
const ITEM_LOAD_FAILURE = 'mw/searchFilters/ITEM_LOAD_FAILURE'

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
  [ITEM_LOAD]: (state, action) => {
    return { ...state, error: null, spinning: true }
  },
  [ITEM_LOAD_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      list: payload.list,
      page: payload.page,
      pageSize: payload.pageSize,
      total: payload.total,
      spinning: false
    }
  },
  [ITEM_LOAD_FAILURE]: (state, action) => {
    return {...state, error: action.payload}
  }
})

// 列表
export const getSearchItemList = (query, subCategoryId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: ITEM_LOAD})
  return request
    .get(`/manufactory/searchItem/${subCategoryId}`)
    .query(query)
    .then(payload => {
      // payload后端反回数据 normalize前面的参数是原始数据，后面的是规范的
      const data = normalize(payload.data, {list: [schema.searchItemValue]})
      // data数据处理
      dispatch(actions.add(data.entities))
      dispatch({type: ITEM_LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: ITEM_LOAD_FAILURE, payload})
      throw payload
    })
}

// 删除
export const delSearchItemPer = (id) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.searchItemValue, id))
  return request
    .del(`/manufactory/searchItem/${id}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.searchItemValue, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.searchItemValue, id, payload))
      throw payload
    })
}

// 新建
export const addSearchItem = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.searchItemValue, body))
  return request
    .post('/manufactory/searchItem')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.searchItemValue, body))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.searchItemValue, body, payload))
      throw payload
    })
}

// 修改
export const updateSearchItemPer = (body, id) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.searchItemValue, id))
  return request
    .put(`/manufactory/searchItem/${id}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.searchItemValue, id, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.searchItemValue, id, payload))
      throw payload
    })
}

// 启用停用
export const openSearchItemPer = (id, status) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.searchItemValue, id))
  return request
    .put(`/manufactory/searchItem/${id}/${status}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.searchItemValue, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.searchItemValue, id, payload))
      throw payload
    })
}

// selecter
export const searchItemValueSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  // state点后面的是reducer里面的名称
  // 参数1 参数2模式规范 参数3
  return denormalize(state.searchItemValue, {list: [schema.searchItemValue]}, entities)
}
