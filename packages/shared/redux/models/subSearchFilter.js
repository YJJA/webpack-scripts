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
const SUB_LOAD = 'mw/searchFilters/SUB_LOAD'
const SUB_LOAD_SUCCESS = 'mw/searchFilters/SUB_LOAD_SUCCESS'
const SUB_LOAD_FAILURE = 'mw/searchFilters/SUB_LOAD_FAILURE'
const DETAILS_LOAD = 'mw/searchFilters/DETAILS_LOAD'
const DETAILS_SUCCESS = 'mw/searchFilters/DETAILS_SUCCESS'
const DETAILS_FAILURE = 'mw/searchFilters/DETAILS_FAILURE'

// initialState
const initialState = {
  list: [],
  page: 1,
  pageSize: 10,
  total: 0,
  spinning: false,
  details: {
    subId: '',
    orderNo: '',
    induIds: [],
    categoryName: ''
  },
  error: null
}

// reducer
export default createReducer(initialState, {
  [SUB_LOAD]: (state, action) => {
    return { ...state, error: null, spinning: true }
  },
  [SUB_LOAD_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      list: payload.list,
      page: payload.page,
      pageSize: payload.pageSize,
      total: payload.total,
      spinning: false
    }
  },
  [SUB_LOAD_FAILURE]: (state, action) => {
    return {...state, error: action.payload, spinning: false}
  },
  [DETAILS_LOAD]: (state, action) => {
    return { ...state, error: null }
  },
  [DETAILS_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      details: payload
    }
  },
  [DETAILS_FAILURE]: (state, action) => {
    return {...state, error: action.payload}
  }
})

// 列表
export const getSubList = (query) => (dispatch, getState, {schema, actions, request}) => {
  let parentId = query.parentId
  let body = {
    page: query.page,
    pageSize: query.pageSize,
    searchKey: query.searchKey
  }
  dispatch({type: SUB_LOAD})
  return request
    .get(`/manufactory/searchCategory/sub/${parentId}`)
    .query(body)
    .then(payload => {
      // payload后端反回数据 normalize前面的参数是原始数据，后面的是规范的
      const data = normalize(payload.data, {list: [schema.subSearchFilters]})
      // data数据处理
      dispatch(actions.add(data.entities))
      dispatch({type: SUB_LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: SUB_LOAD_FAILURE, payload})
      throw payload
    })
}

// 删除
export const delSubSearchPer = (id) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.subSearchFilters, id))
  return request
    .del(`/manufactory/searchCategory/${id}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.subSearchFilters, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.subSearchFilters, id, payload))
      throw payload
    })
}

// 新建
export const addSubSearchPer = (body, parentId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.subSearchFilters, parentId))
  return request
    .post(`/manufactory/searchCategory/sub/${parentId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.subSearchFilters, body))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.subSearchFilters, body, payload))
      throw payload
    })
}

// 修改
export const updateSubSearchCategoryPer = (body, id) => (dispatch, getState, {schema, actions, request}) => {
  return request
    .put(`/manufactory/searchCategory/sub/${id}`)
    .send(body)
    .then(payload => {
      // dispatch(actions.updateSuccess(schema, id, payload))
      return payload
    })
    .catch(payload => {
      // dispatch(actions.updateFailure(schema, id, payload))
      throw payload
    })
}

// 获取编辑数据
export const getSubDetails = (subId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: DETAILS_LOAD})
  return request
    .get(`/manufactory/searchCategory/industry/${subId}`)
    .then(payload => {
      dispatch({type: DETAILS_SUCCESS, payload: payload.data})
      return payload
    })
    .catch(payload => {
      dispatch({type: DETAILS_FAILURE, payload})
      throw payload
    })
}

// 清空获取的数据
export const cleanSubDetails = () => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: DETAILS_SUCCESS, payload: {subId: '', orderNo: '', induIds: [], categoryName: ''}})
}

// 启用停用用
export const openSubSearchPer = (id, status) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.subSearchFilters, id))
  return request
    .put(`/manufactory/searchCategory/${id}/${status}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.subSearchFilters, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.subSearchFilters, id, payload))
      throw payload
    })
}

// selecter
export const subSearchFiltersSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  // state点后面的是reducer里面的名称
  // 参数1 参数2模式规范 参数3
  return denormalize(state.subSearchFilters, {list: [schema.subSearchFilters]}, entities)
}
