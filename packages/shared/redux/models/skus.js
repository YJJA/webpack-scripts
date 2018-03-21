import request from '../../server/request'
import {mapData, updateDataOne, deleteData} from '../../lib/helpers'

// action types
const LOAD = 'mw/skus/LOAD'
const LOAD_SUCCESS = 'mw/skus/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/skus/LOAD_FAILURE'

const UPDATE = 'mw/products/UPDATE'
const UPDATE_SUCCESS = 'mw/products/UPDATE_SUCCESS'
const UPDATE_FAILURE = 'mw/products/UPDATE_FAILURE'

const initialState = {
  isFetching: false,
  table: [],
  list: [],
  error: null
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
    case UPDATE:
      return {...state, isFetching: true, error: null}

    case LOAD_FAILURE:
    case UPDATE_FAILURE:
      return {...state, isFetching: false, error: action.payload}

    case LOAD_SUCCESS:
      return {
        ...state,
        table: action.payload.data.table,
        list: action.payload.data.sku,
        total: action.payload.data.total,
        isFetching: false
      }

    case UPDATE_SUCCESS:
      return {
        ...state,
        isFetching: false
      }

    default:
      return state
  }
}

// actions
export const fetchSKUs = (goodsId, query) => dispatch => {
  dispatch({type: LOAD})
  return request
    .post(`/ecback/goods/${goodsId}/configurations/search`)
    .send(query)
    .then(payload => dispatch({type: LOAD_SUCCESS, payload}))
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

// 设置默认SKU
export const setDefaultSKU = (skuId, body) => dispatch => {
  dispatch({type: UPDATE})
  return request
    .put(`/ecback/goods/configurations/${skuId}`)
    .then(payload => dispatch({type: UPDATE_SUCCESS, payload}))
    .catch(payload => {
      dispatch({type: UPDATE_FAILURE, payload})
      throw payload
    })
}
